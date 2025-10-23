import { logger } from "@lib/logger";
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
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildIdResult.data}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      logger.error(
        `Failed to fetch guild ${guildIdResult.data}: ${response.status}`,
      );
      return c.json(
        {
          status: "error",
          error: {
            code: "GUILD_NOT_FOUND",
            message: "Guild not found or bot lacks access",
            details: null,
          },
        },
        404,
      );
    }

    const guildData = await response.json();
    return c.json({
      status: "success",
      data: guildData,
    });
  } catch (error) {
    logger.error(`Discord API error: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "DISCORD_API_ERROR",
          message: "Failed to fetch guild data",
          details: null,
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
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildIdResult.data}/channels`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      logger.error(
        `Failed to fetch channels for guild ${guildIdResult.data}: ${response.status}`,
      );
      return c.json(
        {
          status: "error",
          error: {
            code: "CHANNELS_NOT_FOUND",
            message: "Failed to fetch guild channels",
            details: null,
          },
        },
        404,
      );
    }

    const channelsData = await response.json();
    return c.json({
      status: "success",
      data: channelsData,
    });
  } catch (error) {
    logger.error(`Discord API error: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "DISCORD_API_ERROR",
          message: "Failed to fetch channels data",
          details: null,
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
          code: "INVALIDREQUEST",
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
          code: "INVALIDREQUEST",
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
            code: "NOTFOUND",
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
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
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
          code: "INVALIDREQUEST",
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
          code: "INTERNALSERVERERROR",
          message: "Internal server error",
          details: error,
        },
      },
      500,
    );
  }
});
