import type { Context, Next } from "hono";
import { jwt } from "hono/jwt";
import { logger } from "./logger";

/**
 * より安全なローカル環境の判定
 */
function isLocalEnvironment(ip: string): boolean {
  // 完全一致でのローカルIP判定
  const localIPs = ["127.0.0.1", "::1", "localhost"];

  // プライベートネットワーク範囲（開発環境用）
  const privateRanges = [
    /^10\./, // 10.0.0.0/8
    /^172\.1[6-9]\./, // 172.16.0.0/12
    /^172\.2[0-9]\./,
    /^172\.3[01]\./,
    /^192\.168\./, // 192.168.0.0/16
  ];

  // 完全一致チェック
  if (localIPs.includes(ip)) {
    return true;
  }

  // 開発環境のみ：プライベートIPレンジをチェック
  if (process.env.NODE_ENV === "development") {
    return privateRanges.some((range) => range.test(ip));
  }

  return false;
}

export const jwtAuthMiddleware = async (c: Context, next: Next) => {
  const clientIp =
    c.req.header("x-forwarded-for") ||
    c.req.header("x-real-ip") ||
    c.env?.remoteAddr ||
    "127.0.0.1";

  // より安全なローカル環境の判定
  const isLocalRequest = isLocalEnvironment(clientIp);

  if (isLocalRequest) {
    await next();
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logger.error("JWT_SECRET environment variable is not set");
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNAL_ERROR",
          message: "Server configuration error",
          details: null,
        },
      },
      500,
    );
  }

  // HonoのJWTミドルウェアを使用
  const jwtMiddleware = jwt({
    secret: jwtSecret,
  });

  try {
    await jwtMiddleware(c, next);
  } catch (error) {
    logger.info(`JWT authentication failed: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized - Invalid or expired token",
          details: null,
        },
      },
      401,
    );
  }
};

// レガシーAPIキー認証（後方互換性のため）
export const legacyApiKeyAuthMiddleware = async (c: Context, next: Next) => {
  const clientIp =
    c.req.header("x-forwarded-for") ||
    c.req.header("x-real-ip") ||
    c.env?.remoteAddr ||
    "127.0.0.1";

  const isLocalRequest = isLocalEnvironment(clientIp);

  if (isLocalRequest) {
    await next();
    return;
  }

  const apiKey = c.req.header("X-API-Key");
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return c.json(
      {
        status: "error",
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized - Invalid API Key",
          details: null,
        },
      },
      401,
    );
  }

  await next();
};

// ハイブリッド認証（JWT または APIキー）
export const hybridAuthMiddleware = async (c: Context, next: Next) => {
  const clientIp =
    c.req.header("x-forwarded-for") ||
    c.req.header("x-real-ip") ||
    c.env?.remoteAddr ||
    "127.0.0.1";

  const isLocalRequest = isLocalEnvironment(clientIp);

  if (isLocalRequest) {
    await next();
    return;
  }

  // まずJWT認証を試行
  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      await jwtAuthMiddleware(c, next);
      return;
    } catch (error) {
      // JWT認証が失敗した場合、APIキー認証にフォールバック
      logger.info("JWT authentication failed, trying API key authentication");
    }
  }

  // APIキー認証にフォールバック
  await legacyApiKeyAuthMiddleware(c, next);
};
