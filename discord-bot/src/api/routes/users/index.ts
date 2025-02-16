import { prisma } from "@lib/prisma";
import { Hono } from "hono";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { logger } from "@lib/logger";

export const users = new Hono();

const QuerySchema = z.object({
  userId: z.string().min(1),
  includes: z
    .array(z.enum(["scheduledmessage", "omikuji", "coinflip", "janken"]))
    .default([]),
});

users.get("/:userId", async (c) => {
  const result = QuerySchema.safeParse({
    userId: c.req.param("userId"),
    includes: c.req.query("includes")?.split(",") ?? [],
  });

  if (!result.success) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_QUERY",
          message: "Invalid query parameters",
          details: result.error.issues,
        },
      },
      400,
    );
  }

  const { userId, includes } = result.data;

  const includeMap = {
    ScheduledMessage: {
      select: {
        id: true,
        guildId: true,
        channelId: true,
        message: true,
        scheduleTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    Omikuji: {
      take: 10,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    },
    CoinFlip: {
      take: 100,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    },
    JankenChallenger: {
      take: 50,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    },
    JankenOpponent: {
      take: 50,
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    },
  };

  const keyMap = {
    scheduledmessage: "ScheduledMessage",
    omikuji: "Omikuji",
    coinflip: "CoinFlip",
    janken: "Janken",
  } as const;

  const include = includes.reduce((acc, key) => {
    if (key === "janken") {
      return Object.assign({}, acc, {
        JankenChallenger: includeMap.JankenChallenger,
        JankenOpponent: includeMap.JankenOpponent,
      });
    }
    const mappedKey = keyMap[key as keyof typeof keyMap];
    if (mappedKey in includeMap) {
      return Object.assign(acc, {
        [mappedKey]: includeMap[mappedKey as keyof typeof includeMap],
      });
    }
    return acc;
  }, {});

  try {
    const data = await prisma.users.findUnique({
      where: { id: userId },
      include,
    });

    return c.json({
      status: "success",
      data,
    });
  } catch (error) {
    logger.error(error);
    return c.json(
      {
        status: "error",
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
          details: error,
        },
      },
      404,
    );
  }
});
