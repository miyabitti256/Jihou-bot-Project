import type { ScheduledMessage } from "@prisma/client";
import { getScheduledMessages } from "@services/guilds/scheduled-message";
import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { logger } from "@/lib/logger";

export const data = new SlashCommandBuilder()
  .setName("scheduleinfo")
  .setDescription("時報の情報を表示します");

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId as string;
  try {
    const messages = await getScheduledMessages(guildId);
    const embed = new EmbedBuilder()
      .setTitle("📅 時報の設定一覧")
      .setColor("#00ff00");
    if (messages.length > 0) {
      const sortedMessages = messages.sort(
        (a: ScheduledMessage, b: ScheduledMessage) => {
          const [aHours, aMinutes] = a.scheduleTime.split(":").map(Number);
          const [bHours, bMinutes] = b.scheduleTime.split(":").map(Number);

          const aTotal = aHours * 60 + aMinutes;
          const bTotal = bHours * 60 + bMinutes;

          return aTotal - bTotal;
        },
      );

      for (const message of sortedMessages) {
        embed.addFields({
          name: `⏰ ${message.scheduleTime}`,
          value: [
            "```md",
            "# メッセージ",
            message.message,
            "",
            "# 詳細情報",
            `* チャンネル: ${
              interaction.guild?.channels.cache.get(message.channelId)?.name
            }`,
            `* ID: ${message.id}`,
            `* ステータス: ${message.isActive ? "🟢 有効" : "🔴 無効"}`,
            "```",
            "",
          ].join("\n"),
          inline: false,
        });
      }
    } else {
      embed.setDescription("時報は設定されていません");
    }

    await interaction.reply({ embeds: [embed] });
    return;
  } catch (error) {
    logger.error(`[scheduleinfo] Error fetching schedule info: ${error}`);
    await interaction.reply({
      content: "エラーが発生しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
