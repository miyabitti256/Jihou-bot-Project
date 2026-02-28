import { zValidator } from "@hono/zod-validator";
import { logger } from "@lib/logger";
import {
  DiscordApiError,
  fetchChannel,
  fetchDiscordUser,
} from "@services/discord/discord-api";
import { getUserGuilds, verifyUserGuildAccess } from "@services/guilds/guild";
import {
  createOrUpdateUser,
  getUserData,
  getUsersFromSameGuilds,
  UserServiceError,
  updateUserMoney,
} from "@services/users/user";
import { Hono } from "hono";
import type { AppEnv } from "../../env";
import {
  channelIdParamSchema,
  userIdParamSchema,
  userIncludesQuerySchema,
  userMoneyUpdateSchema,
  usersListQuerySchema,
  userUpdateSchema,
} from "../../schemas";

export const users = new Hono<AppEnv>()
  .get(
    "/:userId",
    zValidator("param", userIdParamSchema),
    zValidator("query", userIncludesQuerySchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const { includes } = c.req.valid("query");

      try {
        const data = await getUserData(userId, includes);

        // 他ユーザーのプロフィールを閲覧する場合、
        // 認証ユーザーが所属していないギルドの時報を非表示にする。
        // ギルドIDの漏洩はデフォルトパーミッションでは非公開情報のため。
        const authenticatedUserId = c.get("authenticatedUserId");
        if (
          authenticatedUserId &&
          authenticatedUserId !== userId &&
          data.ScheduledMessage &&
          Array.isArray(data.ScheduledMessage) &&
          data.ScheduledMessage.length > 0
        ) {
          const viewerGuilds = await getUserGuilds(authenticatedUserId);
          const viewerGuildIds = new Set(viewerGuilds.map((g) => g.guildId));

          const filteredMessages = data.ScheduledMessage.filter(
            (msg: { guildId: string }) => viewerGuildIds.has(msg.guildId),
          );

          return c.json(
            {
              data: {
                ...data,
                ScheduledMessage: filteredMessages,
              },
            },
            200,
          );
        }

        return c.json(
          {
            data,
          },
          200,
        );
      } catch (error) {
        if (error instanceof UserServiceError) {
          logger.error(`[users-api] ${error.code}: ${error.message}`);
          return c.json(
            {
              error: {
                code: error.code,
                message: error.message,
              },
            },
            error.code === "USER_NOT_FOUND" ? 404 : 500,
          );
        }

        logger.error(`[users-api] 不明なエラー: ${error}`);
        return c.json(
          {
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "サーバー内部エラーが発生しました",
            },
          },
          500,
        );
      }
    },
  )
  .put(
    "/:userId",
    zValidator("param", userIdParamSchema),
    zValidator("json", userUpdateSchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const authenticatedUserId = c.get("authenticatedUserId");

      if (userId !== authenticatedUserId) {
        return c.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "Forbidden - Insufficient permissions",
            },
          },
          403,
        );
      }

      try {
        const body = c.req.valid("json");

        const userData = {
          id: userId,
          ...body,
        };

        const updatedUser = await createOrUpdateUser(userData);

        return c.json(
          {
            data: updatedUser,
          },
          200,
        );
      } catch (error) {
        if (error instanceof UserServiceError) {
          logger.error(`[users-api] ${error.code}: ${error.message}`);
          return c.json(
            {
              error: {
                code: error.code,
                message: error.message,
              },
            },
            500,
          );
        }

        logger.error(`[users-api] ユーザー更新エラー: ${error}`);
        return c.json(
          {
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "サーバー内部エラーが発生しました",
            },
          },
          500,
        );
      }
    },
  )
  .put(
    "/:userId/money",
    zValidator("param", userIdParamSchema),
    zValidator("json", userMoneyUpdateSchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const authenticatedUserId = c.get("authenticatedUserId");

      if (userId !== authenticatedUserId) {
        return c.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "Forbidden - Insufficient permissions",
            },
          },
          403,
        );
      }

      try {
        const { amount, operation } = c.req.valid("json");
        const updatedUser = await updateUserMoney(userId, amount, operation);

        return c.json(
          {
            data: {
              userId: updatedUser.id,
              money: updatedUser.money,
            },
          },
          200,
        );
      } catch (error) {
        if (error instanceof UserServiceError) {
          logger.error(`[users-api] ${error.code}: ${error.message}`);
          return c.json(
            {
              error: {
                code: error.code,
                message: error.message,
              },
            },
            error.code === "USER_NOT_FOUND" ? 404 : 500,
          );
        }

        logger.error(`[users-api] 所持金更新エラー: ${error}`);
        return c.json(
          {
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "サーバー内部エラーが発生しました",
            },
          },
          500,
        );
      }
    },
  )
  .get(
    "/guilds/:userId",
    zValidator("param", userIdParamSchema),
    zValidator("query", usersListQuerySchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const { page, limit, search } = c.req.valid("query");

      const authenticatedUserId = c.get("authenticatedUserId");
      if (userId !== authenticatedUserId) {
        return c.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "Forbidden - Insufficient permissions",
            },
          },
          403,
        );
      }

      try {
        const result = await getUsersFromSameGuilds(
          userId,
          page,
          limit,
          search,
        );

        return c.json(
          {
            data: result,
          },
          200,
        );
      } catch (error) {
        if (error instanceof UserServiceError) {
          logger.error(`[users-api] ${error.code}: ${error.message}`);
          return c.json(
            {
              error: {
                code: error.code,
                message: error.message,
              },
            },
            error.code === "USER_NOT_FOUND" ? 404 : 500,
          );
        }

        logger.error(`[users-api] ユーザー一覧取得エラー: ${error}`);
        return c.json(
          {
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "サーバー内部エラーが発生しました",
            },
          },
          500,
        );
      }
    },
  )
  .get(
    "/:userId/discord",
    zValidator("param", userIdParamSchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const authenticatedUserId = c.get("authenticatedUserId");

      if (userId !== authenticatedUserId) {
        return c.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "Forbidden - Insufficient permissions",
            },
          },
          403,
        );
      }

      try {
        const userData = await fetchDiscordUser(userId);
        return c.json(
          {
            data: userData,
          },
          200,
        );
      } catch (error) {
        if (error instanceof DiscordApiError) {
          return c.json(
            {
              error: {
                code: error.code,
                message: error.message,
              },
            },
            404,
          );
        }
        logger.error(`Discord API error: ${error}`);
        return c.json(
          {
            error: {
              code: "DISCORD_API_ERROR",
              message: "Failed to fetch user data",
            },
          },
          500,
        );
      }
    },
  )
  .get(
    "/channels/:channelId/discord",
    zValidator("param", channelIdParamSchema),
    async (c) => {
      const { channelId } = c.req.valid("param");

      try {
        const channelData = await fetchChannel(channelId);

        // Check if user is in the guild of the channel
        if (channelData.guildId) {
          const authenticatedUserId = c.get("authenticatedUserId");
          const hasAccess = await verifyUserGuildAccess(
            authenticatedUserId,
            channelData.guildId,
          );
          if (!hasAccess) {
            return c.json(
              {
                error: {
                  code: "FORBIDDEN",
                  message:
                    "Forbidden - Insufficient permissions to access this channel",
                },
              },
              403,
            );
          }
        }

        return c.json(
          {
            data: channelData,
          },
          200,
        );
      } catch (error) {
        if (error instanceof DiscordApiError) {
          return c.json(
            {
              error: {
                code: error.code,
                message: error.message,
              },
            },
            404,
          );
        }
        logger.error(`Discord API error: ${error}`);
        return c.json(
          {
            error: {
              code: "DISCORD_API_ERROR",
              message: "Failed to fetch channel data",
            },
          },
          500,
        );
      }
    },
  );
