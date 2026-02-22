import { logger } from "@lib/logger";
import * as JankenService from "@services/minigame";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  type Message,
  type MessageComponentInteraction,
  MessageFlags,
  SlashCommandBuilder,
  type User,
} from "discord.js";

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

type GameState =
  | "waiting_opponent"
  | "betting"
  | "playing"
  | "finished"
  | "rematch_confirm";

interface GameResult {
  challenger: User;
  opponent: User;
  challengerChoice: ChoiceKey;
  opponentChoice: ChoiceKey;
  winner: User | null;
  challengerBet?: number;
  opponentBet?: number;
}

class JankenGame {
  private interaction: ChatInputCommandInteraction;
  private challenger: User;
  private opponent?: User;
  private message?: Message;
  private state: GameState = "waiting_opponent";
  private isBetMode: boolean;
  private challengerBet = 0;
  private opponentBet = 0;
  private challengerChoice?: ChoiceKey;
  private opponentChoice?: ChoiceKey;
  private collectors: Set<
    ReturnType<Message["createMessageComponentCollector"]>
  > = new Set();
  private isCleanedUp = false;

  constructor(
    interaction: ChatInputCommandInteraction,
    challenger: User,
    isBetMode: boolean,
  ) {
    this.interaction = interaction;
    this.challenger = challenger;
    this.isBetMode = isBetMode;
  }

  async start(): Promise<void> {
    try {
      if (this.opponent) {
        // リマッチモード
        await this.startRematch();
      } else {
        // 新規ゲームモード
        await this.startNewGame();
      }
    } catch (error: unknown) {
      logger.error(`[janken] Error starting game: ${error}`);
      await this.handleError(
        "ゲーム開始中にエラーが発生しました。もう一度お試しください。",
      );
    }
  }

  async startWithOpponent(opponent: User): Promise<void> {
    this.opponent = opponent;
    await this.start();
  }

  private async startNewGame(): Promise<void> {
    this.message = await this.setupInitialMessage();

    try {
      this.opponent = await this.waitForOpponent();
      await this.proceedToGame();
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("timeout")) {
        await this.handleTimeout();
      } else {
        logger.error(`[janken] Error waiting for opponent: ${error}`);
        throw error;
      }
    }
  }

  private async startRematch(): Promise<void> {
    if (!this.opponent) {
      throw new Error("Opponent required for rematch");
    }

    const recruitEmbed = new EmbedBuilder()
      .setTitle("じゃんけん勝負！")
      .setDescription(
        `${this.challenger.username}さんが${this.isBetMode ? "賭け" : "通常の"}じゃんけん勝負を開始します！`,
      )
      .setColor("#FF9900");

    await this.interaction.editReply({
      content: "",
      embeds: [recruitEmbed],
      components: [],
    });

    this.message = (await this.interaction.fetchReply()) as Message;
    await this.proceedToGame();
  }

  private async setupInitialMessage(): Promise<Message> {
    const recruitEmbed = new EmbedBuilder()
      .setTitle("じゃんけん勝負！")
      .setDescription(
        `${this.challenger.username}さんが${this.isBetMode ? "賭け" : "通常の"}じゃんけん勝負を募集しています！\n参加する場合は下のボタンを押してください。`,
      )
      .setColor("#FF9900");

    const joinButton = new ButtonBuilder()
      .setCustomId("join_janken")
      .setLabel("参加する")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(joinButton);

    await this.interaction.reply({
      embeds: [recruitEmbed],
      components: [row],
    });

    return (await this.interaction.fetchReply()) as Message;
  }

  private async waitForOpponent(): Promise<User> {
    if (!this.message) {
      throw new Error("Message not initialized");
    }

    return new Promise((resolve, reject) => {
      const collector = this.message!.createMessageComponentCollector({
        filter: (i) =>
          i.customId === "join_janken" && i.user.id !== this.challenger.id,
        time: CONSTANTS.TIMEOUT_DURATION,
      });

      this.collectors.add(collector);

      collector.on("collect", async (i) => {
        try {
          await i.deferUpdate();
          this.cleanupCollector(collector);
          resolve(i.user);
        } catch (error: unknown) {
          logger.error(`[janken] Error in join collector: ${error}`);
          reject(error);
        }
      });

      collector.on("end", (_collected, reason) => {
        this.cleanupCollector(collector);
        if (reason === "time") {
          reject(new Error("Opponent waiting timeout"));
        }
      });
    });
  }

  private async proceedToGame(): Promise<void> {
    if (!this.opponent) {
      throw new Error("Opponent not found");
    }

    if (this.isBetMode) {
      await this.handleBetting();
    } else {
      await this.playGame();
    }
  }

  private async handleBetting(): Promise<void> {
    if (!this.opponent) return;

    this.state = "betting";

    try {
      const result = await JankenService.checkBothUserBalances(
        this.challenger,
        this.opponent,
      );

      const challengerBalance = result.challengerBalance;
      const opponentBalance = result.opponentBalance;

      await this.collectBets(challengerBalance, opponentBalance);
      await this.playGame();
    } catch (dbError: unknown) {
      logger.error(`[janken] Error fetching user balances: ${dbError}`);
      await this.interaction.followUp({
        content:
          "ユーザーデータの取得中にエラーが発生しました。通常モードで続行します。",
        flags: MessageFlags.Ephemeral,
      });
      this.isBetMode = false;
      await this.playGame();
    }
  }

  private async collectBets(
    challengerBalance: number,
    opponentBalance: number,
  ): Promise<void> {
    if (!this.opponent) return;

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
    const betEmbed = this.createBetEmbed();

    await this.interaction.editReply({
      embeds: [betEmbed],
      components: [betRow],
    });

    return new Promise((resolve, reject) => {
      if (!this.message) {
        reject(new Error("Message not initialized"));
        return;
      }

      const collector = this.message.createMessageComponentCollector({
        filter: (i) => i.customId.startsWith("bet_"),
        time: CONSTANTS.TIMEOUT_DURATION,
      });

      this.collectors.add(collector);

      collector.on("collect", async (i) => {
        try {
          await i.deferUpdate();

          const amount = Number(i.customId.split("_")[1]);
          const userBalance =
            i.user.id === this.challenger.id
              ? challengerBalance
              : opponentBalance;

          if (userBalance < amount) {
            await i.followUp({
              content: `所持金が足りません。現在の所持金: ${userBalance}コイン`,
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          if (i.user.id === this.challenger.id) {
            this.challengerBet = amount;
          } else if (i.user.id === this.opponent?.id) {
            this.opponentBet = amount;
          }

          await this.updateBetEmbed(betRow);

          if (this.challengerBet && this.opponentBet) {
            this.cleanupCollector(collector);
            resolve();
          }
        } catch (error: unknown) {
          logger.error(`[janken] Error in bet collector: ${error}`);
        }
      });

      collector.on("end", async (_collected, reason) => {
        this.cleanupCollector(collector);
        if (reason === "time" && !(this.challengerBet && this.opponentBet)) {
          try {
            await this.interaction.editReply({
              content:
                "賭け金設定がタイムアウトしました。じゃんけん勝負を終了します。",
              components: [],
              embeds: [],
            });
            reject(new Error("Betting timed out"));
          } catch (error: unknown) {
            logger.error(`[janken] Error handling bet timeout: ${error}`);
            reject(error);
          }
        }
      });
    });
  }

  private async playGame(): Promise<void> {
    if (!this.opponent) return;

    this.state = "playing";

    const gameEmbed = this.createGameEmbed();
    const choiceRow = this.createChoiceButtons();

    await this.interaction.editReply({
      embeds: [gameEmbed],
      components: [choiceRow],
    });

    await this.collectChoices();
    await this.determineWinner();
  }

  private async collectChoices(): Promise<void> {
    if (!this.opponent || !this.message) return;

    return new Promise((resolve, reject) => {
      const collector = this.message!.createMessageComponentCollector({
        filter: (i) =>
          i.customId.startsWith("choice_") &&
          (i.user.id === this.challenger.id || i.user.id === this.opponent?.id),
        time: CONSTANTS.TIMEOUT_DURATION,
      });

      this.collectors.add(collector);

      collector.on("collect", async (i) => {
        try {
          await i.deferUpdate();

          const choice = i.customId.split("_")[1] as ChoiceKey;

          if (i.user.id === this.challenger.id) {
            this.challengerChoice = choice;
          } else if (i.user.id === this.opponent?.id) {
            this.opponentChoice = choice;
          }

          await this.updateChoiceEmbed(i.user.username);

          if (this.challengerChoice && this.opponentChoice) {
            this.cleanupCollector(collector);
            resolve();
          }
        } catch (error: unknown) {
          logger.error(`[janken] Error in choice collector: ${error}`);
        }
      });

      collector.on("end", async (_collected, reason) => {
        this.cleanupCollector(collector);
        if (
          reason === "time" &&
          !(this.challengerChoice && this.opponentChoice)
        ) {
          try {
            await this.interaction.editReply({
              content:
                "じゃんけんの手の選択がタイムアウトしました。じゃんけん勝負を終了します。",
              components: [],
              embeds: [],
            });
            reject(new Error("Choice selection timed out"));
          } catch (error: unknown) {
            logger.error(`[janken] Error handling choice timeout: ${error}`);
            reject(error);
          }
        }
      });
    });
  }

  private async determineWinner(): Promise<void> {
    if (!this.opponent || !this.challengerChoice || !this.opponentChoice)
      return;

    this.state = "finished";

    const winner = this.getWinner(this.challengerChoice, this.opponentChoice);

    try {
      await JankenService.saveJankenResult({
        challengerId: this.challenger.id,
        opponentId: this.opponent.id,
        challengerHand: this.challengerChoice,
        opponentHand: this.opponentChoice,
        challengerBet: this.challengerBet,
        opponentBet: this.opponentBet,
        winnerUserId: winner?.id ?? null,
        bet: this.isBetMode,
      });
    } catch (dbError: unknown) {
      logger.error(`[janken] Error saving game result to database: ${dbError}`);
    }

    await this.showResult(winner);
  }

  private getWinner(
    challengerChoice: ChoiceKey,
    opponentChoice: ChoiceKey,
  ): User | null {
    if (challengerChoice === opponentChoice) return null;

    if (
      (challengerChoice === "ROCK" && opponentChoice === "SCISSORS") ||
      (challengerChoice === "PAPER" && opponentChoice === "ROCK") ||
      (challengerChoice === "SCISSORS" && opponentChoice === "PAPER")
    ) {
      return this.challenger;
    }

    return this.opponent || null;
  }

  private async showResult(winner: User | null): Promise<void> {
    if (!this.opponent || !this.challengerChoice || !this.opponentChoice)
      return;

    const resultEmbed = new EmbedBuilder()
      .setTitle("じゃんけん結果！")
      .addFields(
        {
          name: this.challenger.username,
          value: `${CONSTANTS.CHOICES[this.challengerChoice]}${this.challengerBet ? `\n賭け金: ${this.challengerBet}コイン` : ""}`,
          inline: true,
        },
        {
          name: this.opponent.username,
          value: `${CONSTANTS.CHOICES[this.opponentChoice]}${this.opponentBet ? `\n賭け金: ${this.opponentBet}コイン` : ""}`,
          inline: true,
        },
      );

    if (winner) {
      const totalPrize = this.challengerBet + this.opponentBet;
      resultEmbed
        .setDescription(
          this.challengerBet
            ? `${winner.username}の勝ち！\n賞金${totalPrize}コインを獲得しました！`
            : `${winner.username}の勝ち！`,
        )
        .setColor(winner.id === this.challenger.id ? "#00FF00" : "#FF0000");
    } else {
      resultEmbed
        .setDescription(
          this.challengerBet
            ? "引き分け！\n賭け金は返却されました。"
            : "引き分け！",
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

    await this.interaction.editReply({
      embeds: [resultEmbed],
      components: [actionRow],
    });

    await this.handleRematch();
  }

  private async handleRematch(): Promise<void> {
    if (!this.opponent || !this.message) return;

    this.state = "rematch_confirm";
    const participantIds = [this.challenger.id, this.opponent.id];
    let rematchRequesterId: string | null = null;

    return new Promise<void>((resolve) => {
      if (!this.interaction.channel) {
        resolve();
        return;
      }

      const collector =
        this.interaction.channel.createMessageComponentCollector({
          filter: (i) =>
            (i.customId === "janken_rematch" || i.customId === "janken_end") &&
            i.message.interactionMetadata?.id === this.interaction.id,
          time: CONSTANTS.TIMEOUT_DURATION,
        });

      this.collectors.add(collector);

      collector.on("collect", async (i) => {
        try {
          if (!participantIds.includes(i.user.id)) {
            await i.reply({
              content: "このじゃんけん勝負の参加者ではありません。",
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          if (i.customId === "janken_end") {
            await i.update({
              content: "じゃんけん勝負を終了します。ありがとうございました！",
              components: [],
            });
            this.cleanupCollector(collector);
            this.cleanup();
            resolve();
            return;
          }

          if (i.customId === "janken_rematch") {
            if (rematchRequesterId === i.user.id) {
              await i.reply({
                content:
                  "あなたはすでにリマッチをリクエストしています。相手の返答を待っています。",
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            rematchRequesterId = i.user.id;
            const waitingUser =
              i.user.id === this.challenger.id
                ? this.opponent!
                : this.challenger;

            await this.handleRematchConfirmation(
              i,
              waitingUser,
              collector,
              resolve,
            );
          }
        } catch (error: unknown) {
          logger.error(`[janken] Error in rematch collector: ${error}`);
        }
      });

      collector.on("end", async (collected, reason) => {
        this.cleanupCollector(collector);
        if (reason === "time" && collected.size === 0) {
          try {
            await this.interaction.editReply({
              content: "応答がありませんでした。じゃんけん勝負を終了します。",
              components: [],
            });
          } catch (error: unknown) {
            logger.error(`[janken] Error handling rematch timeout: ${error}`);
          }
        }
        this.cleanup();
        resolve();
      });
    });
  }

  private async handleRematchConfirmation(
    rematchInteraction: MessageComponentInteraction,
    waitingUser: User,
    parentCollector: ReturnType<Message["createMessageComponentCollector"]>,
    resolveParent: () => void,
  ): Promise<void> {
    const confirmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm_rematch")
        .setLabel("リマッチする")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("decline_rematch")
        .setLabel("終了する")
        .setStyle(ButtonStyle.Secondary),
    );

    await rematchInteraction.update({
      content: `${rematchInteraction.user.username}さんがリマッチを希望しています。${waitingUser.username}さん、リマッチしますか？`,
      components: [confirmRow],
    });

    if (!this.interaction.channel) return;

    const confirmCollector =
      this.interaction.channel.createMessageComponentCollector({
        filter: (i) =>
          (i.customId === "confirm_rematch" ||
            i.customId === "decline_rematch") &&
          i.message.interactionMetadata?.id === this.interaction.id,
        time: CONSTANTS.TIMEOUT_DURATION,
      });

    this.collectors.add(confirmCollector);

    confirmCollector.on("collect", async (i) => {
      try {
        if (i.user.id !== waitingUser.id) {
          await i.reply({
            content: "あなたへのリマッチ確認ではありません。",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (i.customId === "decline_rematch") {
          await i.update({
            content: "じゃんけん勝負を終了します。ありがとうございました！",
            components: [],
          });
          this.cleanupCollector(confirmCollector);
          this.cleanupCollector(parentCollector);
          this.cleanup();
          resolveParent();
          return;
        }

        if (i.customId === "confirm_rematch") {
          await i.update({
            content: "リマッチを開始します！",
            components: [],
          });

          this.cleanupCollector(confirmCollector);
          this.cleanupCollector(parentCollector);

          // 新しいゲームインスタンスを作成してリマッチを開始
          const rematchGame = new JankenGame(
            this.interaction,
            this.challenger,
            this.isBetMode,
          );
          await rematchGame.startWithOpponent(this.opponent!);
          resolveParent();
        }
      } catch (error: unknown) {
        logger.error(`[janken] Error in confirm collector: ${error}`);
      }
    });

    confirmCollector.on("end", async (collected, reason) => {
      this.cleanupCollector(confirmCollector);
      if (reason === "time" && collected.size === 0) {
        try {
          await this.interaction.editReply({
            content:
              "リマッチの応答がありませんでした。じゃんけん勝負を終了します。",
            components: [],
          });
          this.cleanupCollector(parentCollector);
          this.cleanup();
          resolveParent();
        } catch (error: unknown) {
          logger.error(`[janken] Error handling confirm timeout: ${error}`);
          resolveParent();
        }
      }
    });
  }

  private createChoiceButtons(): ActionRowBuilder<ButtonBuilder> {
    const choiceButtons = Object.entries(CONSTANTS.CHOICES).map(
      ([key, emoji]) =>
        new ButtonBuilder()
          .setCustomId(`choice_${key}`)
          .setLabel(emoji)
          .setStyle(ButtonStyle.Primary),
    );

    return new ActionRowBuilder<ButtonBuilder>().addComponents(choiceButtons);
  }

  private createBetEmbed(): EmbedBuilder {
    if (!this.opponent) {
      throw new Error("Opponent not found");
    }

    return new EmbedBuilder()
      .setTitle("賭け金を設定してください")
      .setDescription("両プレイヤーが賭け金を設定するまでお待ちください。")
      .addFields(
        { name: this.challenger.username, value: "未設定", inline: true },
        { name: this.opponent.username, value: "未設定", inline: true },
      );
  }

  private createGameEmbed(): EmbedBuilder {
    if (!this.opponent) {
      throw new Error("Opponent not found");
    }

    const embed = new EmbedBuilder()
      .setTitle("じゃんけん！")
      .setDescription("じゃんけんの手を選んでください！");

    const challengerValue = this.challengerBet
      ? `選択中...\n賭け金: ${this.challengerBet}コイン`
      : "選択中...";
    const opponentValue = this.opponentBet
      ? `選択中...\n賭け金: ${this.opponentBet}コイン`
      : "選択中...";

    embed.addFields(
      { name: this.challenger.username, value: challengerValue, inline: true },
      { name: this.opponent.username, value: opponentValue, inline: true },
    );

    return embed;
  }

  private async updateBetEmbed(
    betRow: ActionRowBuilder<ButtonBuilder>,
  ): Promise<void> {
    if (!this.opponent) return;

    const updatedBetEmbed = new EmbedBuilder()
      .setTitle("賭け金を設定してください")
      .setDescription("両プレイヤーが賭け金を設定するまでお待ちください。")
      .addFields(
        {
          name: this.challenger.username,
          value: this.challengerBet ? `${this.challengerBet}コイン` : "未設定",
          inline: true,
        },
        {
          name: this.opponent.username,
          value: this.opponentBet ? `${this.opponentBet}コイン` : "未設定",
          inline: true,
        },
      );

    await this.interaction.editReply({
      embeds: [updatedBetEmbed],
      components: [betRow],
    });
  }

  private async updateChoiceEmbed(username: string): Promise<void> {
    if (!this.opponent) return;

    const updatedEmbed = new EmbedBuilder()
      .setTitle("じゃんけん！")
      .setDescription(`✅ ${username}が手を選択しました`)
      .addFields(
        {
          name: this.challenger.username,
          value: `${this.challengerChoice ? "選択済み" : "選択中..."}${this.challengerBet ? `\n賭け金: ${this.challengerBet}コイン` : ""}`,
          inline: true,
        },
        {
          name: this.opponent.username,
          value: `${this.opponentChoice ? "選択済み" : "選択中..."}${this.opponentBet ? `\n賭け金: ${this.opponentBet}コイン` : ""}`,
          inline: true,
        },
      );

    await this.interaction.editReply({
      embeds: [updatedEmbed],
      components: [this.createChoiceButtons()],
    });
  }

  private cleanupCollector(
    collector: ReturnType<Message["createMessageComponentCollector"]>,
  ): void {
    if (this.collectors.has(collector)) {
      collector.stop();
      this.collectors.delete(collector);
    }
  }

  private cleanup(): void {
    if (this.isCleanedUp) return;

    this.isCleanedUp = true;

    // すべてのコレクターを停止・削除
    for (const collector of this.collectors) {
      try {
        collector.stop();
      } catch (error) {
        logger.error(`[janken] Error stopping collector: ${error}`);
      }
    }
    this.collectors.clear();
  }

  private async handleTimeout(): Promise<void> {
    try {
      if (this.interaction.replied) {
        await this.interaction.editReply({
          content: "タイムアウトしました。じゃんけん勝負を終了します。",
          components: [],
          embeds: [],
        });
      } else {
        await this.interaction.reply({
          content: "タイムアウトしました。じゃんけん勝負を終了します。",
          components: [],
          embeds: [],
        });
      }
    } catch (error: unknown) {
      logger.error(`[janken] Error handling timeout message: ${error}`);
    }
    this.cleanup();
  }

  private async handleError(message: string): Promise<void> {
    try {
      if (this.interaction.replied) {
        await this.interaction.followUp({
          content: message,
          flags: MessageFlags.Ephemeral,
        });
      } else if (this.interaction.deferred) {
        await this.interaction.editReply({ content: message });
      } else {
        await this.interaction.reply({
          content: message,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error: unknown) {
      logger.error(`[janken] Error sending error message: ${error}`);
    }
    this.cleanup();
  }
}

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

    const game = new JankenGame(interaction, challenger, isBetMode);

    if (rematchUsers) {
      await game.startWithOpponent(rematchUsers.opponent);
    } else {
      await game.start();
    }
  } catch (error: unknown) {
    logger.error(`[janken] Error executing command: ${error}`);
    await safeReply(
      interaction,
      "エラーが発生しました。もう一度お試しください。",
    );
  }
}

// 安全にリプライを送信するヘルパー関数
async function safeReply(
  interaction: ChatInputCommandInteraction,
  content: string,
) {
  try {
    if (interaction.replied) {
      await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
    } else if (interaction.deferred) {
      await interaction.editReply({ content });
    } else {
      await interaction.reply({ content, flags: MessageFlags.Ephemeral });
    }
  } catch (error: unknown) {
    logger.error(`[janken] Error sending reply: ${error}`);
  }
}
