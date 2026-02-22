import { logger } from "@lib/logger";
import {
  DiscordApiError,
  fetchGuild,
  fetchGuildChannels,
} from "@services/discord/discord-api";
import {
  GuildError,
  type GuildIncludeOptions,
  getGuildWithData,
  getUserGuilds,
} from "@services/guilds/guild";
import { Hono } from "hono";
import { z } from "zod";
import { message } from "./scheduled-message";

export const guilds = new Hono();

guilds.route("/scheduledmessage", message);

// Guild情報取得エンドポイント（Discord API経由）
guilds.get("/:guildId/discord", async (c) => {
  const guildIdSchema = z.string().min(1);
  const guildIdResult = guildIdSchema.safeParse(c.req.param("guildId"));

  if (!guildIdResult.success) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid guildId",
          details: guildIdResult.error,
        },
      },
      400,
    );
  }

  try {
    const guildData = await fetchGuild(guildIdResult.data);
    return c.json({
      status: "success",
      data: guildData,
    });
  } catch (error) {
    if (error instanceof DiscordApiError) {
      return c.json(
        {
          status: "error",
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
        status: "error",
        error: {
          code: "DISCORD_API_ERROR",
          message: "Failed to fetch guild data",
        },
      },
      500,
    );
  }
});

// Guildチャンネル一覧取得エンドポイント
guilds.get("/:guildId/channels", async (c) => {
  const guildIdSchema = z.string().min(1);
  const guildIdResult = guildIdSchema.safeParse(c.req.param("guildId"));

  if (!guildIdResult.success) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid guildId",
          details: guildIdResult.error,
        },
      },
      400,
    );
  }

  try {
    const channelsData = await fetchGuildChannels(guildIdResult.data);
    return c.json({
      status: "success",
      data: channelsData,
    });
  } catch (error) {
    if (error instanceof DiscordApiError) {
      return c.json(
        {
          status: "error",
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
        status: "error",
        error: {
          code: "DISCORD_API_ERROR",
          message: "Failed to fetch channels data",
        },
      },
      500,
    );
  }
});

guilds.get("/:guildId", async (c) => {
  const guildIdSchema = z.string().min(1);
  const guildIdResult = guildIdSchema.safeParse(c.req.param("guildId"));

  if (!guildIdResult.success) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid guildId",
          details: guildIdResult.error,
        },
      },
      400,
    );
  }

  const includesSchema = z
    .string()
    .transform((str) => str.split(","))
    .optional();
  const includesResult = includesSchema.safeParse(c.req.query("includes"));

  if (!includesResult.success) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid includes parameter",
          details: includesResult.error,
        },
      },
      400,
    );
  }

  const includes = includesResult.data ?? [];

  const includeOptions: GuildIncludeOptions = {
    roles: includes.includes("roles"),
    channels: includes.includes("channels"),
    members: includes.includes("members"),
    messages: includes.includes("messages"),
  };

  try {
    const data = await getGuildWithData(guildIdResult.data, includeOptions);

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
    if (error instanceof GuildError && error.message === "GUILD_NOT_FOUND") {
      return c.json(
        {
          status: "error",
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
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});

guilds.get("/members/:userId", async (c) => {
  const userId = c.req.param("userId");

  if (!userId) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid userId",
        },
      },
      400,
    );
  }

  try {
    const data = await getUserGuilds(userId);

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
    logger.error(`[guild-api] Error getting user guilds: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details:
            process.env.NODE_ENV === "development" ? String(error) : null,
        },
      },
      500,
    );
  }
});
