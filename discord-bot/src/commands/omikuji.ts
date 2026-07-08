import { logger } from "@bot/lib/logger";
import {
  drawOmikuji,
  generateOmikujiAIText,
  getOmikujiHistory,
  OmikujiError,
} from "@bot/services/minigame/omikuji";
import { useItem } from "@bot/services/shop/item-effects";
import { getUserInventory } from "@bot/services/shop/shop";
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

          // チケットの所持状態をチェック
          const inventory = await getUserInventory(interaction.user.id);
          const ticket = inventory.find(
            (item) => item.itemId === "omikuji_ticket",
          );
          const hasTicket = !!ticket;

          const buttons: ButtonBuilder[] = [];

          // AIテキストがまだ生成されていない場合、生成ボタンを追加
          const needsAIText = !(today.withText && today.aiText);
          let generateButton: ButtonBuilder | null = null;
          if (needsAIText) {
            generateButton = new ButtonBuilder()
              .setCustomId(`generate_omikuji_text_${today.id}`)
              .setLabel("AI解説を生成する")
              .setStyle(ButtonStyle.Primary);
            buttons.push(generateButton);
          }

          // チケットを持っている場合、もう一度引くボタンを追加
          let redrawButton: ButtonBuilder | null = null;
          if (hasTicket) {
            redrawButton = new ButtonBuilder()
              .setCustomId("use_omikuji_ticket_redraw")
              .setLabel("おみくじ券を使用してもう一度引く")
              .setStyle(ButtonStyle.Primary);
            buttons.push(redrawButton);
          }

          // 初期表示のEmbed
          let initialEmbed: EmbedBuilder | null = null;
          if (today.withText && today.aiText) {
            initialEmbed = new EmbedBuilder()
              .setTitle(`${interaction.user.username}さんの運勢: ${fortune}`)
              .setDescription(today.aiText)
              .setColor(getFortuneColor(fortune))
              .setFooter({ text: "今日の運勢" })
              .setTimestamp();
          }

          const getRow = () => {
            const activeButtons = [];
            if (generateButton) activeButtons.push(generateButton);
            if (redrawButton) activeButtons.push(redrawButton);

            return activeButtons.length > 0
              ? new ActionRowBuilder<ButtonBuilder>().addComponents(
                  activeButtons,
                )
              : null;
          };

          const row = getRow();

          const message = await interaction.editReply({
            content: alreadyReply,
            embeds: initialEmbed ? [initialEmbed] : [],
            components: row ? [row] : [],
          });

          if (!row) {
            // ボタンが一つもなければ終了
            return;
          }

          const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 15 * 60 * 1000, // 15分でタイムアウト
          });

          collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
              await i.reply({
                content: "このボタンは操作できません。",
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

                // 生成ボタンは不要になったので null にする
                generateButton = null;
                const nextRow = getRow();

                await interaction.editReply({
                  content: alreadyReply,
                  embeds: [newEmbed],
                  components: nextRow ? [nextRow] : [],
                });

                if (!nextRow) {
                  collector.stop();
                }
              } catch (aiError) {
                logger.error(
                  `[omikuji] interactive AI text generation error: ${aiError}`,
                );
                await i.followUp({
                  content: "解説の生成に失敗しました。",
                  flags: MessageFlags.Ephemeral,
                });
              }
            } else if (i.customId === "use_omikuji_ticket_redraw") {
              await i.deferUpdate();
              await interaction.editReply({
                content: "おみくじを引き直し中... 🔮",
                embeds: [],
                components: [],
              });
              const redrawStartTime = Date.now();
              try {
                // 最新のチケットを検索して使用
                const currentInventory = await getUserInventory(
                  interaction.user.id,
                );
                const currentTicket = currentInventory.find(
                  (item) => item.itemId === "omikuji_ticket",
                );
                if (!currentTicket) {
                  await i.followUp({
                    content: "おみくじ券が見つかりません。",
                    flags: MessageFlags.Ephemeral,
                  });
                  return;
                }

                await useItem(interaction.user.id, currentTicket.id);

                // 新しくおみくじを引く
                const redrawResult = await drawOmikuji(interaction.user.id);
                const newFortune = redrawResult.result;
                let newReply = `おみくじ券を使用しました！\nおみくじの結果は「${newFortune}」です！`;

                if (
                  newFortune === "ぬべ吉" ||
                  newFortune === "ヌベキチ└(՞ةڼ◔)」"
                ) {
                  newReply += await assignRole(interaction, newFortune);
                }

                let newEmbed: EmbedBuilder | null = null;
                if (withAIText && redrawResult.id) {
                  try {
                    const aiText = await generateOmikujiAIText(
                      redrawResult.id,
                      interaction.user.id,
                    );
                    newEmbed = new EmbedBuilder()
                      .setTitle(
                        `${interaction.user.username}さんの運勢: ${newFortune}`,
                      )
                      .setDescription(aiText)
                      .setColor(getFortuneColor(newFortune))
                      .setFooter({ text: "今日の運勢" })
                      .setTimestamp();
                  } catch (aiError) {
                    logger.error(
                      `[omikuji] Redraw AI text generation error: ${aiError}`,
                    );
                    newReply += "\n\n※ 解説の生成に失敗しました。";
                  }
                }

                // 最低3秒間は待機する
                const redrawElapsedTime = Date.now() - redrawStartTime;
                if (redrawElapsedTime < 3000) {
                  await new Promise((resolve) =>
                    setTimeout(resolve, 3000 - redrawElapsedTime),
                  );
                }

                // 引き直したので、ボタンをすべて削除して完了
                await interaction.editReply({
                  content: newReply,
                  embeds: newEmbed ? [newEmbed] : [],
                  components: [],
                });

                collector.stop();
              } catch (redrawError) {
                logger.error(`[omikuji] Redraw error: ${redrawError}`);
                await i.followUp({
                  content: "おみくじの引き直し中にエラーが発生しました。",
                  flags: MessageFlags.Ephemeral,
                });
              }
            }
          });

          collector.on("end", async () => {
            try {
              const currentMsg = await interaction.fetchReply();
              if (currentMsg.components.length > 0) {
                const disabledButtons = [];
                if (generateButton) {
                  disabledButtons.push(
                    ButtonBuilder.from(generateButton).setDisabled(true),
                  );
                }
                if (redrawButton) {
                  disabledButtons.push(
                    ButtonBuilder.from(redrawButton).setDisabled(true),
                  );
                }
                if (disabledButtons.length > 0) {
                  const expiredRow =
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                      disabledButtons,
                    );
                  await interaction.editReply({ components: [expiredRow] });
                }
              }
            } catch {
              // message may be deleted or already updated with no components
            }
          });
          return;
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
