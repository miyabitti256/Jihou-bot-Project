import { generateText } from "@/lib/gemini-client";
import { logger } from "@/lib/logger";
import { OmikujiError, drawOmikuji } from "@services/minigame/omikuji";
import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
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

    if (withAIText) {
      try {
        // 運勢に応じたプロンプトを作成
        const prompt = createFortunePrompt(fortune, interaction.user.username);

        // AIでテキスト生成
        const aiText = await generateText(prompt);

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

    if (error instanceof OmikujiError) {
      if (error.message === "USER_NOT_FOUND") {
        errorMessage = "ユーザーデータが見つかりません。";
      } else if (error.message === "ALREADY_DRAWN") {
        errorMessage = "おみくじは一日に一度しか引けません";
      }
    }

    await interaction.editReply(errorMessage);
  }
}

/**
 * 運勢に応じたAIへのプロンプトを作成する
 */
function createFortunePrompt(fortune: string, username: string): string {
  return `あなたは神社の占い師です。ユーザー「${username}」さんがおみくじを引いたところ「${fortune}」という結果が出ました。
以下の厳密なフォーマットに従って、関西弁で楽しく前向きなおみくじ結果を生成してください。

===フォーマット===
【今日の運勢】${fortune}
【アドバイス】
(ここに2～3行の関西弁での前向きなアドバイスを書いてください)

【運気】
・総合運：(★1～5つで表現)
・金運：(★1～5つで表現)
・恋愛運：(★1～5つで表現)
・健康運：(★1～5つで表現)

【ラッキーアイテム】
(1つだけ具体的なアイテムを書いてください)

【ひとこと】
(ここに関西弁で一言メッセージを書いてください。絵文字を1～2個使用)
=============

※ 必ず上記フォーマットを守ってください。各セクションの間に余計な行を入れないでください。
※ ===フォーマット=== と ============= は入れないでください。
※ 必ず関西弁で書いてください。例:「〜です」→「〜やで」「〜だよ」→「〜やで」「〜ですね」→「〜やな」など
※ 「${fortune}」という運勢に合った内容にしてください。
※ 全体で200～300文字程度に収めてください。`;
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
