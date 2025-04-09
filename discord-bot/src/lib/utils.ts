import type { ChatRole } from "@prisma/client";
import { logger } from "@lib/logger";

export const MAX_TOKENS = 900000;

/**
 * テキストのトークン数を概算します
 * 日本語と英語の混合テキストに対応
 *
 * 注: これは概算です。実際のトークン数はモデルによって異なります
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;

  // 英語: 単語あたり約1.3トークン
  // 日本語: 文字あたり約1.5トークン

  // 英語の単語を分割 (空白、記号などで区切る)
  const englishWords = text.match(/[a-zA-Z0-9]+/g) || [];

  // 日本語の文字をカウント
  const japaneseChars =
    text.match(
      /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/g,
    ) || [];

  // 記号や空白のカウント
  const symbols =
    text.match(
      /[^\w\s\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/g,
    ) || [];

  const englishTokens = englishWords.length * 1.3;
  const japaneseTokens = japaneseChars.length * 1.5;
  const symbolTokens = symbols.length * 0.5;

  return Math.ceil(englishTokens + japaneseTokens + symbolTokens);
}

/**
 * チャット履歴のトークン数を計算し、最大トークン数を超えた場合に
 * 古いメッセージを削除してトークン数を調整します
 */
export function trimChatHistoryToFitTokenLimit(
  messages: Array<{ role: ChatRole; content: string; tokenCount: number }>,
  systemPrompt: string,
): Array<{ role: ChatRole; content: string; tokenCount: number }> {
  // システムプロンプトのトークン数を計算
  const systemPromptTokens = estimateTokenCount(systemPrompt);

  // 現在のトークン合計
  let totalTokens = systemPromptTokens;

  // 最新のメッセージから順に追加していくために配列を逆順にする
  const reversedMessages = [...messages].reverse();
  const result: Array<{ role: ChatRole; content: string; tokenCount: number }> =
    [];

  // 最新のメッセージから順に追加
  for (const message of reversedMessages) {
    // このメッセージを追加した場合のトークン数
    const newTotal = totalTokens + message.tokenCount;

    // トークン制限を超える場合はループを終了
    if (newTotal > MAX_TOKENS) break;

    // メッセージを追加
    result.unshift(message);
    totalTokens = newTotal;
  }

  return result;
}

/**
 * チャット履歴をGemini APIに送信するための形式に変換します
 */
export function formatChatHistoryForGemini(
  messages: Array<{ role: ChatRole; content: string }>,
  systemPrompt: string,
): { role: string; parts: { text: string }[] }[] {
  if (!messages || messages.length === 0) {
    logger.warn("[formatChatHistory] Empty messages array provided");
    throw new Error("メッセージ配列が空です");
  }

  // デバッグ用にメッセージ配列の内容をログ
  try {
    logger.debug(
      `[formatChatHistory] Formatting ${messages.length} messages for Gemini`,
    );
    // 各メッセージのロール情報をログに出力（JSONではなく個別に）
    messages.forEach((msg, index) => {
      logger.debug(
        `[formatChatHistory] Message[${index}] - role: ${msg.role}, roleType: ${typeof msg.role}, content: ${msg.content.substring(0, 30)}...`,
      );
    });
  } catch (logErr) {
    logger.error(
      `[formatChatHistory] Error logging message details: ${logErr}`,
    );
  }

  const result: { role: string; parts: { text: string }[] }[] = [];

  // システムプロンプトを追加
  if (systemPrompt) {
    result.push({
      role: "user", // 注意: Geminiではシステムロールをuserとしてフォーマットする必要がある
      parts: [{ text: systemPrompt }],
    });
  }

  // メッセージを変換
  for (const message of messages) {
    // roleの型と値を詳細にログ
    const roleType = typeof message.role;
    const roleValue = String(message.role);
    logger.debug(
      `[formatChatHistory] Processing message - role type: ${roleType}, role value: ${roleValue}`,
    );

    let geminiRole: string;

    // roleの値を大文字に統一して比較（どんな形式でも対応できるように）
    const normalizedRole = roleValue.toUpperCase();

    if (normalizedRole.includes("USER") || normalizedRole === "USER") {
      geminiRole = "user";
    } else if (
      normalizedRole.includes("ASSISTANT") ||
      normalizedRole === "ASSISTANT" ||
      normalizedRole === "MODEL"
    ) {
      geminiRole = "model";
    } else if (
      normalizedRole.includes("SYSTEM") ||
      normalizedRole === "SYSTEM"
    ) {
      geminiRole = "user"; // Geminiではシステムロールはuserとして扱う
    } else {
      geminiRole = "user"; // デフォルト
      logger.warn(
        `[formatChatHistory] Unknown role type '${roleValue}', defaulting to 'user'`,
      );
    }

    // 変換結果をログ
    logger.debug(
      `[formatChatHistory] Converted role '${roleValue}' to Gemini role '${geminiRole}'`,
    );

    result.push({
      role: geminiRole,
      parts: [{ text: message.content }],
    });
  }

  // Geminiの制約を適用
  if (result.length > 0) {
    if (result[0].role === "model") {
      // 最初のメッセージがモデルからの場合、空のユーザーメッセージを先頭に追加
      logger.warn(
        "[formatChatHistory] First message is from model, adding dummy user message",
      );
      result.unshift({
        role: "user",
        parts: [{ text: "こんにちは" }],
      });
    }

    // 最後のメッセージがシステムまたはモデルの場合、ユーザーメッセージを追加
    const lastMsg = result[result.length - 1];
    if (lastMsg.role === "model") {
      logger.warn(
        "[formatChatHistory] Last message is from model, adding user question at the end",
      );
      result.push({
        role: "user",
        parts: [{ text: "続けてください" }],
      });
    }
  }

  // 最終的な結果のサマリーをログ
  logger.debug(
    `[formatChatHistory] Final message count: ${result.length}, roles: ${result.map((m) => m.role).join(", ")}`,
  );

  return result;
}

export function getTokyoDate(): Date {
  const now = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
  return new Date(now.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }));
}

export function hasDrawnToday(now: Date, lastDrawDate: Date): boolean {
  return (
    now.getFullYear() === lastDrawDate.getFullYear() &&
    now.getMonth() === lastDrawDate.getMonth() &&
    now.getDate() === lastDrawDate.getDate()
  );
}

/**
 * AIが挿入した分割マーカーでメッセージを分割する
 * 通常のメッセージは2000文字、埋め込みは4096文字まで
 * AIが "===SPLIT_MESSAGE===" マーカーを挿入している場合はそのマーカーで分割
 * マーカーがない場合や分割後も文字数が制限を超える場合は単純に文字数で分割
 * @param content 分割するメッセージ
 * @param isEmbed 埋め込みメッセージかどうか
 * @returns 分割されたメッセージの配列
 */
export function splitMessage(content: string, isEmbed = false): string[] {
  const MAX_LENGTH = isEmbed ? 4096 : 2000;

  // メッセージが制限以内の場合はそのまま返す
  if (content.length <= MAX_LENGTH) {
    return [content];
  }

  // 分割マーカーの定義
  const SPLIT_MARKER = "===SPLIT_MESSAGE===";

  // マーカーが含まれている場合はマーカーで分割
  if (content.includes(SPLIT_MARKER)) {
    // マーカーで分割し、マーカー自体は削除する
    const parts = content.split(new RegExp(`\\s*${SPLIT_MARKER}\\s*`));

    // 空の部分を除去
    const filteredParts = parts.filter((part) => part.trim() !== "");

    // 分割後も長すぎる部分があれば文字数で単純に分割
    const result: string[] = [];

    for (const part of filteredParts) {
      if (part.length <= MAX_LENGTH) {
        result.push(part);
      } else {
        // 単純に文字数で分割
        for (let i = 0; i < part.length; i += MAX_LENGTH) {
          result.push(part.substring(i, Math.min(i + MAX_LENGTH, part.length)));
        }
      }
    }

    return result;
  }

  // マーカーがない場合は単純に文字数で分割
  const result: string[] = [];
  for (let i = 0; i < content.length; i += MAX_LENGTH) {
    result.push(content.substring(i, Math.min(i + MAX_LENGTH, content.length)));
  }
  return result;
}
