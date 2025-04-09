import { logger } from "@/lib/logger";
import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

const CONSTANTS = {
  API_ENDPOINT: "http://localhost:3001/api/guilds/scheduledmessage",
} as const;

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
      guildId: interaction.guildId,
      userId: interaction.user.id,
    };

    const response = await fetch(CONSTANTS.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: scheduledMessage,
      }),
    });

    if (!response.ok) {
      logger.error(
        `[setschedule] Failed to set schedule: ${await response.text()}`,
      );
      await interaction.reply({
        content: "時報の設定に失敗しました",
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
    logger.error(`[setschedule] Error executing command: ${error}`);
    await interaction.reply({
      content: "時報の設定に失敗しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
