import {
  type ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("botjanken")
  .setDescription("ジャンケンするで command created by fujicco")
  .addStringOption((option) =>
    option
      .setName("出す手")
      .setDescription("じゃんけんの手を選んでください")
      .setRequired(true)
      .addChoices(
        { name: "✊ グー", value: "g" },
        { name: "✌️ チョキ", value: "c" },
        { name: "✋ パー", value: "p" },
      ),
  );

const HANDS = {
  g: 0,
  c: 1,
  p: 2,
} as const;

type Hand = keyof typeof HANDS;

// Hand 型かどうかを検証する型ガード
function isHand(value: string): value is Hand {
  return value in HANDS;
}

const getResult = (userHand: Hand, enemyHand: Hand): string => {
  const userValue = HANDS[userHand];
  const enemyValue = HANDS[enemyHand];

  const result = (3 + enemyValue - userValue) % 3;

  switch (result) {
    case 0:
      return "あいこ・。・";
    case 1:
      return "お前の勝ち・、・";
    case 2:
      return "お前の負けｖ＾。＾。＾ｖ";
    default:
      throw new Error("予期せぬエラーが発生しました");
  }
};

export const execute = async (i: ChatInputCommandInteraction) => {
  const userHandStr = i.options.getString("出す手", true);
  if (!isHand(userHandStr)) {
    await i.reply({
      content: "無効な手が指定されました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const userHand = userHandStr;
  const randomValue = Math.floor(Math.random() * 3);
  const handKeys = Object.keys(HANDS);
  const enemyHandStr = handKeys[randomValue];
  if (!enemyHandStr || !isHand(enemyHandStr)) {
    await i.reply({
      content: "エラーが発生しました",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const enemyHand = enemyHandStr;

  try {
    const result = getResult(userHand, enemyHand);
    await i.reply(`相手：${getEmoji(enemyHand)}\n${result}`);
  } catch (_) {
    await i.reply({
      content: "エラーが発生しました",
      flags: MessageFlags.Ephemeral,
    });
  }
};

const getEmoji = (hand: Hand): string => {
  const emojiMap: Record<Hand, string> = {
    g: "✊",
    c: "✌️",
    p: "✋",
  };
  return emojiMap[hand];
};
