import { client } from "@lib/client";
import { logger } from "@lib/logger";
import { cleanupGhostGuilds, syncGuildAllData } from "@services/db-sync/guild-sync";
import { ActivityType } from "discord.js";
import cron, { type ScheduledTask } from "node-cron";

let statusUpdateJob: ScheduledTask | null = null;

/**
 * Discordボットのステータスを更新する
 * @param startTime 起動時刻
 */
export async function updateStatus(startTime: Date): Promise<void> {
  // 起動してからの稼働時間を計算
  const now = new Date();
  const h = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60 / 60);
  client.user?.setActivity(`${h}時間連続稼働中`, {
    type: ActivityType.Custom,
  });

  try {
    // すべてのギルドデータを同期
    for (const guild of client.guilds.cache.values()) {
      await syncGuildAllData(guild);
    }

    // ゴーストギルドのクリーンアップ
    // DBにあるがボットが参加していないギルドを削除（オフラインキック対策）
    const activeGuildIds = new Set(client.guilds.cache.keys());
    await cleanupGhostGuilds(activeGuildIds);
  } catch (error) {
    logger.error(`Error occurred while updating guild data: ${error}`);
  }
}

/**
 * 定期的なステータス更新をスケジュールする
 * @param startTime 起動時刻
 */
export function scheduleStatusUpdates(startTime: Date): void {
  // 既存のジョブがあれば停止
  if (statusUpdateJob) {
    statusUpdateJob.stop();
  }

  // 毎時実行されるようにスケジュール
  // 秒数を30秒固定にすることで、毎分0秒に実行されるメッセージディスパッチャ
  // （scheduled-message.ts）とのイベントループ上の競合を回避する。
  // 起動時刻の秒をそのまま使うと偶然0秒だった場合にディスパッチャと衝突し、
  // node-cronのmissed tickを引き起こすリスクがある。
  statusUpdateJob = cron.schedule(
    `30 ${startTime.getMinutes()} * * * *`,
    async () => {
      await updateStatus(startTime);
    },
    {
      timezone: "Asia/Tokyo",
    },
  );

  logger.info("Started scheduled status updates");
}

/**
 * ステータス更新を停止する
 */
export function stopStatusUpdates(): void {
  if (statusUpdateJob) {
    statusUpdateJob.stop();
    statusUpdateJob = null;
    logger.info("Stopped status updates");
  }
}
