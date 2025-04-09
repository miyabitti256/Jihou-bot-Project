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

  const data = await fetch(`${CONSTANTS.API_ENDPOINT}/details/${id}`, {
    method: "GET",
  });
  const message = await data.json();

  if (!message) {
    await interaction.reply({
      content: "指定されたIDの時報が見つかりません",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (message.data.guildId !== interaction.guild?.id) {
    await interaction.reply({
      content: "指定されたIDの時報は存在しません",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  try {
    const response = await fetch(CONSTANTS.API_ENDPOINT, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        guildId: interaction.guild?.id,
      }),
    });

    if (!response.ok) {
      logger.error(
        `[deleteschedule] Error deleting schedule: ${await response.text()}`,
      );
      await interaction.reply({
        content: "時報の削除に失敗しました",
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
    logger.error(`[deleteschedule] Error executing command: ${error}`);
    await interaction.reply({
      content: "時報の削除に失敗しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
