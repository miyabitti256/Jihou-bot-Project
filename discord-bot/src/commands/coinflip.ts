import {
  type CoinChoice,
  CoinflipError,
  type CoinResult,
  getUserMoneyStatus,
  playCoinflip,
} from "@services/minigame/coinflip";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  ModalBuilder,
  SlashCommandBuilder,
  type TextChannel,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "@lib/logger";

interface GameState {
  bet: number;
  money: number;
  maxBet: number;
}

const CONSTANTS = {
  TIMEOUT_MS: 60000,
  MAX_BET: 10000,
  MESSAGES: {
    errors: {
      NO_MONEY_DATA:
        "所持金データが見つかりません。/omikuji コマンドでお金を受け取ってください。",
      MIN_BET: "賭け金は1円以上である必要があります。",
      NO_MONEY:
        "所持金が0円です。/omikuji コマンドでお金を受け取ってください。",
      INVALID_BET: (maxBet: number) =>
        `無効な金額です。1～${maxBet}円の間で指定してください。`,
      TIMEOUT: "制限時間が過ぎました。もう一度コマンドを実行してください。",
      GENERIC_ERROR: "エラーが発生しました。もう一度お試しください。",
    },
  },
} as const;

const createGameState = (bet: number, money: number): GameState => ({
  bet: Math.min(bet, Math.min(money, CONSTANTS.MAX_BET)),
  money,
  maxBet: Math.min(money, CONSTANTS.MAX_BET),
});

const setBet = (state: GameState, newBet: number): GameState => ({
  ...state,
  bet: Math.max(1, Math.min(state.maxBet, newBet)),
});

export const data = new SlashCommandBuilder()
  .setName("coinflip")
  .setDescription("コインフリップゲームを行います。")
  .addIntegerOption((option) =>
    option.setName("bet").setDescription("賭け金").setRequired(true),
  );

const createEmbed = (state: GameState): EmbedBuilder => {
  return new EmbedBuilder()
    .setTitle("🎲 コインフリップ 🎲")
    .setDescription(
      `現在の賭け金: ${state.bet}円\n` +
        `所持金: ${state.money}円\n` +
        `最大賭け金: ${state.maxBet}円`,
    )
    .setColor("#0099ff");
};

const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("input")
    .setLabel("賭け金変更")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("heads")
    .setLabel("表")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("🪙"),
  new ButtonBuilder()
    .setCustomId("tails")
    .setLabel("裏")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("💀"),
);

const createResultButtons = (): ActionRowBuilder<ButtonBuilder> =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("playAgain")
      .setLabel("もう一度プレイ")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🎲"),
    new ButtonBuilder()
      .setCustomId("endGame")
      .setLabel("終了")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⏹️"),
  );

const createResultEmbed = (result: CoinResult): EmbedBuilder => {
  const resultEmoji = result.coinResult === "heads" ? "表 🪙" : "裏 💀";
  return new EmbedBuilder()
    .setTitle("🎲 コインフリップ結果 🎲")
    .setColor(result.win ? "#00ff00" : "#ff0000")
    .addFields(
      { name: "賭け金", value: `${result.bet}円`, inline: true },
      { name: "結果", value: resultEmoji, inline: true },
      {
        name: "獲得コイン",
        value: result.win ? `${result.bet}円` : "0円",
        inline: true,
      },
      {
        name: "現在の所持金",
        value: `${result.updatedMoney}円`,
        inline: true,
      },
    );
};

const createBetInputModal = (currentBet: number): ModalBuilder => {
  const betInput = new TextInputBuilder()
    .setCustomId("betAmount")
    .setLabel("賭け金を入力してください")
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(1)
    .setMaxLength(5)
    .setValue(currentBet.toString());

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    betInput,
  );

  return new ModalBuilder()
    .setCustomId("betInput")
    .setTitle("賭け金変更")
    .addComponents(actionRow);
};

export async function execute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  try {
    const userMoney = await getUserMoneyStatus(interaction.user.id);

    const initialBet = interaction.options.getInteger("bet");
    if (initialBet === null || initialBet < 1) {
      await interaction.reply({
        content: CONSTANTS.MESSAGES.errors.MIN_BET,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (userMoney <= 0) {
      await interaction.reply({
        content: CONSTANTS.MESSAGES.errors.NO_MONEY,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    let gameState = createGameState(initialBet, userMoney);
    const buttons = [buttonRow];
    const embed = createEmbed(gameState);

    await interaction.reply({
      embeds: [embed],
      components: buttons,
    });

    const collector = (
      interaction.channel as TextChannel
    ).createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      idle: CONSTANTS.TIMEOUT_MS,
    });
    collector.on("collect", async (i) => {
      try {
        if (i.customId === "input") {
          const modal = createBetInputModal(gameState.bet);
          await i.showModal(modal);
          const modalSubmit = await i.awaitModalSubmit({
            time: CONSTANTS.TIMEOUT_MS,
            filter: (i) => i.user.id === interaction.user.id,
          });

          await modalSubmit.deferUpdate();

          const newBet = Number.parseInt(
            modalSubmit.fields.getTextInputValue("betAmount"),
          );
          gameState = setBet(gameState, newBet);
          const newEmbed = createEmbed(gameState);
          await modalSubmit.editReply({
            embeds: [newEmbed],
            components: buttons,
          });
        } else if (i.customId === "heads" || i.customId === "tails") {
          await i.deferUpdate();

          try {
            const result = await playCoinflip(
              interaction.user.id,
              gameState.bet,
              i.customId as CoinChoice,
            );

            gameState = {
              ...gameState,
              money: result.updatedMoney,
              maxBet: Math.min(result.updatedMoney, CONSTANTS.MAX_BET),
            };

            const resultEmbed = createResultEmbed(result);

            await i.editReply({
              embeds: [resultEmbed],
              components: [createResultButtons()],
            });
          } catch (error) {
            if (error instanceof CoinflipError) {
              let errorMessage = "";

              if (error.message === "MONEY_DATA_NOT_FOUND") {
                errorMessage = CONSTANTS.MESSAGES.errors.NO_MONEY_DATA;
              } else if (error.message === "NO_MONEY") {
                errorMessage = CONSTANTS.MESSAGES.errors.NO_MONEY;
              } else if (error.message === "INVALID_BET") {
                errorMessage = CONSTANTS.MESSAGES.errors.MIN_BET;
              } else if (error.message === "INVALID_BET_AMOUNT") {
                errorMessage = CONSTANTS.MESSAGES.errors.INVALID_BET(
                  gameState.maxBet,
                );
              } else {
                errorMessage = CONSTANTS.MESSAGES.errors.GENERIC_ERROR;
              }

              await i.followUp({
                content: errorMessage,
                flags: MessageFlags.Ephemeral,
              });
            } else {
              logger.error(`[coinflip] Error: ${error}`);
              await i.followUp({
                content: CONSTANTS.MESSAGES.errors.GENERIC_ERROR,
                flags: MessageFlags.Ephemeral,
              });
            }
          }
        } else if (i.customId === "playAgain") {
          if (gameState.money <= 0) {
            const noMoneyEmbed = new EmbedBuilder()
              .setTitle("💸 所持金が0円になりました")
              .setDescription(
                "```diff\n- 所持金が足りません！\n+ /omikuji コマンドでお金を受け取ってください！```",
              )
              .setColor("#ff0000")
              .setFooter({
                text: "おみくじを引いてお金をゲット！",
              })
              .setTimestamp();

            await i.update({
              embeds: [noMoneyEmbed],
              components: [],
            });
            return;
          }

          await i.deferUpdate();
          const embed = createEmbed(gameState);
          await i.editReply({
            embeds: [embed],
            components: buttons,
          });
        } else if (i.customId === "endGame") {
          const endEmbed = new EmbedBuilder()
            .setTitle("👋 コインフリップを終了します")
            .setDescription("```diff\n+ お疲れ様でした！またね```")
            .setColor("#00ff00")
            .setFooter({
              text: `所持金: ${gameState.money}円`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

          collector.stop();
          await i.update({
            content: "",
            embeds: [endEmbed],
            components: [],
          });
        }
      } catch (error) {
        logger.error(`[coinflip] Error handling interaction: ${error}`);
        await i.followUp({
          content: CONSTANTS.MESSAGES.errors.GENERIC_ERROR,
          flags: MessageFlags.Ephemeral,
        });
      }
    });

    collector.on("end", async (_, reason) => {
      if (reason === "idle") {
        try {
          const currentMoney = await getUserMoneyStatus(interaction.user.id);

          // タイムアウトメッセージの埋め込みを作成
          const timeoutEmbed = new EmbedBuilder()
            .setTitle("⏰ タイムアウト")
            .setDescription(CONSTANTS.MESSAGES.errors.TIMEOUT)
            .setColor("#ff0000")
            .setFooter({
              text: `所持金: ${currentMoney}円`,
            });

          await interaction.editReply({
            content: "",
            embeds: [timeoutEmbed],
            components: [],
          });
        } catch (error) {
          logger.error(`[coinflip] Error updating idle message: ${error}`);
          try {
            await interaction.editReply({
              content: CONSTANTS.MESSAGES.errors.TIMEOUT,
              embeds: [],
              components: [],
            });
          } catch (fallbackError) {
            logger.error(
              `[coinflip] Error updating fallback idle message: ${fallbackError}`,
            );
          }
        }
      }
    });
  } catch (error) {
    logger.error(`[coinflip] Error executing command: ${error}`);
    if (
      error instanceof CoinflipError &&
      error.message === "MONEY_DATA_NOT_FOUND"
    ) {
      await interaction.reply({
        content: CONSTANTS.MESSAGES.errors.NO_MONEY_DATA,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: CONSTANTS.MESSAGES.errors.GENERIC_ERROR,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}
