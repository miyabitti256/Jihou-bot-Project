import { logger } from "@/lib/logger";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  type Message,
  SlashCommandBuilder,
  type User,
} from "discord.js";
import * as JankenService from "@/services/minigame";

const CONSTANTS = {
  TIMEOUT_DURATION: 180000,
  BET_AMOUNTS: [100, 500, 1000, 5000, 10000] as const,
  CHOICES: {
    ROCK: "✊",
    PAPER: "✋",
    SCISSORS: "✌️",
  } as const,
} as const;

export type ChoiceKey = keyof typeof CONSTANTS.CHOICES;

export const data = new SlashCommandBuilder()
  .setName("janken")
  .setDescription("じゃんけん勝負を開始します")
  .addBooleanOption((option) =>
    option
      .setName("bet")
      .setDescription("コインを賭けて勝負するかどうか")
      .setRequired(true),
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
  rematchUsers?: { challenger: User; opponent: User },
) {
  try {
    const challenger = rematchUsers?.challenger || interaction.user;
    const isBetMode = interaction.options.getBoolean("bet", true);

    let message: Message;

    if (rematchUsers) {
      try {
        const recruitEmbed = new EmbedBuilder()
          .setTitle("じゃんけん勝負！")
          .setDescription(
            `${challenger.username}さんが${isBetMode ? "賭け" : "通常の"}じゃんけん勝負を開始します！`,
          )
          .setColor("#FF9900");

        await interaction.editReply({
          content: "",
          embeds: [recruitEmbed],
          components: [],
        });

        message = (await interaction.fetchReply()) as Message;

        // リマッチ時は対戦相手の待機をスキップしてすぐにゲームを開始
        if (isBetMode) {
          await handleBetMode(
            interaction,
            challenger,
            rematchUsers.opponent,
            message,
          );
        } else {
          await handleNormalMode(
            interaction,
            challenger,
            rematchUsers.opponent,
            message,
          );
        }
      } catch (error: unknown) {
        logger.error(`[janken] Error in rematch game: ${error}`);
        await safeReply(
          interaction,
          "リマッチ中にエラーが発生しました。もう一度お試しください。",
        );
      }
      return;
    }

    // 新規ゲームの場合の処理
    try {
      message = await setupInitialMessage(interaction, challenger, isBetMode);

      try {
        const opponent = await waitForOpponent(message, challenger);

        if (isBetMode) {
          await handleBetMode(interaction, challenger, opponent, message);
        } else {
          await handleNormalMode(interaction, challenger, opponent, message);
        }
      } catch (error: unknown) {
        logger.error(`[janken] Error waiting for opponent: ${error}`);
        await handleTimeout(interaction);
      }
    } catch (error: unknown) {
      logger.error(`[janken] Error setting up initial message: ${error}`);
      await safeReply(
        interaction,
        "ゲーム開始中にエラーが発生しました。もう一度お試しください。",
      );
    }
  } catch (error: unknown) {
    logger.error(`[janken] Error executing command: ${error}`);
    await safeReply(
      interaction,
      "エラーが発生しました。もう一度お試しください。",
    );
  }
}

async function setupInitialMessage(
  interaction: ChatInputCommandInteraction,
  challenger: User,
  isBetMode: boolean,
): Promise<Message> {
  const recruitEmbed = new EmbedBuilder()
    .setTitle("じゃんけん勝負！")
    .setDescription(
      `${challenger.username}さんが${isBetMode ? "賭け" : "通常の"}じゃんけん勝負を募集しています！\n参加する場合は下のボタンを押してください。`,
    )
    .setColor("#FF9900");

  const joinButton = new ButtonBuilder()
    .setCustomId("join_janken")
    .setLabel("参加する")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton);

  await interaction.reply({
    embeds: [recruitEmbed],
    components: [row],
  });

  return (await interaction.fetchReply()) as Message;
}

async function waitForOpponent(
  message: Message,
  challenger: User,
): Promise<User> {
  try {
    const joinInteraction = await message.awaitMessageComponent({
      filter: (i) =>
        i.customId === "join_janken" && i.user.id !== challenger.id,
      time: CONSTANTS.TIMEOUT_DURATION,
    });

    await joinInteraction.deferUpdate();

    return joinInteraction.user;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("time")) {
      logger.info("[janken] Waiting for opponent timed out");
      throw new Error("Opponent waiting timed out");
    }

    logger.error(`[janken] Error waiting for opponent: ${error}`);
    throw error;
  }
}

async function handleBetMode(
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User,
  message: Message,
) {
  try {
    // サービス層を使ってプレイヤーの残高を取得
    let challengerBalance = 0;
    let opponentBalance = 0;

    try {
      const result = await JankenService.checkBothUserBalances(
        challenger,
        opponent,
      );
      challengerBalance = result.challengerBalance;
      opponentBalance = result.opponentBalance;
    } catch (dbError: unknown) {
      logger.error(`[janken] Error fetching user balances: ${dbError}`);
      await interaction.followUp({
        content:
          "ユーザーデータの取得中にエラーが発生しました。通常モードで続行します。",
        ephemeral: true,
      });
      // エラー発生時は通常モードにフォールバック
      return await handleNormalMode(interaction, challenger, opponent, message);
    }

    const betButtons = CONSTANTS.BET_AMOUNTS.map((amount) =>
      new ButtonBuilder()
        .setCustomId(`bet_${amount}`)
        .setLabel(`${amount}コイン`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(amount > challengerBalance || amount > opponentBalance),
    );

    const betRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      betButtons,
    );
    const betEmbed = createBetEmbed(challenger, opponent);

    await interaction.editReply({
      embeds: [betEmbed],
      components: [betRow],
    });

    try {
      const { challengerBet, opponentBet } = await handleBetting(
        interaction,
        message,
        challenger,
        opponent,
        challengerBalance,
        opponentBalance,
      );

      await playGame(
        interaction,
        message,
        challenger,
        opponent,
        challengerBet,
        opponentBet,
      );
    } catch (error: unknown) {
      // handleBetting内でタイムアウトやエラーが発生した場合はここでキャッチ
      logger.error(`[janken] Error in betting or game: ${error}`);
      // タイムアウトメッセージはhandleBetting内で表示されているため、ここでは何もしない
    }
  } catch (error: unknown) {
    logger.error(`[janken] Error in bet mode: ${error}`);
    await safeReply(
      interaction,
      "賭けモードの処理中にエラーが発生しました。もう一度お試しください。",
    );
  }
}

async function handleBetting(
  interaction: ChatInputCommandInteraction,
  message: Message,
  challenger: User,
  opponent: User,
  challengerBalance: number,
  opponentBalance: number,
): Promise<{ challengerBet: number; opponentBet: number }> {
  try {
    const betButtons = CONSTANTS.BET_AMOUNTS.map((amount) =>
      new ButtonBuilder()
        .setCustomId(`bet_${amount}`)
        .setLabel(`${amount}コイン`)
        .setStyle(ButtonStyle.Secondary),
    );

    const betRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      betButtons,
    );

    const betEmbed = createBetEmbed(challenger, opponent);

    await interaction.editReply({
      embeds: [betEmbed],
      components: [betRow],
    });

    let challengerBet = 0;
    let opponentBet = 0;

    return new Promise((resolve, reject) => {
      const betCollector = message.createMessageComponentCollector({
        filter: (i) => i.customId.startsWith("bet_"),
        time: CONSTANTS.TIMEOUT_DURATION,
      });

      betCollector.on("collect", async (i) => {
        try {
          await i.deferUpdate();

          const amount = Number(i.customId.split("_")[1]);
          const userBalance =
            i.user.id === challenger.id ? challengerBalance : opponentBalance;

          if (userBalance < amount) {
            await i.followUp({
              content: `所持金が足りません。現在の所持金: ${userBalance}コイン`,
              ephemeral: true,
            });
            return;
          }

          if (i.user.id === challenger.id) {
            challengerBet = amount;
          } else if (i.user.id === opponent.id) {
            opponentBet = amount;
          }

          await updateBetEmbed(
            interaction,
            challenger,
            opponent,
            challengerBet,
            opponentBet,
            betRow,
          );

          if (challengerBet && opponentBet) {
            betCollector.stop();
            resolve({ challengerBet, opponentBet });
          }
        } catch (error) {
          logger.error(`[janken] Error in bet collector: ${error}`);
          // エラーが発生しても操作を継続
        }
      });

      betCollector.on("end", async (_collected, reason) => {
        if (reason === "time" && !(challengerBet && opponentBet)) {
          try {
            await interaction.editReply({
              content:
                "賭け金設定がタイムアウトしました。じゃんけん勝負を終了します。",
              components: [],
              embeds: [],
            });
            reject(new Error("Betting timed out"));
          } catch (error) {
            logger.error(`[janken] Error handling bet timeout: ${error}`);
            reject(error);
          }
        }
      });
    });
  } catch (error) {
    logger.error(`[janken] Error handling betting: ${error}`);
    throw error;
  }
}

async function handleNormalMode(
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User,
  message: Message,
) {
  await playGame(interaction, message, challenger, opponent);
}

async function playGame(
  interaction: ChatInputCommandInteraction,
  message: Message,
  challenger: User,
  opponent: User,
  challengerBet?: number,
  opponentBet?: number,
) {
  const gameEmbed = createGameEmbed(
    challenger,
    opponent,
    challengerBet,
    opponentBet,
  );
  const choiceRow = createChoiceButtons();

  await interaction.editReply({
    embeds: [gameEmbed],
    components: [choiceRow],
  });

  const { challengerChoice, opponentChoice } = await collectChoices(
    message,
    challenger,
    opponent,
    interaction,
    challengerBet,
    opponentBet,
  );

  await determineWinner(
    interaction,
    message,
    challenger,
    opponent,
    challengerChoice,
    opponentChoice,
    challengerBet,
    opponentBet,
  );
}

function createChoiceButtons() {
  const choiceButtons = Object.entries(CONSTANTS.CHOICES).map(([key, emoji]) =>
    new ButtonBuilder()
      .setCustomId(`choice_${key}`)
      .setLabel(emoji)
      .setStyle(ButtonStyle.Primary),
  );

  return new ActionRowBuilder<ButtonBuilder>().addComponents(choiceButtons);
}

async function collectChoices(
  message: Message,
  challenger: User,
  opponent: User,
  interaction: ChatInputCommandInteraction,
  challengerBet?: number,
  opponentBet?: number,
): Promise<{ challengerChoice: ChoiceKey; opponentChoice: ChoiceKey }> {
  try {
    return new Promise((resolve, reject) => {
      let challengerChoice: ChoiceKey = "" as ChoiceKey;
      let opponentChoice: ChoiceKey = "" as ChoiceKey;

      const collector = message.createMessageComponentCollector({
        filter: (i) =>
          i.customId.startsWith("choice_") &&
          (i.user.id === challenger.id || i.user.id === opponent.id),
        time: CONSTANTS.TIMEOUT_DURATION,
      });

      collector.on("collect", async (i) => {
        try {
          await i.deferUpdate();

          const choice = i.customId.split("_")[1] as ChoiceKey;

          if (i.user.id === challenger.id) {
            challengerChoice = choice;
          } else if (i.user.id === opponent.id) {
            opponentChoice = choice;
          }

          const updatedEmbed = new EmbedBuilder()
            .setTitle("じゃんけん！")
            .setDescription(`✅ ${i.user.username}が手を選択しました`)
            .addFields(
              {
                name: challenger.username,
                value: `${challengerChoice ? "選択済み" : "選択中..."}${challengerBet ? `\n賭け金: ${challengerBet}コイン` : ""}`,
                inline: true,
              },
              {
                name: opponent.username,
                value: `${opponentChoice ? "選択済み" : "選択中..."}${opponentBet ? `\n賭け金: ${opponentBet}コイン` : ""}`,
                inline: true,
              },
            );

          await interaction.editReply({
            embeds: [updatedEmbed],
            components: [createChoiceButtons()],
          });

          if (challengerChoice && opponentChoice) {
            collector.stop();
            resolve({ challengerChoice, opponentChoice });
          }
        } catch (error) {
          logger.error(`[janken] Error in choice collector: ${error}`);
          // エラーが発生しても操作を継続
        }
      });

      collector.on("end", async (_collected, reason) => {
        if (reason === "time" && !(challengerChoice && opponentChoice)) {
          try {
            await interaction.editReply({
              content:
                "じゃんけんの手の選択がタイムアウトしました。じゃんけん勝負を終了します。",
              components: [],
              embeds: [],
            });
            reject(new Error("Choice selection timed out"));
          } catch (error) {
            logger.error(`[janken] Error handling choice timeout: ${error}`);
            reject(error);
          }
        }
      });
    });
  } catch (error) {
    logger.error(`[janken] Error collecting choices: ${error}`);
    throw error;
  }
}

async function determineWinner(
  interaction: ChatInputCommandInteraction,
  message: Message,
  challenger: User,
  opponent: User,
  challengerChoice: ChoiceKey,
  opponentChoice: ChoiceKey,
  challengerBet?: number,
  opponentBet?: number,
) {
  try {
    const winner = getWinner(
      challenger,
      opponent,
      challengerChoice,
      opponentChoice,
    );

    try {
      // サービス層を使用してデータベースに対戦結果を記録
      await JankenService.saveJankenResult({
        challengerId: challenger.id,
        opponentId: opponent.id,
        challengerHand: challengerChoice,
        opponentHand: opponentChoice,
        challengerBet: challengerBet ?? 0,
        opponentBet: opponentBet ?? 0,
        winnerUserId: winner?.id ?? null,
        bet: challengerBet !== undefined && opponentBet !== undefined,
      });
    } catch (dbError: unknown) {
      // データベースエラーをログに記録するが、ゲームは続行
      logger.error(`[janken] Error saving game result to database: ${dbError}`);
    }

    await showResult(
      interaction,
      message,
      challenger,
      opponent,
      challengerChoice,
      opponentChoice,
      winner,
      challengerBet,
      opponentBet,
    );
  } catch (error: unknown) {
    logger.error(`[janken] Error determining winner: ${error}`);
    await safeReply(
      interaction,
      "結果判定中にエラーが発生しました。もう一度お試しください。",
    );
  }
}

function getWinner(
  challenger: User,
  opponent: User,
  challengerChoice: ChoiceKey,
  opponentChoice: ChoiceKey,
): User | null {
  if (challengerChoice === opponentChoice) return null;

  if (
    (challengerChoice === "ROCK" && opponentChoice === "SCISSORS") ||
    (challengerChoice === "PAPER" && opponentChoice === "ROCK") ||
    (challengerChoice === "SCISSORS" && opponentChoice === "PAPER")
  ) {
    return challenger;
  }

  return opponent;
}

async function showResult(
  interaction: ChatInputCommandInteraction,
  message: Message,
  challenger: User,
  opponent: User,
  challengerChoice: ChoiceKey,
  opponentChoice: ChoiceKey,
  winner: User | null,
  challengerBet?: number,
  opponentBet?: number,
) {
  try {
    const resultEmbed = new EmbedBuilder()
      .setTitle("じゃんけん結果！")
      .addFields(
        {
          name: challenger.username,
          value: `${CONSTANTS.CHOICES[challengerChoice]}${challengerBet ? `\n賭け金: ${challengerBet}コイン` : ""}`,
          inline: true,
        },
        {
          name: opponent.username,
          value: `${CONSTANTS.CHOICES[opponentChoice]}${opponentBet ? `\n賭け金: ${opponentBet}コイン` : ""}`,
          inline: true,
        },
      );

    if (winner) {
      const totalPrize = (challengerBet ?? 0) + (opponentBet ?? 0);
      resultEmbed
        .setDescription(
          challengerBet
            ? `${winner.username}の勝ち！\n賞金${totalPrize}コインを獲得しました！`
            : `${winner.username}の勝ち！`,
        )
        .setColor(winner.id === challenger.id ? "#00FF00" : "#FF0000");
    } else {
      resultEmbed
        .setDescription(
          challengerBet ? "引き分け！\n賭け金は返却されました。" : "引き分け！",
        )
        .setColor("#FFFF00");
    }

    const rematchButton = new ButtonBuilder()
      .setCustomId("janken_rematch")
      .setLabel("もう一度勝負")
      .setStyle(ButtonStyle.Primary);

    const endButton = new ButtonBuilder()
      .setCustomId("janken_end")
      .setLabel("終了")
      .setStyle(ButtonStyle.Secondary);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      rematchButton,
      endButton,
    );

    await interaction.editReply({
      embeds: [resultEmbed],
      components: [actionRow],
    });

    try {
      await handleRematch(interaction, message, challenger, opponent);
    } catch (rematchError: unknown) {
      logger.error(`[janken] Error in rematch: ${rematchError}`);
      await interaction.editReply({
        content:
          "リマッチ処理中にエラーが発生しました。もう一度コマンドを実行してお試しください。",
        embeds: [resultEmbed],
        components: [],
      });
    }
  } catch (error: unknown) {
    logger.error(`[janken] Error showing result: ${error}`);
    await safeReply(
      interaction,
      "結果表示中にエラーが発生しました。もう一度お試しください。",
    );
  }
}

async function handleRematch(
  interaction: ChatInputCommandInteraction,
  _message: Message,
  challenger: User,
  opponent: User,
) {
  try {
    // リマッチ処理は元の埋め込みメッセージで行う
    return new Promise<void>((resolve) => {
      // インタラクション参加者のIDを保存（challenger と opponent）
      const participantIds = [challenger.id, opponent.id];

      // リマッチをリクエストしたユーザーのIDを保存する変数
      let rematchRequesterId: string | null = null;

      // 元のメッセージのコンポーネントコレクターを作成
      const rematchCollector =
        interaction.channel?.createMessageComponentCollector({
          filter: (i) =>
            (i.customId === "janken_rematch" || i.customId === "janken_end") &&
            i.message.interaction?.id === interaction.id,
          time: CONSTANTS.TIMEOUT_DURATION,
        });

      if (!rematchCollector) {
        logger.error("[janken] Failed to create rematch collector");
        resolve();
        return;
      }

      rematchCollector.on("collect", async (i) => {
        try {
          // 参加者以外のインタラクションを拒否
          if (!participantIds.includes(i.user.id)) {
            await i.reply({
              content: "このじゃんけん勝負の参加者ではありません。",
              ephemeral: true,
            });
            return;
          }

          if (i.customId === "janken_end") {
            await i.update({
              content: "じゃんけん勝負を終了します。ありがとうございました！",
              components: [],
            });
            // 停止理由を明示的に "manual" と指定
            rematchCollector.stop("manual");
            resolve();
            return;
          }

          if (i.customId === "janken_rematch") {
            // すでにリマッチをリクエストしたユーザーなら何もしない
            if (rematchRequesterId === i.user.id) {
              await i.reply({
                content:
                  "あなたはすでにリマッチをリクエストしています。相手の返答を待っています。",
                ephemeral: true,
              });
              return;
            }

            // リマッチリクエスト者のIDを保存
            rematchRequesterId = i.user.id;

            const rematchUser = i.user;
            const waitingUser =
              rematchUser.id === challenger.id ? opponent : challenger;

            // リマッチ確認を元のメッセージ内に表示
            const confirmRow =
              new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                  .setCustomId("confirm_rematch")
                  .setLabel("リマッチする")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("decline_rematch")
                  .setLabel("終了する")
                  .setStyle(ButtonStyle.Secondary),
              );

            try {
              await i.update({
                content: `${rematchUser.username}さんがリマッチを希望しています。${waitingUser.username}さん、リマッチしますか？`,
                components: [confirmRow],
              });
            } catch (error) {
              // インタラクションが既に終了している場合などのエラーハンドリング
              logger.error(`[janken] Error updating interaction: ${error}`);
              // 可能であれば元のメッセージを更新
              try {
                await interaction.editReply({
                  content: `${rematchUser.username}さんがリマッチを希望しています。${waitingUser.username}さん、リマッチしますか？`,
                  components: [confirmRow],
                });
              } catch (fallbackError) {
                logger.error(
                  `[janken] Failed to update message: ${fallbackError}`,
                );
                resolve();
                return;
              }
            }

            // リマッチ確認のコレクター（新しいコレクター）
            const confirmCollector =
              interaction.channel?.createMessageComponentCollector({
                filter: (confirmI) =>
                  (confirmI.customId === "confirm_rematch" ||
                    confirmI.customId === "decline_rematch") &&
                  confirmI.message.interaction?.id === interaction.id,
                time: CONSTANTS.TIMEOUT_DURATION,
              });

            if (!confirmCollector) {
              logger.error("[janken] Failed to create confirm collector");
              rematchCollector.stop("manual");
              resolve();
              return;
            }

            confirmCollector.on("collect", async (confirmI) => {
              try {
                // 参加者以外のインタラクションを拒否
                if (!participantIds.includes(confirmI.user.id)) {
                  await confirmI.reply({
                    content: "このじゃんけん勝負の参加者ではありません。",
                    ephemeral: true,
                  });
                  return;
                }

                // リマッチをリクエストした本人の場合は何もしない
                if (confirmI.user.id === rematchRequesterId) {
                  await confirmI.reply({
                    content:
                      "あなたはリマッチをリクエストした側です。相手の返答を待ってください。",
                    ephemeral: true,
                  });
                  return;
                }

                if (confirmI.customId === "decline_rematch") {
                  try {
                    await confirmI.update({
                      content:
                        "じゃんけん勝負を終了します。ありがとうございました！",
                      components: [],
                    });
                  } catch (updateError) {
                    // インタラクションが既に終了している場合
                    logger.error(
                      `[janken] Error updating decline interaction: ${updateError}`,
                    );
                    try {
                      await interaction.editReply({
                        content:
                          "じゃんけん勝負を終了します。ありがとうございました！",
                        components: [],
                      });
                    } catch (fallbackError) {
                      logger.error(
                        `[janken] Failed to update decline message: ${fallbackError}`,
                      );
                    }
                  }
                  confirmCollector.stop("manual");
                  rematchCollector.stop("manual");
                  resolve();
                  return;
                }

                if (confirmI.customId === "confirm_rematch") {
                  try {
                    await confirmI.update({
                      content: "リマッチを開始します！",
                      components: [],
                    });
                  } catch (updateError) {
                    // インタラクションが既に終了している場合
                    logger.error(
                      `[janken] Error updating confirm interaction: ${updateError}`,
                    );
                    try {
                      await interaction.editReply({
                        content: "リマッチを開始します！",
                        components: [],
                      });
                    } catch (fallbackError) {
                      logger.error(
                        `[janken] Failed to update confirm message: ${fallbackError}`,
                      );
                      resolve();
                      return;
                    }
                  }

                  // リマッチの設定
                  const isBetMode = interaction.options.getBoolean("bet", true);
                  const newRecruitEmbed = new EmbedBuilder()
                    .setTitle("じゃんけん勝負！")
                    .setDescription(
                      `${challenger.username}さんが${isBetMode ? "賭け" : "通常の"}じゃんけん勝負を開始します！`,
                    )
                    .setColor("#FF9900");

                  // 元のメッセージを更新
                  try {
                    await interaction.editReply({
                      content: "",
                      embeds: [newRecruitEmbed],
                      components: [],
                    });
                  } catch (editError) {
                    logger.error(
                      `[janken] Error editing reply for rematch: ${editError}`,
                    );
                    resolve();
                    return;
                  }

                  let newMessage: Message;
                  try {
                    newMessage = (await interaction.fetchReply()) as Message;
                  } catch (fetchError) {
                    logger.error(
                      `[janken] Error fetching reply for rematch: ${fetchError}`,
                    );
                    resolve();
                    return;
                  }

                  // リマッチのゲームを開始
                  try {
                    if (isBetMode) {
                      await handleBetMode(
                        interaction,
                        challenger,
                        opponent,
                        newMessage,
                      );
                    } else {
                      await handleNormalMode(
                        interaction,
                        challenger,
                        opponent,
                        newMessage,
                      );
                    }
                  } catch (gameError: unknown) {
                    logger.error(
                      `[janken] Error in rematch game: ${gameError}`,
                    );
                    try {
                      await interaction.editReply({
                        content:
                          "リマッチ中にエラーが発生しました。もう一度お試しください。",
                        embeds: [],
                        components: [],
                      });
                    } catch (editError) {
                      logger.error(
                        `[janken] Error editing reply after game error: ${editError}`,
                      );
                    }
                  }

                  confirmCollector.stop("manual");
                  rematchCollector.stop("manual");
                  resolve();
                }
              } catch (error: unknown) {
                logger.error(`[janken] Error in confirm collector: ${error}`);
                // エラーが発生しても操作を継続
              }
            });

            confirmCollector.on("end", async (collected, reason) => {
              // タイムアウト (reason === "time") の場合のみメッセージを表示
              if (reason === "time" && collected.size === 0) {
                try {
                  await interaction.editReply({
                    content:
                      "リマッチの応答がありませんでした。じゃんけん勝負を終了します。",
                    components: [],
                  });
                  rematchCollector.stop("manual");
                  resolve();
                } catch (error: unknown) {
                  logger.error(
                    `[janken] Error handling confirm timeout: ${error}`,
                  );
                  resolve();
                }
              }
            });
          }
        } catch (error: unknown) {
          logger.error(`[janken] Error in rematch collector: ${error}`);
          // エラーが発生しても操作を継続
        }
      });

      rematchCollector.on("end", async (collected, reason) => {
        // タイムアウト (reason === "time") の場合のみメッセージを表示
        if (reason === "time" && collected.size === 0) {
          try {
            await interaction.editReply({
              content: "応答がありませんでした。じゃんけん勝負を終了します。",
              components: [],
            });
          } catch (error: unknown) {
            logger.error(`[janken] Error handling rematch timeout: ${error}`);
          }
        }
        resolve();
      });
    });
  } catch (error: unknown) {
    logger.error(`[janken] Error handling rematch: ${error}`);
    throw error;
  }
}

async function handleTimeout(interaction: ChatInputCommandInteraction) {
  try {
    if (interaction.replied) {
      await interaction.editReply({
        content: "タイムアウトしました。じゃんけん勝負を終了します。",
        components: [],
        embeds: [],
      });
    } else {
      await interaction.reply({
        content: "タイムアウトしました。じゃんけん勝負を終了します。",
        components: [],
        embeds: [],
      });
    }
  } catch (error: unknown) {
    logger.error(`[janken] Error handling timeout message: ${error}`);
    // タイムアウトメッセージ表示のエラーは無視
  }
}

function createBetEmbed(challenger: User, opponent: User) {
  return new EmbedBuilder()
    .setTitle("賭け金を設定してください")
    .setDescription("両プレイヤーが賭け金を設定するまでお待ちください。")
    .addFields(
      { name: challenger.username, value: "未設定", inline: true },
      { name: opponent.username, value: "未設定", inline: true },
    );
}

function createGameEmbed(
  challenger: User,
  opponent: User,
  challengerBet?: number,
  opponentBet?: number,
) {
  const embed = new EmbedBuilder()
    .setTitle("じゃんけん！")
    .setDescription("じゃんけんの手を選んでください！");

  const challengerValue = challengerBet
    ? `選択中...\n賭け金: ${challengerBet}コイン`
    : "選択中...";
  const opponentValue = opponentBet
    ? `選択中...\n賭け金: ${opponentBet}コイン`
    : "選択中...";

  embed.addFields(
    { name: challenger.username, value: challengerValue, inline: true },
    { name: opponent.username, value: opponentValue, inline: true },
  );

  return embed;
}

async function updateBetEmbed(
  interaction: ChatInputCommandInteraction,
  challenger: User,
  opponent: User,
  challengerBet: number,
  opponentBet: number,
  betRow: ActionRowBuilder<ButtonBuilder>,
) {
  const updatedBetEmbed = new EmbedBuilder()
    .setTitle("賭け金を設定してください")
    .setDescription("両プレイヤーが賭け金を設定するまでお待ちください。")
    .addFields(
      {
        name: challenger.username,
        value: challengerBet ? `${challengerBet}コイン` : "未設定",
        inline: true,
      },
      {
        name: opponent.username,
        value: opponentBet ? `${opponentBet}コイン` : "未設定",
        inline: true,
      },
    );

  await interaction.editReply({
    embeds: [updatedBetEmbed],
    components: [betRow],
  });
}

// 安全にリプライを送信するヘルパー関数
async function safeReply(
  interaction: ChatInputCommandInteraction,
  content: string,
) {
  try {
    if (interaction.replied) {
      await interaction.followUp({ content, ephemeral: true });
    } else if (interaction.deferred) {
      await interaction.editReply({ content });
    } else {
      await interaction.reply({ content, ephemeral: true });
    }
  } catch (error: unknown) {
    logger.error(`[janken] Error sending reply: ${error}`);
  }
}
