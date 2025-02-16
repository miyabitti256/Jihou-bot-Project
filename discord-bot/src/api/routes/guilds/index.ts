import { Hono } from "hono";
import { message } from "./scheduled-message";
import { prisma } from "@lib/prisma";
import { logger } from "@lib/logger";
import { z } from "zod";

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

  const includeMap = {
    roles: includes.includes("roles"),
    channels: includes.includes("channels"),
    members: includes.includes("members"),
    ScheduledMessage: includes.includes("messages"),
  };

  try {
    const data = await prisma.guild.findUnique({
      where: {
        id: guildIdResult.data,
      },
      include: {
        ...includeMap,
      },
    });

    if (!data) {
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

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
    logger.error(error);
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
    const data = await prisma.guildMembers.findMany({
      where: {
        userId,
      },
    });

    return c.json(
      {
        status: "success",
        data,
      },
      200,
    );
  } catch (error) {
    logger.error(error);
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
