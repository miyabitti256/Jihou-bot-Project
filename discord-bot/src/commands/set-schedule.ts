import { logger } from "@lib/logger";
import {
  createScheduledMessage,
  ScheduledMessageError,
} from "@services/guilds/scheduled-message";
import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("setschedule")
  .setDescription("時報する時刻とメッセージを設定します")
  .addStringOption((option) =>
    option
      .setName("time")
      .setDescription("時報する時刻を設定します")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription(
        "時報するメッセージを設定します(未設定の場合はデフォルトのメッセージを使用します)",
      )
      .setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const time = interaction.options.getString("time");
  const message =
    interaction.options.getString("message") ?? `${time}をお知らせします`;

  if (!time) {
    await interaction.reply({
      content: "時刻を指定してください",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    await interaction.reply({
      content: "時刻の形式が正しくありません。 HH:MM の形式で指定してください",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    const scheduledMessage = {
      channelId: interaction.channelId,
      message: message,
      scheduleTime: time,
      guildId: interaction.guildId || "",
      createdUserId: interaction.user.id,
    };

    await createScheduledMessage(scheduledMessage);

    await interaction.reply({
      content: `${time}に「${message}」を通知するよう設定しました。`,
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    if (error instanceof ScheduledMessageError) {
      logger.error(`[setschedule] Failed to set schedule: ${error.message}`);

      let errorMessage = "時報の設定に失敗しました";
      if (error.message === "INVALID_TIME_FORMAT") {
        errorMessage =
          "時刻の形式が正しくありません。HH:MM の形式で指定してください";
      }

      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    logger.error(`[setschedule] Error executing command: ${error}`);
    await interaction.reply({
      content: "時報の設定に失敗しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
