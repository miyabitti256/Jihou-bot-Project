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
