import { client } from "@lib/client";
import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";
import type { ScheduledMessage } from "@prisma/client";
import cuid from "cuid";
import { TextChannel } from "discord.js";
import type { ScheduledTask } from "node-cron";
import { schedule } from "node-cron";

export const cronJobs = new Map<string, ScheduledTask>();

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
 * スケジュールされたメッセージ用のcronジョブを設定する
 * @param message ScheduledMessageオブジェクト
 */
export async function setCronJob(message: ScheduledMessage): Promise<void> {
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
        logger.info(
          `[scheduled-message] Message sent successfully, ID: ${message.id}`,
        );
      } else {
        logger.error(
          `[scheduled-message] Channel not found for message ID: ${message.id}`,
        );
      }
    },
    {
      timezone: "Asia/Tokyo",
    },
  );
  cronJobs.set(message.id, job);
}

/**
 * スケジュールされたメッセージ用のcronジョブを停止する
 * @param message ScheduledMessageオブジェクト
 */
export function stopCronJob(message: ScheduledMessage): void {
  const existingJob = cronJobs.get(message.id);
  if (existingJob) {
    existingJob.stop();
    cronJobs.delete(message.id);
  }
}

/**
 * すべてのアクティブな予定メッセージのcronジョブを初期化する
 */
export async function initCronJobs(): Promise<void> {
  try {
    const messages = await getAllActiveScheduledMessages();
    for (const message of messages) {
      await setCronJob(message);
    }
    logger.info(
      `[scheduled-message] Initialized ${messages.length} scheduled messages`,
    );
  } catch (error) {
    logger.error(
      `[scheduled-message] Failed to initialize scheduled messages: ${error}`,
    );
  }
}

/**
 * 全アクティブなスケジュールメッセージを取得する
 */
export async function getAllActiveScheduledMessages() {
  try {
    return await prisma.scheduledMessage.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        scheduleTime: "asc",
      },
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
    return await prisma.scheduledMessage.findMany({
      orderBy: {
        scheduleTime: "asc",
      },
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
    return await prisma.scheduledMessage.findMany({
      where: {
        [type === "user" ? "createdUserId" : "guildId"]: id,
      },
      orderBy: {
        scheduleTime: "asc",
      },
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
    const message = await prisma.scheduledMessage.findUnique({
      where: { id },
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
    const validateTimeFormat = /^([0-9]{1,2}:[0-9]{2})$/;
    if (!validateTimeFormat.test(data.scheduleTime)) {
      throw new ScheduledMessageError("INVALID_TIME_FORMAT");
    }

    const newMessage: ScheduledMessage = {
      id: cuid(),
      ...data,
      lastUpdatedUserId: data.createdUserId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdMessage = await prisma.scheduledMessage.create({
      data: newMessage,
    });

    // cronジョブの設定
    if (createdMessage.isActive) {
      await setCronJob(createdMessage);
    }

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
    const existingMessage = await prisma.scheduledMessage.findUnique({
      where: { id: data.id },
    });

    if (!existingMessage) {
      throw new ScheduledMessageError("MESSAGE_NOT_FOUND");
    }

    // scheduleTimeが指定されていて、形式が不正な場合はエラー
    if (data.scheduleTime) {
      const validateTimeFormat = /^([0-9]{1,2}:[0-9]{2})$/;
      if (!validateTimeFormat.test(data.scheduleTime)) {
        throw new ScheduledMessageError("INVALID_TIME_FORMAT");
      }
    }

    // 更新データから不要なプロパティを除外
    const { id, guildId, ...updateData } = data;

    // 更新日時を設定
    const updatedMessage = await prisma.scheduledMessage.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    // アクティブ状態またはスケジュール時間が変更された場合はcronジョブを更新
    if (
      (data.isActive !== undefined &&
        data.isActive !== existingMessage.isActive) ||
      (data.scheduleTime !== undefined &&
        data.scheduleTime !== existingMessage.scheduleTime)
    ) {
      if (updatedMessage.isActive) {
        await setCronJob(updatedMessage);
      } else {
        stopCronJob(updatedMessage);
      }
    }

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
    const existingMessage = await prisma.scheduledMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new ScheduledMessageError("MESSAGE_NOT_FOUND");
    }

    // cronジョブを停止
    stopCronJob(existingMessage);

    // メッセージを削除
    const deletedMessage = await prisma.scheduledMessage.delete({
      where: { id },
    });

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
