import { logger } from "@/lib/logger";
import {
  ChannelType,
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

const CONSTANTS = {
  API_ENDPOINT: "http://localhost:3001/api/guilds/scheduledmessage",
} as const;

export const data = new SlashCommandBuilder()
  .setName("editschedule")
  .setDescription("時報を編集します IDはscheduleinfoで確認できます")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("編集する時報のIDを指定します")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("time")
      .setDescription("編集する時報の時刻を指定します")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("編集する時報のメッセージを指定します")
      .setRequired(false),
  )
  .addStringOption((option) =>
    option
      .setName("channel")
      .setDescription("メッセージを送信するチャンネルを変更します")
      .setRequired(false),
  )
  .addBooleanOption((option) =>
    option
      .setName("isactive")
      .setDescription("時報を有効にするかどうかを指定します")
      .setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getString("id") as string;
  const time = interaction.options.getString("time") as string | null;
  const message = interaction.options.getString("message") as string | null;
  const channelId = interaction.options.getString("channel") as string | null;
  const isActive = interaction.options.getBoolean("isactive") as boolean | null;

  const userId = interaction.user.id;
  const guildId = interaction.guild?.id as string;

  if (time) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      await interaction.reply({
        content: "時刻の形式が正しくありません",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  }
  if (channelId) {
    const channel = await interaction.guild?.channels.fetch(channelId);
    if (!channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "チャンネルが見つかりません",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  }

  const updateData = {
    data: {
      id,
      guildId,
      userId,
      ...(channelId !== null && { channelId }),
      ...(message !== null && { message }),
      ...(time !== null && { scheduleTime: time }),
      ...(isActive !== null && { isActive }),
    },
  };

  try {
    const response = await fetch(CONSTANTS.API_ENDPOINT, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData, null, 2),
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      logger.error(
        `[editschedule] Error updating schedule: ${JSON.stringify(errorResponse.error?.details || errorResponse)}`,
      );
      await interaction.reply({
        content: "時報の編集に失敗しました",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const data = await response.json();
    await interaction.reply({
      content: data.data.message,
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    logger.error(`[editschedule] Error executing command: ${error}`);
    await interaction.reply({
      content: "時報の編集に失敗しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
