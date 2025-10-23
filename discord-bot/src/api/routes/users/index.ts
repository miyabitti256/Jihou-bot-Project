import { logger } from "@lib/logger";
import {
  createOrUpdateUser,
  getUserData,
  getUsersFromSameGuilds,
  UserServiceError,
  updateUserMoney,
} from "@services/users/user";
import { Hono } from "hono";
import { z } from "zod";

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
          message: "無効なクエリパラメータです",
          details: result.error.issues,
        },
      },
      400,
    );
  }

  const { userId, includes } = result.data;

  try {
    const data = await getUserData(userId, includes);

    return c.json({
      status: "success",
      data,
    });
  } catch (error) {
    if (error instanceof UserServiceError) {
      logger.error(`[users-api] ${error.code}: ${error.message}`);
      return c.json(
        {
          status: "error",
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
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部エラーが発生しました",
        },
      },
      500,
    );
  }
});

// ユーザー情報更新API
users.put("/:userId", async (c) => {
  const userId = c.req.param("userId");

  try {
    const body = await c.req.json();

    if (!userId || !body.username) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALID_DATA",
            message: "ユーザーIDとユーザー名は必須です",
          },
        },
        400,
      );
    }

    const userData = {
      id: userId,
      username: body.username,
      discriminator: body.discriminator,
      avatarUrl: body.avatarUrl,
    };

    const updatedUser = await createOrUpdateUser(userData);

    return c.json({
      status: "success",
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof UserServiceError) {
      logger.error(`[users-api] ${error.code}: ${error.message}`);
      return c.json(
        {
          status: "error",
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
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部エラーが発生しました",
        },
      },
      500,
    );
  }
});

// 所持金更新API
users.put("/:userId/money", async (c) => {
  const userId = c.req.param("userId");

  try {
    const body = await c.req.json();

    if (!userId || body.amount === undefined) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALID_DATA",
            message: "ユーザーIDと金額は必須です",
          },
        },
        400,
      );
    }

    const amount = Number(body.amount);
    const operation = body.operation === "set" ? "set" : "add";

    if (Number.isNaN(amount)) {
      return c.json(
        {
          status: "error",
          error: {
            code: "INVALID_AMOUNT",
            message: "金額は数値である必要があります",
          },
        },
        400,
      );
    }

    const updatedUser = await updateUserMoney(userId, amount, operation);

    return c.json({
      status: "success",
      data: {
        userId: updatedUser.id,
        money: updatedUser.money,
      },
    });
  } catch (error) {
    if (error instanceof UserServiceError) {
      logger.error(`[users-api] ${error.code}: ${error.message}`);
      return c.json(
        {
          status: "error",
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
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部エラーが発生しました",
        },
      },
      500,
    );
  }
});

// ユーザー一覧の取得API
users.get("/guilds/:userId", async (c) => {
  const userId = c.req.param("userId");
  const page = Number.parseInt(c.req.query("page") || "1", 10);
  const limit = Number.parseInt(c.req.query("limit") || "20", 10);
  const search = c.req.query("search");

  if (!userId) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_USER_ID",
          message: "ユーザーIDは必須です",
        },
      },
      400,
    );
  }

  try {
    const result = await getUsersFromSameGuilds(userId, page, limit, search);

    return c.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    if (error instanceof UserServiceError) {
      logger.error(`[users-api] ${error.code}: ${error.message}`);
      return c.json(
        {
          status: "error",
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
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部エラーが発生しました",
        },
      },
      500,
    );
  }
});

// Discord API経由でのユーザー情報取得エンドポイント
users.get("/:userId/discord", async (c) => {
  const userIdSchema = z.string().min(1);
  const userIdResult = userIdSchema.safeParse(c.req.param("userId"));

  if (!userIdResult.success) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid userId",
          details: userIdResult.error,
        },
      },
      400,
    );
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/users/${userIdResult.data}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      logger.error(
        `Failed to fetch user ${userIdResult.data}: ${response.status}`,
      );
      return c.json(
        {
          status: "error",
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found or bot lacks access",
            details: null,
          },
        },
        404,
      );
    }

    const userData = await response.json();
    return c.json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    logger.error(`Discord API error: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "DISCORD_API_ERROR",
          message: "Failed to fetch user data",
          details: null,
        },
      },
      500,
    );
  }
});

// Discord API経由でのチャンネル情報取得エンドポイント
users.get("/channels/:channelId/discord", async (c) => {
  const channelIdSchema = z.string().min(1);
  const channelIdResult = channelIdSchema.safeParse(c.req.param("channelId"));

  if (!channelIdResult.success) {
    return c.json(
      {
        status: "error",
        error: {
          code: "INVALID_REQUEST",
          message: "Invalid channelId",
          details: channelIdResult.error,
        },
      },
      400,
    );
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelIdResult.data}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      logger.error(
        `Failed to fetch channel ${channelIdResult.data}: ${response.status}`,
      );
      return c.json(
        {
          status: "error",
          error: {
            code: "CHANNEL_NOT_FOUND",
            message: "Channel not found or bot lacks access",
            details: null,
          },
        },
        404,
      );
    }

    const channelData = await response.json();
    return c.json({
      status: "success",
      data: {
        id: channelData.id,
        name: channelData.name,
        type: channelData.type,
      },
    });
  } catch (error) {
    logger.error(`Discord API error: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "DISCORD_API_ERROR",
          message: "Failed to fetch channel data",
          details: null,
        },
      },
      500,
    );
  }
});
