import { client } from "@bot/lib/client";
import { db } from "@bot/lib/db";
import { logger } from "@bot/lib/logger";
import type { ScheduledMessage } from "@jihou/database";
import { scheduledMessages } from "@jihou/database";
import cuid from "cuid";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { ScheduledTask } from "node-cron";
import { schedule } from "node-cron";

/**
 * 自動無効化対象のDiscord APIエラーコード
 * これらのエラーはチャンネルやギルドへの恒久的なアクセス不能を示すため、
 * スケジュールを即座に無効化する
 */
const DEACTIVATION_ERROR_CODES = [
  50001, // Missing Access
  10003, // Unknown Channel
  50013, // Missing Permissions
  10004, // Unknown Guild
];

let dispatcherJob: ScheduledTask | null = null;

/**
 * 前回ディスパッチ実行時刻を記録する。
 * node-cronのtickがブロッキングI/O等で遅延した場合でも、
 * 前回実行～現在時刻の間にスケジュールされたメッセージを漏れなく送信するために使用する。
 * （node-cron v4 は missed tick を警告のみで再実行しないため、アプリ側で救済が必要）
 */
let lastDispatchTime: Date | null = null;

export class ScheduledMessageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScheduledMessageError";
  }
}

export interface ScheduledMessageCreateData {
  channelId: string;
  message: string;
  scheduleTime: string;
  guildId: string;
  createdUserId: string;
}

export interface ScheduledMessageUpdateData {
  id: string;
  channelId?: string;
  message?: string;
  scheduleTime?: string;
  guildId: string;
  lastUpdatedUserId: string;
  isActive?: boolean;
}

/**
 * 指定メッセージを無効化する（isActive: false に更新）
 * @param messageId スケジュールメッセージID
 * @param reason 無効化理由（ログ用）
 */
async function deactivateMessage(
  messageId: string,
  reason: string,
): Promise<void> {
  try {
    await db
      .update(scheduledMessages)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(scheduledMessages.id, messageId));
    logger.warn(
      `[scheduled-message] Deactivated message ID: ${messageId}, reason: ${reason}`,
    );
  } catch (error) {
    logger.error(
      `[scheduled-message] Failed to deactivate message ID: ${messageId}, error: ${error}`,
    );
  }
}

/**
 * Discord API エラーコードを抽出する
 */
function getDiscordErrorCode(error: unknown): number | null {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof error.code === "number"
  ) {
    return error.code;
  }
  return null;
}

/**
 * 単一のスケジュールメッセージを送信する
 * @returns 送信成功: true / 失敗: false
 */
async function sendScheduledMessage(
  message: ScheduledMessage,
): Promise<boolean> {
  try {
    const channel = await client.channels.fetch(message.channelId);
    if (channel?.isSendable()) {
      await channel.send(message.message);
      logger.info(
        `[scheduled-message] Message sent successfully, ID: ${message.id}`,
      );
      return true;
    }

    // 送信不可能なチャンネル
    await deactivateMessage(message.id, "Channel is not sendable");
    return false;
  } catch (error) {
    const errorCode = getDiscordErrorCode(error);

    if (errorCode && DEACTIVATION_ERROR_CODES.includes(errorCode)) {
      // アクセス不能 → 自動無効化
      await deactivateMessage(
        message.id,
        `Discord API error: ${errorCode} - ${error}`,
      );
    } else {
      // 一時的なエラー（ネットワーク障害等）はログのみ。次のサイクルで再試行される。
      logger.error(
        `[scheduled-message] Failed to send message ID: ${message.id}, error: ${error}`,
      );
    }
    return false;
  }
}

/**
 * JST基準の "HH:MM" 形式の時刻文字列を生成する
 */
function toJstTimeString(date: Date): string {
  const jst = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
  );
  return `${jst.getHours().toString().padStart(2, "0")}:${jst.getMinutes().toString().padStart(2, "0")}`;
}

/**
 * 毎分実行されるディスパッチャ関数
 */
async function dispatchMessages(): Promise<void> {
  const now = new Date();
  const currentTime = toJstTimeString(now);

  // missed tick 救済: 前回実行～現在の全分をカバーするスケジュール時刻のセットを構築
  const targetTimes = new Set<string>([currentTime]);

  if (lastDispatchTime) {
    const lastJst = new Date(
      lastDispatchTime.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    );
    const cursor = new Date(lastJst);
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    const jstNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }),
    );
    while (cursor <= jstNow) {
      targetTimes.add(
        `${cursor.getHours().toString().padStart(2, "0")}:${cursor.getMinutes().toString().padStart(2, "0")}`,
      );
      cursor.setMinutes(cursor.getMinutes() + 1);
    }

    if (targetTimes.size > 1) {
      logger.warn(
        `[scheduled-message] Recovering missed ticks: dispatching for ${[...targetTimes].join(", ")}`,
      );
    }
  }

  lastDispatchTime = now;

  try {
    const messages = await db.query.scheduledMessages.findMany({
      where: and(
        eq(scheduledMessages.isActive, true),
        inArray(scheduledMessages.scheduleTime, [...targetTimes]),
      ),
    });

    if (messages.length === 0) return;

    logger.info(
      `[scheduled-message] Dispatching ${messages.length} messages for [${[...targetTimes].join(", ")}]`,
    );

    // 全メッセージを並行送信（discord.jsが内部でレートリミットを自動管理）
    const results = await Promise.allSettled(
      messages.map((message) => sendScheduledMessage(message)),
    );

    const succeeded = results.filter(
      (r) => r.status === "fulfilled" && r.value,
    ).length;
    const failed = results.length - succeeded;

    if (failed > 0) {
      logger.warn(
        `[scheduled-message] Dispatch completed: ${succeeded} succeeded, ${failed} failed`,
      );
    }
  } catch (error) {
    logger.error(`[scheduled-message] Dispatch cycle failed: ${error}`);
  }
}

/**
 * スケジュールメッセージのディスパッチャを開始する
 * 毎分実行し、現在時刻に一致するメッセージを送信する
 */
export function startScheduledMessageDispatcher(): void {
  if (dispatcherJob) {
    dispatcherJob.stop();
  }

  dispatcherJob = schedule("* * * * *", dispatchMessages, {
    timezone: "Asia/Tokyo",
  });

  logger.info("[scheduled-message] Dispatcher started (runs every minute)");
}

/**
 * スケジュールメッセージのディスパッチャを停止する
 */
export function stopScheduledMessageDispatcher(): void {
  if (dispatcherJob) {
    dispatcherJob.stop();
    dispatcherJob = null;
    logger.info("[scheduled-message] Dispatcher stopped");
  }
}

// ============================================================
// CRUD 操作（DB操作のみ。cronジョブ管理は不要）
// ============================================================

/**
 * 全アクティブなスケジュールメッセージを取得する
 */
export async function getAllActiveScheduledMessages() {
  try {
    return await db.query.scheduledMessages.findMany({
      where: eq(scheduledMessages.isActive, true),
      orderBy: asc(scheduledMessages.scheduleTime),
    });
  } catch (error) {
    logger.error(
      `[scheduled-message] Failed to get active scheduled messages: ${error}`,
    );
    throw new ScheduledMessageError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * すべてのスケジュールメッセージを取得する
 */
export async function getAllScheduledMessages() {
  try {
    return await db.query.scheduledMessages.findMany({
      orderBy: asc(scheduledMessages.scheduleTime),
    });
  } catch (error) {
    logger.error(
      `[scheduled-message] Failed to get all scheduled messages: ${error}`,
    );
    throw new ScheduledMessageError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * ギルドまたはユーザーに関連するスケジュールメッセージを取得する
 * @param id ギルドIDまたはユーザーID
 * @param type 'guild'または'user'
 */
export async function getScheduledMessages(
  id: string,
  type: "guild" | "user" = "guild",
) {
  try {
    const whereCondition =
      type === "user"
        ? eq(scheduledMessages.createdUserId, id)
        : eq(scheduledMessages.guildId, id);

    return await db.query.scheduledMessages.findMany({
      where: whereCondition,
      orderBy: asc(scheduledMessages.scheduleTime),
    });
  } catch (error) {
    logger.error(
      `[scheduled-message] Failed to get scheduled messages: ${error}`,
    );
    throw new ScheduledMessageError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * 指定IDのスケジュールメッセージを取得する
 * @param id スケジュールメッセージID
 */
export async function getScheduledMessageById(id: string) {
  try {
    const message = await db.query.scheduledMessages.findFirst({
      where: eq(scheduledMessages.id, id),
    });

    if (!message) {
      throw new ScheduledMessageError("MESSAGE_NOT_FOUND");
    }

    return message;
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      throw error;
    }
    logger.error(
      `[scheduled-message] Failed to get scheduled message: ${error}`,
    );
    throw new ScheduledMessageError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * 新しいスケジュールメッセージを作成する
 * @param data スケジュールメッセージデータ
 */
export async function createScheduledMessage(data: ScheduledMessageCreateData) {
  try {
    const validateTimeFormat = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    if (!validateTimeFormat.test(data.scheduleTime)) {
      throw new ScheduledMessageError("INVALID_TIME_FORMAT");
    }

    try {
      const channel = await client.channels.fetch(data.channelId);
      if (!channel?.isSendable()) {
        throw new ScheduledMessageError("CHANNEL_NOT_TEXT_CHANNEL");
      }
    } catch (error) {
      if (error instanceof ScheduledMessageError) throw error;
      throw new ScheduledMessageError("CHANNEL_NOT_FOUND");
    }

    const now = new Date();
    const [createdMessage] = await db
      .insert(scheduledMessages)
      .values({
        id: cuid(),
        channelId: data.channelId,
        message: data.message,
        scheduleTime: data.scheduleTime,
        guildId: data.guildId,
        createdUserId: data.createdUserId,
        lastUpdatedUserId: data.createdUserId,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return createdMessage;
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      throw error;
    }
    logger.error(
      `[scheduled-message] Failed to create scheduled message: ${error}`,
    );
    throw new ScheduledMessageError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * スケジュールメッセージを更新する
 * @param data 更新するデータ
 */
export async function updateScheduledMessage(data: ScheduledMessageUpdateData) {
  try {
    // 対象のメッセージが存在するかチェック
    const existingMessage = await db.query.scheduledMessages.findFirst({
      where: eq(scheduledMessages.id, data.id),
    });

    if (!existingMessage) {
      throw new ScheduledMessageError("MESSAGE_NOT_FOUND");
    }

    // scheduleTimeが指定されていて、形式が不正な場合はエラー
    if (data.scheduleTime) {
      const validateTimeFormat = /^([01]?\d|2[0-3]):([0-5]\d)$/;
      if (!validateTimeFormat.test(data.scheduleTime)) {
        throw new ScheduledMessageError("INVALID_TIME_FORMAT");
      }
    }

    // channelIdが更新される場合は検証
    if (data.channelId && data.channelId !== existingMessage.channelId) {
      try {
        const channel = await client.channels.fetch(data.channelId);
        if (!channel?.isSendable()) {
          throw new ScheduledMessageError("CHANNEL_NOT_TEXT_CHANNEL");
        }
      } catch (error) {
        if (error instanceof ScheduledMessageError) throw error;
        throw new ScheduledMessageError("CHANNEL_NOT_FOUND");
      }
    }

    // 更新データの構築
    const updateSet: Record<string, unknown> = {
      updatedAt: new Date(),
      lastUpdatedUserId: data.lastUpdatedUserId,
    };
    if (data.channelId !== undefined) updateSet.channelId = data.channelId;
    if (data.message !== undefined) updateSet.message = data.message;
    if (data.scheduleTime !== undefined)
      updateSet.scheduleTime = data.scheduleTime;
    if (data.isActive !== undefined) updateSet.isActive = data.isActive;

    const [updatedMessage] = await db
      .update(scheduledMessages)
      .set(updateSet)
      .where(eq(scheduledMessages.id, data.id))
      .returning();

    return updatedMessage;
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      throw error;
    }
    logger.error(
      `[scheduled-message] Failed to update scheduled message: ${error}`,
    );
    throw new ScheduledMessageError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * スケジュールメッセージを削除する
 * @param id メッセージID
 */
export async function deleteScheduledMessage(id: string) {
  try {
    // 対象のメッセージが存在するかチェック
    const existingMessage = await db.query.scheduledMessages.findFirst({
      where: eq(scheduledMessages.id, id),
    });

    if (!existingMessage) {
      throw new ScheduledMessageError("MESSAGE_NOT_FOUND");
    }

    // メッセージを削除
    const [deletedMessage] = await db
      .delete(scheduledMessages)
      .where(eq(scheduledMessages.id, id))
      .returning();

    return deletedMessage;
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      throw error;
    }
    logger.error(
      `[scheduled-message] Failed to delete scheduled message: ${error}`,
    );
    throw new ScheduledMessageError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * 指定チャンネルのスケジュールメッセージをすべて無効化する
 * チャンネル削除時に使用
 * @param channelId チャンネルID
 */
export async function deactivateScheduledMessagesByChannelId(
  channelId: string,
): Promise<void> {
  try {
    const result = await db
      .update(scheduledMessages)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(scheduledMessages.channelId, channelId),
          eq(scheduledMessages.isActive, true),
        ),
      )
      .returning({ id: scheduledMessages.id });

    if (result.length > 0) {
      logger.info(
        `[scheduled-message] Deactivated ${result.length} messages for channel: ${channelId}`,
      );
    }
  } catch (error) {
    logger.error(
      `[scheduled-message] Failed to deactivate messages for channel ${channelId}: ${error}`,
    );
  }
}
