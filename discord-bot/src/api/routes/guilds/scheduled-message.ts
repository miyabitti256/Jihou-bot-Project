import { env } from "@bot/lib/env";
import { logger } from "@bot/lib/logger";
import {
  getUserGuilds,
  verifyUserGuildAccess,
} from "@bot/services/guilds/guild";
import {
  createScheduledMessage,
  deleteScheduledMessage,
  getAllScheduledMessages,
  getScheduledMessageById,
  getScheduledMessages,
  type ScheduledMessageCreateData,
  ScheduledMessageError,
  type ScheduledMessageUpdateData,
  updateScheduledMessage,
} from "@bot/services/guilds/scheduled-message";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppEnv } from "../../env";
import {
  idParamSchema,
  scheduledMessageCreateSchema,
  scheduledMessageDeleteSchema,
  scheduledMessageQuerySchema,
  scheduledMessageUpdateSchema,
} from "../../schemas";

export const message = new Hono<AppEnv>()
  .get("/all", async (c) => {
    try {
      const authenticatedUserId = c.get("authenticatedUserId");
      if (!authenticatedUserId) {
        return c.json(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Unauthorized",
            },
          },
          401,
        );
      }

      // ユーザーが所属するギルドのメッセージのみ返す
      const userGuilds = await getUserGuilds(authenticatedUserId);
      const guildIds = userGuilds.map((g) => g.guildId);

      const allMessages = await getAllScheduledMessages();
      const data = allMessages.filter((msg) => guildIds.includes(msg.guildId));

      return c.json(
        {
          data,
        },
        200,
      );
    } catch (error) {
      logger.error(
        `[scheduledmessage-api] Error getting all messages: ${error}`,
      );
      return c.json(
        {
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            details: env.NODE_ENV === "development" ? String(error) : null,
          },
        },
        500,
      );
    }
  })
  .get(
    "/:id",
    zValidator("param", idParamSchema),
    zValidator("query", scheduledMessageQuerySchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { type: queryType } = c.req.valid("query");

      const authenticatedUserId = c.get("authenticatedUserId");
      if (!authenticatedUserId) {
        return c.json(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Unauthorized",
            },
          },
          401,
        );
      }

      // ギルド照会時はギルドへのアクセス権を検証
      if (queryType === "guild") {
        const hasAccess = await verifyUserGuildAccess(authenticatedUserId, id);
        if (!hasAccess) {
          return c.json(
            {
              error: {
                code: "FORBIDDEN",
                message: "Forbidden - Insufficient permissions for this guild",
              },
            },
            403,
          );
        }
      } else {
        // ユーザー照会時は自分のIDのみ許可
        if (id !== authenticatedUserId) {
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
      }

      try {
        const data = await getScheduledMessages(id, queryType);

        return c.json(
          {
            data,
          },
          200,
        );
      } catch (error) {
        logger.error(`[scheduledmessage-api] Error getting messages: ${error}`);
        return c.json(
          {
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Internal server error",
              details: env.NODE_ENV === "development" ? String(error) : null,
            },
          },
          500,
        );
      }
    },
  )
  .get("/details/:id", zValidator("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    try {
      const data = await getScheduledMessageById(id);

      // メッセージのギルドへのアクセス権を検証
      const authenticatedUserId = c.get("authenticatedUserId");
      if (authenticatedUserId) {
        const hasAccess = await verifyUserGuildAccess(
          authenticatedUserId,
          data.guildId,
        );
        if (!hasAccess) {
          return c.json(
            {
              error: {
                code: "FORBIDDEN",
                message: "Forbidden - Insufficient permissions for this guild",
              },
            },
            403,
          );
        }
      }

      return c.json(
        {
          data,
        },
        200,
      );
    } catch (error) {
      if (
        error instanceof ScheduledMessageError &&
        error.message === "MESSAGE_NOT_FOUND"
      ) {
        return c.json(
          {
            error: {
              code: "NOTFOUND",
              message: "Scheduled message not found",
            },
          },
          404,
        );
      }

      logger.error(
        `[scheduledmessage-api] Error getting message details: ${error}`,
      );
      return c.json(
        {
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            details: env.NODE_ENV === "development" ? String(error) : null,
          },
        },
        500,
      );
    }
  })
  .post("/", zValidator("json", scheduledMessageCreateSchema), async (c) => {
    const { data: validatedData } = c.req.valid("json");
    const { userId, guildId, ...rest } = validatedData;

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

    const hasAccess = await verifyUserGuildAccess(authenticatedUserId, guildId);
    if (!hasAccess) {
      return c.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Forbidden - Insufficient permissions for this guild",
          },
        },
        403,
      );
    }

    const createData: ScheduledMessageCreateData = {
      ...rest,
      guildId,
      createdUserId: userId,
    };

    try {
      const createdMessage = await createScheduledMessage(createData);

      return c.json(
        {
          data: {
            message: "メッセージのスケジュールに成功しました",
            scheduledMessage: createdMessage,
          },
        },
        200,
      );
    } catch (error) {
      if (error instanceof ScheduledMessageError) {
        if (error.message === "INVALID_TIME_FORMAT") {
          return c.json(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "時刻のフォーマットが不正です",
              },
            },
            400,
          );
        }
        if (error.message === "CHANNEL_NOT_TEXT_CHANNEL") {
          return c.json(
            {
              error: {
                code: "VALIDATION_ERROR",
                message:
                  "指定されたチャンネルはテキストチャンネルではありません",
              },
            },
            400,
          );
        }
        if (error.message === "CHANNEL_NOT_FOUND") {
          return c.json(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "指定されたチャンネルが見つかりません",
              },
            },
            404,
          );
        }
      }

      logger.error(`[scheduledmessage-api] Error creating message: ${error}`);
      return c.json(
        {
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            details: env.NODE_ENV === "development" ? String(error) : null,
          },
        },
        500,
      );
    }
  })
  .patch("/", zValidator("json", scheduledMessageUpdateSchema), async (c) => {
    const { data: validatedData } = c.req.valid("json");
    const { id, guildId, userId, ...rest } = validatedData;

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

    const hasAccess = await verifyUserGuildAccess(authenticatedUserId, guildId);
    if (!hasAccess) {
      return c.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Forbidden - Insufficient permissions for this guild",
          },
        },
        403,
      );
    }

    const updateData: ScheduledMessageUpdateData = {
      id,
      guildId,
      lastUpdatedUserId: userId,
      ...rest,
    };

    try {
      const updatedMessage = await updateScheduledMessage(updateData);

      return c.json(
        {
          data: {
            message: "メッセージの更新に成功しました",
            scheduledMessage: updatedMessage,
          },
        },
        200,
      );
    } catch (error) {
      if (error instanceof ScheduledMessageError) {
        if (error.message === "MESSAGE_NOT_FOUND") {
          return c.json(
            {
              error: {
                code: "NOT_FOUND",
                message: "指定されたメッセージが見つかりません",
              },
            },
            404,
          );
        }

        if (error.message === "INVALID_TIME_FORMAT") {
          return c.json(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "時刻のフォーマットが不正です",
              },
            },
            400,
          );
        }
        if (error.message === "CHANNEL_NOT_TEXT_CHANNEL") {
          return c.json(
            {
              error: {
                code: "VALIDATION_ERROR",
                message:
                  "指定されたチャンネルはテキストチャンネルではありません",
              },
            },
            400,
          );
        }
        if (error.message === "CHANNEL_NOT_FOUND") {
          return c.json(
            {
              error: {
                code: "VALIDATION_ERROR",
                message: "指定されたチャンネルが見つかりません",
              },
            },
            404,
          );
        }
      }

      logger.error(`[scheduledmessage-api] Error updating message: ${error}`);
      return c.json(
        {
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            details: env.NODE_ENV === "development" ? String(error) : null,
          },
        },
        500,
      );
    }
  })
  .delete("/", zValidator("json", scheduledMessageDeleteSchema), async (c) => {
    const { id, guildId } = c.req.valid("json");
    const authenticatedUserId = c.get("authenticatedUserId");

    const hasAccess = await verifyUserGuildAccess(authenticatedUserId, guildId);
    if (!hasAccess) {
      return c.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Forbidden - Insufficient permissions for this guild",
          },
        },
        403,
      );
    }

    try {
      await deleteScheduledMessage(id);

      return c.json(
        {
          data: {
            message: "メッセージの削除に成功しました",
          },
        },
        200,
      );
    } catch (error) {
      if (
        error instanceof ScheduledMessageError &&
        error.message === "MESSAGE_NOT_FOUND"
      ) {
        return c.json(
          {
            error: {
              code: "NOTFOUND",
              message: "指定されたメッセージが見つかりません",
            },
          },
          404,
        );
      }

      logger.error(`[scheduledmessage-api] Error deleting message: ${error}`);
      return c.json(
        {
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
            details: env.NODE_ENV === "development" ? String(error) : null,
          },
        },
        500,
      );
    }
  });
