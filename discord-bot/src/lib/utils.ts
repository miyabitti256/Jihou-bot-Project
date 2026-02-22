import type { ChatRole } from "@generated/prisma/client/client.ts";
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
 * コードブロックの状態を追跡するヘルパー関数
 * 文字列内のコードブロックの開始と終了をすべて検出し、最終的な状態を返す
 */
export function getCodeBlockState(text: string): {
  isInCodeBlock: boolean;
  codeBlockType: string | null;
} {
  const codeBlockMatches = text.match(/```[\w]*/g) || [];
  let isInCodeBlock = false;
  let codeBlockType: string | null = null;

  for (const match of codeBlockMatches) {
    if (isInCodeBlock) {
      // コードブロック終了
      isInCodeBlock = false;
      codeBlockType = null;
    } else {
      // コードブロック開始
      isInCodeBlock = true;
      // "```" より後の部分がコードブロックのタイプ（言語）
      codeBlockType = match.length > 3 ? match.substring(3) : "";
    }
  }

  return { isInCodeBlock, codeBlockType };
}

/**
 * 指定された長さに文字列を切り詰める
 * コードブロックなどの特殊ブロックが開いている場合は適切に閉じる
 */
export function truncateTextToLength(
  text: string,
  maxLength: number,
): {
  text: string;
  wasTruncated: boolean;
  codeBlockState: { isInCodeBlock: boolean; codeBlockType: string | null };
} {
  if (text.length <= maxLength) {
    return {
      text,
      wasTruncated: false,
      codeBlockState: getCodeBlockState(text),
    };
  }

  // 最大長に切り詰める
  const truncatedText = text.substring(0, maxLength);

  // 切り詰めた後のコードブロック状態を確認
  const codeBlockState = getCodeBlockState(truncatedText);

  // コードブロックが開いたままなら閉じる
  let finalText = truncatedText;
  if (codeBlockState.isInCodeBlock) {
    finalText += "\n```";
  }

  return {
    text: finalText,
    wasTruncated: true,
    codeBlockState,
  };
}

/**
 * 安全なストリーミングレスポンス用のメッセージ分割
 * 途中のメッセージでもコードブロックが適切に閉じられていることを保証し、
 * 最大長を超えないように調整します
 */
export function splitStreamingMessage(
  content: string,
  isEmbed = false,
): {
  text: string;
  codeBlockState: { isInCodeBlock: boolean; codeBlockType: string | null };
} {
  const MAX_LENGTH = isEmbed ? 4096 : 2000;

  // 切り詰めと適切なブロック終了処理
  const { text, codeBlockState } = truncateTextToLength(content, MAX_LENGTH);

  return { text, codeBlockState };
}

/**
 * 長いメッセージを複数のチャンクに分割します。
 * シンプルに文字数ベースで分割し、コードブロックなどの特殊ブロックが
 * 分割された場合は適切に閉じて次のチャンクで再開します。
 */
export function splitMessage(
  content: string,
  isEmbed = false,
): {
  chunks: string[];
  wasChunked: boolean;
} {
  const MAX_LENGTH = isEmbed ? 4000 : 1900; // 少し余裕を持たせる

  // コンテンツが空の場合は空の配列を返す
  if (!content) return { chunks: [], wasChunked: false };

  // 最大長以下の場合は分割不要
  if (content.length <= MAX_LENGTH) {
    return { chunks: [content], wasChunked: false };
  }

  const chunks: string[] = [];
  let isInCodeBlock = false;
  let codeBlockType: string | null = null;
  let currentPos = 0;

  // 本文を最大長ごとにチャンクに分割
  while (currentPos < content.length) {
    // 現在のチャンクを取得
    const chunkEnd = Math.min(currentPos + MAX_LENGTH, content.length);
    let chunk = content.substring(currentPos, chunkEnd);

    // 現在のチャンクのコードブロック状態を取得
    const chunkState = getCodeBlockState(chunk);

    // 前のチャンクからコードブロックが継続している場合
    if (isInCodeBlock && !chunks.length) {
      // 最初のチャンクでかつコードブロック内なら、コードブロック開始を追加
      chunk = `\`\`\`${codeBlockType || ""}\n${chunk}`;
    }

    // 次のチャンクへ引き継ぐ状態を更新
    if (chunkState.isInCodeBlock) {
      // コードブロックが開いたままで終わる場合は閉じる
      chunk += "\n```";
      isInCodeBlock = true;
      codeBlockType = chunkState.codeBlockType;
    } else {
      isInCodeBlock = false;
      codeBlockType = null;
    }

    // チャンクを追加
    chunks.push(chunk);
    currentPos = chunkEnd;
  }

  return { chunks, wasChunked: chunks.length > 1 };
}
