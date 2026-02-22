import type { Context, Next } from "hono";
import { logger } from "./logger";

/**
 * APIキー認証ミドルウェア
 * X-API-Key ヘッダーを検証する。開発環境でもバイパスなし。
 */
export const apiKeyAuthMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header("X-API-Key");
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    logger.error("API_KEY environment variable is not set");
    return c.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Server configuration error",
        },
      },
      500,
    );
  }

  if (!apiKey || apiKey !== validApiKey) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized - Invalid API Key",
        },
      },
      401,
    );
  }

  // X-User-Id ヘッダーからユーザーIDを取得してコンテキストに設定
  const userId = c.req.header("X-User-Id");
  if (userId) {
    c.set("authenticatedUserId", userId);
  }

  await next();
};

/**
 * ユーザーIDの認可チェック付きAPIキー認証ミドルウェア
 * APIキーの検証に加え、リクエスト内のユーザーIDと認証ユーザーIDの一致を確認する。
 */
export const apiKeyWithUserAuthMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header("X-API-Key");
  const validApiKey = process.env.API_KEY;

  if (!validApiKey) {
    logger.error("API_KEY environment variable is not set");
    return c.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Server configuration error",
        },
      },
      500,
    );
  }

  if (!apiKey || apiKey !== validApiKey) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized - Invalid API Key",
        },
      },
      401,
    );
  }

  // X-User-Id ヘッダーからユーザーIDを取得
  const authenticatedUserId = c.req.header("X-User-Id");
  if (!authenticatedUserId) {
    return c.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized - Missing X-User-Id header",
        },
      },
      401,
    );
  }

  c.set("authenticatedUserId", authenticatedUserId);

  // リクエスト内のユーザーIDと認証ユーザーIDの一致を確認
  try {
    await authorizeUserIdAccess(c, authenticatedUserId);
  } catch (error) {
    logger.warn(`Authorization failed: ${error}`);
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

  await next();
};

/**
 * ユーザーIDアクセス認可チェック
 */
async function authorizeUserIdAccess(
  c: Context,
  authenticatedUserId: string,
): Promise<void> {
  let requestUserId: string | undefined;

  try {
    // POST/PUT/PATCH リクエストのボディをチェック
    if (
      c.req.method === "POST" ||
      c.req.method === "PUT" ||
      c.req.method === "PATCH"
    ) {
      const body = await c.req.json().catch(() => ({}));
      requestUserId = body.userId || body.data?.userId;
    }

    // URLパラメータのuserIdをチェック
    if (!requestUserId) {
      requestUserId = c.req.param("userId") || c.req.param("id");
    }

    // クエリパラメータのuserIdをチェック
    if (!requestUserId) {
      const url = new URL(c.req.url);
      requestUserId = url.searchParams.get("userId") ?? undefined;
    }
  } catch (error) {
    logger.warn(`Failed to parse request for user ID: ${error}`);
  }

  // ユーザーIDが指定されている場合、認証されたユーザーIDと一致するかチェック
  if (requestUserId && requestUserId !== authenticatedUserId) {
    logger.warn(
      `Authorization failed: authenticated user ${authenticatedUserId} attempted to access data for user ${requestUserId}`,
    );
    throw new Error("Insufficient permissions to access user data");
  }
}
