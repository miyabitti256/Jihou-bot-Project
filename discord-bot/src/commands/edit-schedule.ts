import { logger } from "@lib/logger";
import {
  getScheduledMessageById,
  ScheduledMessageError,
  updateScheduledMessage,
} from "@services/guilds/scheduled-message";
import {
  ChannelType,
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

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

  const lastUpdatedUserId = interaction.user.id;
  const guildId = interaction.guild?.id as string;

  // 既存のスケジュールメッセージを取得して存在確認
  try {
    const existingMessage = await getScheduledMessageById(id);
    if (!existingMessage) {
      await interaction.reply({
        content: "指定されたIDの時報が見つかりません",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (existingMessage.guildId !== guildId) {
      await interaction.reply({
        content: "指定されたIDの時報は存在しません",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
  } catch (error) {
    logger.error(`[editschedule] Error getting scheduled message: ${error}`);
    await interaction.reply({
      content: "時報の取得に失敗しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

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
    id,
    guildId,
    lastUpdatedUserId,
    ...(channelId !== null && { channelId }),
    ...(message !== null && { message }),
    ...(time !== null && { scheduleTime: time }),
    ...(isActive !== null && { isActive }),
  };

  try {
    await updateScheduledMessage(updateData);
    await interaction.reply({
      content: "時報を更新しました",
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      let errorMessage = "時報の編集に失敗しました";
      if (error.message === "INVALID_TIME_FORMAT") {
        errorMessage = "時刻の形式が正しくありません";
      } else if (error.message === "MESSAGE_NOT_FOUND") {
        errorMessage = "指定されたIDの時報が見つかりません";
      }
      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    logger.error(`[editschedule] Error executing command: ${error}`);
    await interaction.reply({
      content: "時報の編集に失敗しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
