import { env } from "@bot/lib/env";
import { logger } from "@bot/lib/logger";
import {
  DiscordApiError,
  fetchGuild,
  fetchGuildChannels,
} from "@bot/services/discord/discord-api";
import {
  GuildError,
  type GuildIncludeOptions,
  getGuildWithData,
  getUserGuilds,
} from "@bot/services/guilds/guild";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AppEnv } from "../../env";
import {
  guildIdParamSchema,
  guildIncludesQuerySchema,
  userIdParamSchema,
} from "../../schemas";
import { message } from "./scheduled-message";

export const guilds = new Hono<AppEnv>()
  .route("/scheduledmessage", message)
  .get(
    "/:guildId/discord",
    zValidator("param", guildIdParamSchema),
    async (c) => {
      const { guildId } = c.req.valid("param");

      try {
        const guildData = await fetchGuild(guildId);
        return c.json(
          {
            data: guildData,
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
              message: "Failed to fetch guild data",
            },
          },
          500,
        );
      }
    },
  )
  .get(
    "/:guildId/channels",
    zValidator("param", guildIdParamSchema),
    async (c) => {
      const { guildId } = c.req.valid("param");

      try {
        const channelsData = await fetchGuildChannels(guildId);
        return c.json(
          {
            data: channelsData,
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
              message: "Failed to fetch channels data",
            },
          },
          500,
        );
      }
    },
  )
  .get(
    "/:guildId",
    zValidator("param", guildIdParamSchema),
    zValidator("query", guildIncludesQuerySchema),
    async (c) => {
      const { guildId } = c.req.valid("param");
      const { includes } = c.req.valid("query");

      const includeOptions: GuildIncludeOptions = {
        roles: includes.includes("roles"),
        channels: includes.includes("channels"),
        members: includes.includes("members"),
        messages: includes.includes("messages"),
      };

      try {
        const data = await getGuildWithData(guildId, includeOptions);

        return c.json(
          {
            data,
          },
          200,
        );
      } catch (error) {
        if (
          error instanceof GuildError &&
          error.message === "GUILD_NOT_FOUND"
        ) {
          return c.json(
            {
              error: {
                code: "NOT_FOUND",
                message: "Guild not found",
              },
            },
            404,
          );
        }

        logger.error(`[guild-api] Error: ${error}`);
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
  .get(
    "/members/:userId",
    zValidator("param", userIdParamSchema),
    async (c) => {
      const { userId } = c.req.valid("param");
      const authenticatedUserId = c.get("authenticatedUserId");

      if (authenticatedUserId && userId !== authenticatedUserId) {
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
        const data = await getUserGuilds(userId);

        return c.json(
          {
            data,
          },
          200,
        );
      } catch (error) {
        logger.error(`[guild-api] Error getting user guilds: ${error}`);
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
  );
