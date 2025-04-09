import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/types/api";
import {
  type CommandInteraction,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  type TextChannel,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags,
} from "discord.js";

interface GameState {
  bet: number;
  money: number;
  maxBet: number;
}

interface CoinFlipResultResponse extends ApiResponse {
  data: {
    coinResult: "heads" | "tails";
    win: boolean;
    bet: number;
    updatedMoney: number;
  };
}

const CONSTANTS = {
  TIMEOUT_MS: 60000,
  API_ENDPOINT: "http://localhost:3001/api/minigame/coinflip",
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
  const maxBet = Math.min(state.money, 10000);
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

const createResultEmbed = (result: CoinFlipResultResponse): EmbedBuilder => {
  const resultEmoji = result.data.coinResult === "heads" ? "表 🪙" : "裏 💀";
  return new EmbedBuilder()
    .setTitle("🎲 コインフリップ結果 🎲")
    .setColor(result.data.win ? "#00ff00" : "#ff0000")
    .addFields(
      { name: "賭け金", value: `${result.data.bet}円`, inline: true },
      { name: "結果", value: resultEmoji, inline: true },
      {
        name: "獲得コイン",
        value: result.data.win ? `${result.data.bet}円` : "0円",
        inline: true,
      },
      {
        name: "現在の所持金",
        value: `${result.data.updatedMoney}円`,
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

export async function execute(interaction: CommandInteraction): Promise<void> {
  try {
    const response = await fetch(
      `${CONSTANTS.API_ENDPOINT}/status/${interaction.user.id}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );

    const userStatus = await response.json();

    if (userStatus.status === "error") {
      await interaction.reply({
        content: userStatus.error.message,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const initialBet = interaction.options.get("bet")?.value as number;
    if (initialBet < 1) {
      await interaction.reply({
        content: CONSTANTS.MESSAGES.errors.MIN_BET,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    let gameState = createGameState(initialBet, userStatus.data.money);
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

          const response = await fetch(`${CONSTANTS.API_ENDPOINT}/play`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: interaction.user.id,
              bet: gameState.bet,
              choice: i.customId,
            }),
          });

          const result = await response.json();

          if (result.status === "error") {
            await i.followUp({
              content: result.error.message,
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          gameState = {
            ...gameState,
            money: result.data.updatedMoney,
            maxBet: Math.min(result.data.updatedMoney, CONSTANTS.MAX_BET),
          };

          const resultEmbed = createResultEmbed(result);

          await i.editReply({
            embeds: [resultEmbed],
            components: [createResultButtons()],
          });
        } else if (i.customId === "playAgain") {
          if (gameState.money <= 0) {
            const noMoneyEmbed = new EmbedBuilder()
              .setTitle("💸 所持金が0円になりました")
              .setDescription(
                "\n- 所持金が足りません！\n+ /omikuji コマンドでお金を受け取ってください！",
              )
              .setColor("#ff0000")
              .setFooter({
                text: "おみくじを引いてお金をゲット！",
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setTimestamp();

            await i.update({
              embeds: [noMoneyEmbed],
              components: [],
            });
            return;
          }

          const embed = createEmbed(gameState);
          await i.update({
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

          await i.update({
            embeds: [endEmbed],
            components: [],
          });
          collector.stop();
        }
      } catch (error) {
        logger.error(`[coinflip] Error handling button interaction: ${error}`);
        await i.followUp({
          content: CONSTANTS.MESSAGES.errors.GENERIC_ERROR,
          flags: MessageFlags.Ephemeral,
        });
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        logger.info(
          `[coinflip] Game timed out for user: ${interaction.user.id}`,
        );
        const timeoutEmbed = new EmbedBuilder()
          .setTitle("⏰ タイムアウト")
          .setDescription(CONSTANTS.MESSAGES.errors.TIMEOUT)
          .setColor("#ff0000");

        await interaction.editReply({
          embeds: [timeoutEmbed],
          components: [],
        });
      }
    });
  } catch (error) {
    logger.error(`[coinflip] Error executing command: ${error}`);
    await interaction.reply({
      content: CONSTANTS.MESSAGES.errors.GENERIC_ERROR,
      flags: MessageFlags.Ephemeral,
    });
  }
}
