import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
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

const CONSTANTS = {
  TIMEOUT_DURATION: 180000,
  BET_AMOUNTS: [100, 500, 1000, 5000, 10000] as const,
  CHOICES: {
    ROCK: "✊",
    PAPER: "✋",
    SCISSORS: "✌️",
  } as const,
} as const;

type ChoiceKey = keyof typeof CONSTANTS.CHOICES;

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
      const recruitEmbed = new EmbedBuilder()
        .setTitle("じゃんけん勝負！")
        .setDescription(
          `${challenger.username}さんが${isBetMode ? "賭け" : "通常の"}じゃんけん勝負を開始します！`,
        )
        .setColor("#FF9900");

      await interaction.editReply({
        content: null,
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
      return;
    }

    // 新規ゲームの場合の処理
    message = await setupInitialMessage(interaction, challenger, isBetMode);

    try {
      const opponent = await waitForOpponent(message, challenger);

      if (isBetMode) {
        await handleBetMode(interaction, challenger, opponent, message);
      } else {
        await handleNormalMode(interaction, challenger, opponent, message);
      }
    } catch (error) {
      logger.error(`[janken] Error waiting for opponent: ${error}`);
      await handleTimeout(interaction);
    }
  } catch (error) {
    logger.error(`[janken] Error executing command: ${error}`);
    await interaction.reply("エラーが発生しました。もう一度お試しください。");
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

  return await interaction.reply({
    embeds: [recruitEmbed],
    components: [row],
    fetchReply: true,
  });
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
  } catch (error) {
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
  const [challengerBalance, opponentBalance] = await Promise.all([
    prisma.users.findUnique({ where: { id: challenger.id } }),
    prisma.users.findUnique({ where: { id: opponent.id } }),
  ]);

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

  const { challengerBet, opponentBet } = await handleBetting(
    interaction,
    message,
    challenger,
    opponent,
    challengerBalance?.money ?? 0,
    opponentBalance?.money ?? 0,
  );

  await playGame(
    interaction,
    message,
    challenger,
    opponent,
    challengerBet,
    opponentBet,
  );
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

    return new Promise((resolve) => {
      const betCollector = message.createMessageComponentCollector({
        filter: (i) => i.customId.startsWith("bet_"),
        time: CONSTANTS.TIMEOUT_DURATION,
      });

      betCollector.on("collect", async (i) => {
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
    return new Promise((resolve) => {
      let challengerChoice: ChoiceKey = "" as ChoiceKey;
      let opponentChoice: ChoiceKey = "" as ChoiceKey;

      const collector = message.createMessageComponentCollector({
        filter: (i) =>
          i.customId.startsWith("choice_") &&
          (i.user.id === challenger.id || i.user.id === opponent.id),
        time: CONSTANTS.TIMEOUT_DURATION,
      });

      collector.on("collect", async (i) => {
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
  const winner = getWinner(
    challenger,
    opponent,
    challengerChoice,
    opponentChoice,
  );

  await prisma.janken.create({
    data: {
      challengerId: challenger.id,
      opponentId: opponent.id,
      challengerHand: challengerChoice,
      opponentHand: opponentChoice,
      challengerBet: challengerBet ?? 0,
      opponentBet: opponentBet ?? 0,
      winnerUserId: winner?.id ?? null,
      bet: challengerBet !== undefined && opponentBet !== undefined,
    },
  });

  if (challengerBet && opponentBet) {
    await handleBetResult(
      challenger.id,
      opponent.id,
      winner?.id,
      challengerBet,
      opponentBet,
    );
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

async function handleBetResult(
  challengerId: string,
  opponentId: string,
  winnerId: string | undefined,
  challengerBet: number,
  opponentBet: number,
) {
  try {
    if (!winnerId) {
      return;
    }

    if (winnerId === challengerId) {
      // チャレンジャーの勝ち
      await prisma.$transaction([
        prisma.users.update({
          where: { id: challengerId },
          data: { money: { increment: opponentBet } },
        }),
        prisma.users.update({
          where: { id: opponentId },
          data: { money: { decrement: opponentBet } },
        }),
      ]);
    } else {
      // 対戦相手の勝ち
      await prisma.$transaction([
        prisma.users.update({
          where: { id: opponentId },
          data: { money: { increment: challengerBet } },
        }),
        prisma.users.update({
          where: { id: challengerId },
          data: { money: { decrement: challengerBet } },
        }),
      ]);
    }
  } catch (error) {
    logger.error(`[janken] Error handling bet result: ${error}`);
    throw error;
  }
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
  const resultEmbed = new EmbedBuilder().setTitle("じゃんけん結果！").addFields(
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

  await handleRematch(interaction, message, challenger, opponent);
}

async function handleRematch(
  interaction: ChatInputCommandInteraction,
  _message: Message,
  challenger: User,
  opponent: User,
) {
  try {
    const rematchRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("janken_rematch")
        .setLabel("リマッチ")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("janken_end")
        .setLabel("終了")
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.followUp({
      content: "もう一度勝負しますか？",
      components: [rematchRow],
    });

    const rematchMessage = await interaction.fetchReply();

    const rematchCollector = rematchMessage.createMessageComponentCollector({
      filter: (i) =>
        (i.customId === "janken_rematch" || i.customId === "janken_end") &&
        (i.user.id === challenger.id || i.user.id === opponent.id),
      time: CONSTANTS.TIMEOUT_DURATION,
    });

    return new Promise<void>((resolve) => {
      rematchCollector.on("collect", async (i) => {
        if (i.customId === "janken_end") {
          await i.update({
            content: "じゃんけん勝負を終了します。ありがとうございました！",
            components: [],
          });
          rematchCollector.stop();
          resolve();
        } else if (i.customId === "janken_rematch") {
          const rematchUser = i.user;
          const waitingUser =
            rematchUser.id === challenger.id ? opponent : challenger;

          await i.update({
            content: `${rematchUser.username}さんがリマッチを希望しています。${waitingUser.username}さんの応答を待っています...`,
            components: [],
          });

          const confirmRow =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId("confirm_rematch")
                .setLabel("リマッチする")
                .setStyle(ButtonStyle.Primary),
            );

          await interaction.followUp({
            content: `${waitingUser}さん、リマッチしますか？`,
            components: [confirmRow],
          });

          const confirmMessage = await interaction.fetchReply();
          const confirmCollector =
            confirmMessage.createMessageComponentCollector({
              filter: (i) => i.customId === "confirm_rematch",
              time: CONSTANTS.TIMEOUT_DURATION,
            });

          confirmCollector.on("collect", async (i) => {
            if (i.user.id !== waitingUser.id) {
              await i.reply({
                content: "あなたは対象者ではありません。",
                ephemeral: true,
              });
              return;
            }

            await i.update({
              content: "リマッチを開始します！",
              components: [],
            });

            // const bet = interaction.options.getBoolean("bet", true);
            // const newInteraction = interaction.followUp({
            //   content: "リマッチを準備中...",
            //   fetchReply: true,
            // });

            execute(interaction, {
              challenger,
              opponent,
            });

            confirmCollector.stop();
            rematchCollector.stop();
            resolve();
          });

          confirmCollector.on("end", async (collected) => {
            if (collected.size === 0) {
              await interaction.followUp({
                content:
                  "リマッチの応答がありませんでした。じゃんけん勝負を終了します。",
              });
              rematchCollector.stop();
              resolve();
            }
          });
        }
      });

      rematchCollector.on("end", async (collected) => {
        if (collected.size === 0) {
          await interaction.followUp({
            content: "応答がありませんでした。じゃんけん勝負を終了します。",
          });
          resolve();
        }
      });
    });
  } catch (error) {
    logger.error(`[janken] Error handling rematch: ${error}`);
    throw error;
  }
}

async function handleTimeout(interaction: ChatInputCommandInteraction) {
  await interaction.editReply({
    content: "タイムアウトしました。じゃんけん勝負を終了します。",
    components: [],
  });
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
