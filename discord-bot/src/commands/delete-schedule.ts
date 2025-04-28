import { logger } from "@/lib/logger";
import {
  deleteScheduledMessage,
  getScheduledMessageById,
} from "@services/guilds/scheduled-message";
import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("deleteschedule")
  .setDescription("時報を削除します")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("削除する時報のIDを指定します")
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getString("id") as string;

  try {
    const message = await getScheduledMessageById(id);

    if (!message) {
      await interaction.reply({
        content: "指定されたIDの時報が見つかりません",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (message.guildId !== interaction.guild?.id) {
      await interaction.reply({
        content: "指定されたIDの時報は存在しません",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await deleteScheduledMessage(id);

    await interaction.reply({
      content: "時報を削除しました",
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    logger.error(`[deleteschedule] Error executing command: ${error}`);
    await interaction.reply({
      content: "時報の削除に失敗しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
