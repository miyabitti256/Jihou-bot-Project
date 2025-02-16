import type { ScheduledMessage } from "@prisma/client";
import { prisma } from "@lib/prisma";
import { cronJobs } from "@index";
import { schedule } from "node-cron";
import { TextChannel } from "discord.js";
import { client } from "@lib/client";
import { logger } from "@lib/logger";

const getActiveMessages = async (
  guildId?: string,
): Promise<ScheduledMessage[]> => {
  if (guildId) {
    return await prisma.scheduledMessage.findMany({
      where: {
        guildId,
        isActive: true,
      },
    });
  }
  return await prisma.scheduledMessage.findMany({
    where: {
      isActive: true,
    },
  });
};

const setCronJob = async (message: ScheduledMessage) => {
  const existiongJob = cronJobs.get(message.id);
  if (existiongJob) {
    existiongJob.stop();
  }

  const [hour, minute] = message.scheduleTime.split(":");
  const job = schedule(
    `${minute} ${hour} * * *`,
    async () => {
      const channel = client.channels.cache.get(message.channelId);
      if (channel instanceof TextChannel) {
        await channel.send(message.message);
        logger.info(`${message.id} - Sent message`);
      } else {
        logger.error(`${message.id} - Channel not found`);
      }
    },
    {
      timezone: "Asia/Tokyo",
    },
  );
  cronJobs.set(message.id, job);
};

const stopCronJob = async (message: ScheduledMessage) => {
  const existiongJob = cronJobs.get(message.id);
  if (existiongJob) {
    existiongJob.stop();
    cronJobs.delete(message.id);
  }
};

export const addMessage = async (message: ScheduledMessage) => {
  try {
    const newMessage = await prisma.scheduledMessage.create({
      data: message,
    });
    await setCronJob(newMessage);
    logger.info(`${message.id} - Added message`);
  } catch (error) {
    logger.error(`${message.id} - Error adding message:`, error);
    console.error(error);
  }
};

export const editMessage = async (message: ScheduledMessage) => {
  try {
    await prisma.scheduledMessage.update({
      where: {
        id: message.id
      },
      data: {
        channelId: message.channelId,
        message: message.message,
        scheduleTime: message.scheduleTime,
        lastUpdatedUserId: message.lastUpdatedUserId,
        isActive: message.isActive,
        updatedAt: message.updatedAt
      }
    });
    if (message.isActive) {
      await stopCronJob(message);
      await setCronJob(message);
    } else {
      await stopCronJob(message);
    }
    logger.info(`${message.id} - Edited message`);
  } catch (error) {
    logger.error(`${message.id} - Error editing message:`, error);
    throw error;
  }
};
export const deleteMessage = async (message: ScheduledMessage) => {
  try {
    const existiongJob = cronJobs.get(message.id);
    if (existiongJob) {
      existiongJob.stop();
      cronJobs.delete(message.id);
    }
    await prisma.scheduledMessage.delete({
      where: { id: message.id },
    });
    logger.info(`${message.id} - Deleted message`);
  } catch (error) {
    logger.error(`${message.id} - Error deleting message:`, error);
    console.error(error);
  }
};

export const initCronJobs = async () => {
  const messages = await getActiveMessages();
  for (const message of messages) {
    await setCronJob(message);
  }
};
