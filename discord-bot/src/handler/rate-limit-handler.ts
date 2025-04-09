import { logger } from "@lib/logger";

// レート制限のデフォルト値
const DEFAULT_RATE_LIMIT_MS = 3000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const EXPIRY_TIME_MS = 10 * 60 * 1000;

// 内部状態
const lastRequestTimeMap = new Map<string, number>();
const rateLimitMs = DEFAULT_RATE_LIMIT_MS;
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * 定期的に古いエントリをクリーンアップする
 */
function startCleanupInterval(): void {
  cleanupInterval = setInterval(() => {
    cleanupExpiredEntries();
  }, CLEANUP_INTERVAL_MS);
}

/**
 * 期限切れのエントリを削除する
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  let removedCount = 0;

  for (const [id, timestamp] of lastRequestTimeMap.entries()) {
    if (now - timestamp > EXPIRY_TIME_MS) {
      lastRequestTimeMap.delete(id);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    logger.info(
      `[RateLimitManager] Cleaned up ${removedCount} expired rate limit entries. Remaining: ${lastRequestTimeMap.size}`,
    );
  }
}

/**
 * 指定されたIDのレート制限をチェックする
 * @param id チャンネルIDやユーザーIDなどの識別子
 * @param context ログ用のコンテキスト情報（コマンド名など）
 * @returns レート制限中かどうか
 */
function isRateLimited(id: string, context = "unknown"): boolean {
  const now = Date.now();
  const lastRequestTime = lastRequestTimeMap.get(id) || 0;
  const timeElapsed = now - lastRequestTime;

  const isLimited = timeElapsed < rateLimitMs;
  if (isLimited) {
    logger.info(
      `[${context}] Rate limited: ${id}, ${timeElapsed}ms since last request`,
    );
  }

  return isLimited;
}

/**
 * レート制限カウンターを更新する
 * @param id チャンネルIDやユーザーIDなどの識別子
 */
function updateRateLimit(id: string): void {
  lastRequestTimeMap.set(id, Date.now());
}

/**
 * レート制限をリセットする
 * @param id チャンネルIDやユーザーIDなどの識別子
 */
function resetRateLimit(id: string): void {
  lastRequestTimeMap.delete(id);
}

/**
 * クリーンアップインターバルを停止する
 */
function stopCleanupInterval(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

/**
 * 現在の状態情報を取得する
 */
function getStats(): { totalEntries: number } {
  return {
    totalEntries: lastRequestTimeMap.size,
  };
}

// 初期化処理
startCleanupInterval();

// APIを公開
export default {
  isRateLimited,
  updateRateLimit,
  resetRateLimit,
  stopCleanupInterval,
  getStats,
};
