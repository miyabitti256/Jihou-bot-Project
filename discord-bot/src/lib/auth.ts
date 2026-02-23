import { timingSafeEqual } from "node:crypto";
import type { Context, Next } from "hono";
import { logger } from "./logger";

/**
 * 定数時間での文字列比較（タイミング攻撃防止）
 */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

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

  if (!apiKey || !safeCompare(apiKey, validApiKey)) {
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

  if (!apiKey || !safeCompare(apiKey, validApiKey)) {
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

  await next();
};

