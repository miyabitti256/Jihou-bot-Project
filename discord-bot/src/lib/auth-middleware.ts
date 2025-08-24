import { type Context, type Next } from "hono";
import { jwt, sign, verify } from "hono/jwt";
import { logger } from "./logger";

interface AuthorizedJWTPayload {
  userId: string;
  exp: number;
  iat: number;
}

/**
 * JWT認証とユーザー認可を統合したミドルウェア
 */
export const jwtAuthWithAuthorizationMiddleware = async (c: Context, next: Next) => {
  const clientIp =
    c.req.header("x-forwarded-for") ||
    c.req.header("x-real-ip") ||
    c.env?.remoteAddr ||
    "127.0.0.1";

  // ローカル環境判定
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

  try {
    // JWTトークンの検証
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing or invalid authorization header");
    }

    const token = authHeader.slice(7); // "Bearer " を除去
    const payload = await verify(token, jwtSecret) as unknown as AuthorizedJWTPayload;

    // ペイロードからユーザーIDを取得してコンテキストに設定
    c.set("authenticatedUserId", payload.userId);

    // リクエストボディまたはパラメータのuserIdを認可チェック
    await authorizeUserIdAccess(c, payload.userId);

    await next();
  } catch (error) {
    logger.info(`JWT authentication/authorization failed: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized - Invalid token or insufficient permissions",
          details: null,
        },
      },
      401,
    );
  }
};

/**
 * ユーザーIDアクセス認可チェック
 */
async function authorizeUserIdAccess(c: Context, authenticatedUserId: string): Promise<void> {
  // リクエストボディのuserIdをチェック
  let requestUserId: string | undefined;

  try {
    // POSTリクエストのボディをチェック
    if (c.req.method === "POST" || c.req.method === "PUT" || c.req.method === "PATCH") {
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
      `Authorization failed: authenticated user ${authenticatedUserId} attempted to access data for user ${requestUserId}`
    );
    throw new Error(`Insufficient permissions to access user data`);
  }
}

/**
 * 管理者権限が必要なエンドポイント用のミドルウェア
 */
export const adminAuthMiddleware = async (c: Context, next: Next) => {
  // まず通常の認証を実行
  await jwtAuthWithAuthorizationMiddleware(c, next);
  
  // 管理者権限のチェック（今後実装予定）
  // const authenticatedUserId = c.get("authenticatedUserId");
  // const isAdmin = await checkAdminPermissions(authenticatedUserId);
  // if (!isAdmin) {
  //   throw new Error("Admin permissions required");
  // }
};

/**
 * セキュアなトークン生成（認証済みセッションからのみ）
 */
export async function generateSecureJWT(
  authenticatedUserId: string,
  jwtSecret: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    userId: authenticatedUserId,
    exp: now + 60 * 60 * 24, // 24時間で期限切れ
    iat: now,
  };

  return await sign(payload, jwtSecret);
}

/**
 * より安全なローカル環境の判定
 */
function isLocalEnvironment(ip: string): boolean {
  const localIPs = ["127.0.0.1", "::1", "localhost"];
  const privateRanges = [
    /^10\./, /^172\.1[6-9]\./, /^172\.2[0-9]\./, /^172\.3[01]\./, /^192\.168\./
  ];
  
  if (localIPs.includes(ip)) return true;
  if (process.env.NODE_ENV === "development") {
    return privateRanges.some(range => range.test(ip));
  }
  return false;
} 