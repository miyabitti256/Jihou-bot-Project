import { logger } from "@lib/logger";
import {
  UserServiceError,
  createOrUpdateUser,
  getUserData,
  updateUserMoney,
} from "@services/users";
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
