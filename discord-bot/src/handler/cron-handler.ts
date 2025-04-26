import type { ScheduledMessage } from "@prisma/client";
import { cronJobs } from "@index";
import { schedule } from "node-cron";
import { TextChannel } from "discord.js";
import { client } from "@lib/client";
import { logger } from "@lib/logger";

/**
 * 予定メッセージのcronジョブを設定する
 */
const setCronJob = async (message: ScheduledMessage) => {
  const existingJob = cronJobs.get(message.id);
  if (existingJob) {
    existingJob.stop();
  }

  const [hour, minute] = message.scheduleTime.split(":");
  const job = schedule(
    `${minute} ${hour} * * *`,
    async () => {
      const channel = client.channels.cache.get(message.channelId);
      if (channel instanceof TextChannel) {
        await channel.send(message.message);
        logger.info(`${message.id} - メッセージを送信しました`);
      } else {
        logger.error(`${message.id} - チャンネルが見つかりません`);
      }
    },
    {
      timezone: "Asia/Tokyo",
    },
  );
  cronJobs.set(message.id, job);
};

/**
 * 予定メッセージのcronジョブを停止する
 */
const stopCronJob = async (message: ScheduledMessage) => {
  const existingJob = cronJobs.get(message.id);
  if (existingJob) {
    existingJob.stop();
    cronJobs.delete(message.id);
  }
};

/**
 * アクティブな予定メッセージを取得する
 */
const getActiveMessages = async (): Promise<ScheduledMessage[]> => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/guilds/scheduledmessage/all",
    );

    if (!response.ok) {
      logger.error(
        `予定メッセージの取得に失敗しました: ${response.statusText}`,
      );
      return [];
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    logger.error("予定メッセージの取得中にエラーが発生しました:", error);
    return [];
  }
};

/**
 * 予定メッセージを追加する
 * 注意: このメソッドはAPI経由での追加のため利用しません
 * API内で直接addとcronジョブ設定を行います
 */
export const addMessage = async (message: ScheduledMessage) => {
  // APIで実装されているため、このメソッドは使用しないでください
  logger.warn("addMessage: このメソッドはAPIを使用してください");
};

/**
 * 予定メッセージを編集する
 * 注意: このメソッドはAPI経由での編集のため利用しません
 * API内で直接updateとcronジョブ設定を行います
 */
export const editMessage = async (message: ScheduledMessage) => {
  // APIで実装されているため、このメソッドは使用しないでください
  logger.warn("editMessage: このメソッドはAPIを使用してください");
};

/**
 * 予定メッセージを削除する
 * 注意: このメソッドはAPI経由での削除のため利用しません
 * API内で直接deleteとcronジョブ停止を行います
 */
export const deleteMessage = async (message: ScheduledMessage) => {
  // APIで実装されているため、このメソッドは使用しないでください
  logger.warn("deleteMessage: このメソッドはAPIを使用してください");
};

/**
 * すべてのアクティブな予定メッセージのcronジョブを初期化する
 */
export const initCronJobs = async () => {
  try {
    const messages = await getActiveMessages();
    for (const message of messages) {
      await setCronJob(message);
    }
    logger.info(`${messages.length}件の予定メッセージを初期化しました`);
  } catch (error) {
    logger.error("予定メッセージの初期化に失敗しました:", error);
  }
};
