import { logger } from "@bot/lib/logger";
import {
  drawOmikuji,
  generateOmikujiAIText,
  getOmikujiHistory,
  OmikujiError,
} from "@bot/services/minigame/omikuji";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("omikuji")
  .setDescription("おみくじを引きます")
  .addBooleanOption((option) =>
    option
      .setName("text")
      .setDescription("AIによる運勢の詳細説明を生成するかどうか")
      .setRequired(false),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const withAIText = interaction.options.getBoolean("text") || false;

  try {
    // 開始時間を記録（最低3秒待機のため）
    const startTime = Date.now();

    const result = await drawOmikuji(interaction.user.id);
    const fortune = result.result;
    let reply = `おみくじの結果は「${fortune}」です！`;

    // ロールの割り当て処理
    if (fortune === "ぬべ吉" || fortune === "ヌベキチ└(՞ةڼ◔)」") {
      reply += await assignRole(interaction, fortune);
    }

    // AIによるテキスト生成が有効な場合
    let embed: EmbedBuilder | null = null;

    if (withAIText && result.id) {
      try {
        // AIでテキスト生成
        const aiText = await generateOmikujiAIText(
          result.id,
          interaction.user.id,
        );

        // 結果をEmbedで表示
        embed = new EmbedBuilder()
          .setTitle(`${interaction.user.username}さんの運勢: ${fortune}`)
          .setDescription(aiText)
          .setColor(getFortuneColor(fortune))
          .setFooter({ text: "今日の運勢" })
          .setTimestamp();
      } catch (aiError) {
        logger.error(`[omikuji] AI text generation error: ${aiError}`);
        // AIテキスト生成に失敗した場合のメッセージを追加
        reply += "\n\n※ 解説の生成に失敗しました。";
      }
    }

    // 最低3秒間は待機する
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < 3000) {
      await new Promise((resolve) => setTimeout(resolve, 3000 - elapsedTime));
    }

    // 最終的な結果を表示
    if (embed) {
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply(reply);
    }
  } catch (error) {
    logger.error(`[omikuji] Error executing command: ${error}`);
    let errorMessage = "おみくじの処理中にエラーが発生しました。";

    if (error instanceof OmikujiError && error.message === "ALREADY_DRAWN") {
      try {
        const history = await getOmikujiHistory(interaction.user.id, 1);
        const today = history[0];

        if (today) {
          const fortune = today.result;
          const alreadyReply = `今日の運勢は既に引いています。\n結果は「${fortune}」です！`;

          if (today.withText && today.aiText) {
            const embed = new EmbedBuilder()
              .setTitle(`${interaction.user.username}さんの運勢: ${fortune}`)
              .setDescription(today.aiText)
              .setColor(getFortuneColor(fortune))
              .setFooter({ text: "今日の運勢" })
              .setTimestamp();
            await interaction.editReply({
              content: alreadyReply,
              embeds: [embed],
            });
            return;
          } else {
            const generateButton = new ButtonBuilder()
              .setCustomId(`generate_omikuji_text_${today.id}`)
              .setLabel("AI解説を生成する")
              .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
              generateButton,
            );
            const message = await interaction.editReply({
              content: alreadyReply,
              components: [row],
            });

            const collector = message.createMessageComponentCollector({
              componentType: ComponentType.Button,
              time: 15 * 60 * 1000, // 15分でタイムアウト
            });

            collector.on("collect", async (i) => {
              if (i.user.id !== interaction.user.id) {
                await i.reply({
                  content: "他人の解説は生成できません。",
                  flags: MessageFlags.Ephemeral,
                });
                return;
              }

              if (i.customId === `generate_omikuji_text_${today.id}`) {
                await i.deferUpdate();
                try {
                  const newAiText = await generateOmikujiAIText(
                    today.id,
                    interaction.user.id,
                  );
                  const newEmbed = new EmbedBuilder()
                    .setTitle(
                      `${interaction.user.username}さんの運勢: ${fortune}`,
                    )
                    .setDescription(newAiText)
                    .setColor(getFortuneColor(fortune))
                    .setFooter({ text: "今日の運勢" })
                    .setTimestamp();
                  await interaction.editReply({
                    content: alreadyReply,
                    embeds: [newEmbed],
                    components: [],
                  });
                } catch (aiError) {
                  logger.error(
                    `[omikuji] interactive AI text generation error: ${aiError}`,
                  );
                  await i.followUp({
                    content: "解説の生成に失敗しました。",
                    flags: 64,
                  });
                }
              }
            });

            collector.on("end", async () => {
              try {
                const expiredRow =
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    ButtonBuilder.from(generateButton).setDisabled(true),
                  );
                await interaction.editReply({ components: [expiredRow] });
              } catch {
                // message may be deleted or inaccessible
              }
            });
            return;
          }
        }
      } catch (innerError) {
        logger.error(
          `[omikuji] Interactive ALREADY_DRAWN handling error: ${innerError}`,
        );
      }
    }

    if (error instanceof OmikujiError) {
      if (error.message === "USER_NOT_FOUND") {
        errorMessage = "ユーザーデータが見つかりません。";
      } else if (error.message === "ALREADY_DRAWN") {
        errorMessage = "おみくじは一日に一度しか引けません"; // fallback
      }
    }

    await interaction.editReply(errorMessage);
  }
}

/**
 * 運勢に応じた色を返す
 */
function getFortuneColor(fortune: string): number {
  const colorMap: { [key: string]: number } = {
    ぬべ吉: 0xff00ff, // マゼンタ
    大吉: 0xff0000, // 赤
    中吉: 0xffa500, // オレンジ
    小吉: 0xffff00, // 黄色
    吉: 0x00ff00, // 緑
    末吉: 0x0000ff, // 青
    凶: 0x800080, // 紫
    大凶: 0x000000, // 黒
    "ヌベキチ└(՞ةڼ◔)」": 0xff00ff, // マゼンタ
  };

  return colorMap[fortune] || 0x808080; // デフォルトはグレー
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
