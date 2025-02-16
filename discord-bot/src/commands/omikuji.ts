import { logger } from "@/lib/logger";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const CONSTANTS = {
  API_ENDPOINT: "http://localhost:3001/api/minigame/omikuji",
} as const;
export const data = new SlashCommandBuilder()
  .setName("omikuji")
  .setDescription("おみくじを引きます");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    const response = await fetch(`${CONSTANTS.API_ENDPOINT}/draw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: interaction.user.id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const result = await response.json();

    if (result.status === "error") {
      await interaction.editReply(result.error.message);
      return;
    }

    let reply = `おみくじの結果は「${result.data.result}」です！`;

    if (
      result.data.result === "ぬべ吉" ||
      result.data.result === "ヌベキチ└(՞ةڼ◔)」"
    ) {
      reply += await assignRole(interaction, result.data.result);
    }

    setTimeout(() => interaction.editReply(reply), 3000);
  } catch (error) {
    logger.error(`[omikuji] Error executing command: ${error}`);
    await interaction.editReply("おみくじの処理中にエラーが発生しました。");
  }
}

async function assignRole(
  interaction: ChatInputCommandInteraction,
  roleName: string,
): Promise<string> {
  const guild = interaction.guild;
  if (!guild) return "\n※ ギルド情報の取得に失敗しました。";

  const role = guild.roles.cache.find((role) => role.name === roleName);
  if (!role) return "\n※ ロールが見つかりません。";

  try {
    const member = await guild.members.fetch(interaction.user.id);
    if (!member.roles.cache.has(role.id)) {
      await member.roles.add(role);
      logger.info(
        `[omikuji] ${interaction.user.username} has been assigned the role ${role.name}`,
      );
    }
    return "";
  } catch (error) {
    logger.error(`[omikuji] Failed to assign role: ${error}`);
    return "\n※ ロールの付与に失敗しました。";
  }
}
