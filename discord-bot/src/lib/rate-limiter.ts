import type { Context, Next } from "hono";
import { logger } from "./logger";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// 期限切れエントリのクリーンアップ（5分ごと）
const CLEANUP_INTERVAL = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

interface RateLimitOptions {
  /** ウィンドウ期間（秒） */
  windowSeconds: number;
  /** ウィンドウ内の最大リクエスト数 */
  maxRequests: number;
}

/**
 * ユーザーID単位のレート制限ミドルウェアを生成する
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { windowSeconds, maxRequests } = options;

  return async (c: Context, next: Next) => {
    const userId = c.req.header("X-User-Id") ?? "anonymous";
    const path = new URL(c.req.url).pathname;
    const key = `${userId}:${path}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      // 新しいウィンドウを開始
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + windowSeconds * 1000,
      });
      await next();
      return;
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      logger.warn(
        `Rate limit exceeded for user ${userId} on ${path}: ${entry.count}/${maxRequests}`,
      );
      c.header("Retry-After", String(retryAfter));
      return c.json(
        {
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
            retryAfter,
          },
        },
        429,
      );
    }

    entry.count++;
    await next();
  };
}

/**
 * デフォルトのレート制限設定
 * ミニゲーム等の連続プレイを想定し、緩めに設定
 */

/** 一般的なAPI: 10秒間に20リクエスト */
export const defaultRateLimiter = createRateLimiter({
  windowSeconds: 10,
  maxRequests: 20,
});

/** ミューテーション系（POST/PUT/PATCH/DELETE）: 10秒間に15リクエスト */
export const mutationRateLimiter = createRateLimiter({
  windowSeconds: 10,
  maxRequests: 15,
});
