import { GoogleGenAI } from "@google/genai";
import { logger } from "@lib/logger";
import type { ChatRole } from "@prisma/client";
import { formatChatHistoryForGemini } from "./utils";

const CONSTANTS = {
  MODEL_NAME: "gemini-2.0-flash",
  SYSTEM_PROMPT: `
あなたは「時報G-Bot」という名前の陽気で親しみやすいAIアシスタントDiscordBotです。
以下の性格と特徴を持っています：

1. 関西弁調の語尾（〜やで！〜ねん！〜なぁ！など）を使って話します
2. 明るく陽気で、気さくな関西人キャラクターとして振る舞います
3. ユーモアたっぷりの会話を心がけます
4. 時間に関する楽しい豆知識を提供します
5. ユーザーの一日を楽しくするために、ポジティブな言葉をかけます
6. 時間に関する質問には、関西弁調で楽しい例え話を交えて答えます

会話の例：
ユーザー: こんにちは
ボット: おっす！時報ボットやで！今日も素晴らしい一日になるよう、時間を有効に使おうな！

ユーザー: 時間について教えて
ボット: ほな教えたるわ！時間いうんは流れる川みたいなもんやねん。止まらへんし、ずっと進み続けるけど、その流れを楽しむのが大事やで！

ユーザー: 忙しいです
ボット: 忙しいんやったら、ちょっとした休憩も大事やで！時間は有限やけど、笑顔は無限やねん！がんばりすぎたらあかんで！

また、回答は上記の例に加え、以下のものを心がけてください
1. 4000字以内に回答することを心がけてください
2. 基本的に全て日本語で回答してください
3. 誤解を招く可能性のある情報や不確かな情報については、その旨を明示してください
4. 関西弁調は自然に使い、わざとらしくならないようにしてください
`,
} as const;

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const SYSTEM_PROMPT = CONSTANTS.SYSTEM_PROMPT;

/**
 * 単発のテキスト生成を行う
 * @param prompt 生成のためのプロンプト
 * @returns 生成されたテキスト
 */
export async function generateText(prompt: string): Promise<string> {
  const model = gemini.models;
  const response = await model.generateContent({
    model: CONSTANTS.MODEL_NAME,
    contents: [{ text: prompt }],
  });

  return response.text || "";
}

/**
 * 単発のストリーミング生成を行う
 * @param prompt 生成のためのプロンプト
 * @returns ストリーミングレスポンス
 */
export async function generateTextStream(prompt: string) {
  const model = gemini.models;
  return await model.generateContentStream({
    model: CONSTANTS.MODEL_NAME,
    contents: [{ text: prompt }],
  });
}

/**
 * チャット履歴を使用したテキスト生成を行う
 * @param messages チャットメッセージの配列
 * @param systemPrompt システムプロンプト（省略時はデフォルト値を使用）
 * @returns 生成されたテキスト
 */
export async function generateChatText(
  messages: Array<{ role: ChatRole; content: string }>,
  systemPrompt: string = SYSTEM_PROMPT,
): Promise<string> {
  try {
    // 配列が有効であることを確認（空かどうかのチェックはしない）
    if (!messages) {
      logger.error(
        "[gemini] Invalid messages array (null/undefined) provided to generateChatText",
      );
      throw new Error("メッセージ配列が無効です");
    }

    // メッセージ数をログに出力
    logger.debug(
      `[gemini] generateChatText called with ${messages.length} message(s).`,
    );

    const formattedMessages = formatChatHistoryForGemini(
      messages,
      systemPrompt,
    );

    // フォーマット後のメッセージをログに出力
    logger.debug(
      `[gemini] Formatted to ${formattedMessages.length} message(s) for Gemini API.`,
    );

    // フォーマット後のメッセージが空または無効な場合に対応
    if (!formattedMessages || formattedMessages.length === 0) {
      logger.error(
        "[gemini] Formatted messages array is empty after formatting",
      );
      throw new Error("フォーマット後のメッセージ配列が空です");
    }

    // 最小限の有効なリクエストを確保
    if (
      formattedMessages.length === 1 &&
      formattedMessages[0].role === "system"
    ) {
      logger.error("[gemini] Only system prompt present without user messages");
      throw new Error(
        "システムプロンプトのみで、ユーザーメッセージがありません",
      );
    }

    const model = gemini.models;
    try {
      const response = await model.generateContent({
        model: CONSTANTS.MODEL_NAME,
        contents: formattedMessages,
      });

      return response.text || "";
    } catch (apiError) {
      logger.error(`[gemini] API error in generateContent: ${apiError}`);
      // リクエストの詳細をログに記録して診断を容易にする
      logger.debug(
        `[gemini] Request details: model=${CONSTANTS.MODEL_NAME}, messages=${JSON.stringify(formattedMessages)}`,
      );
      throw apiError;
    }
  } catch (error) {
    logger.error(`[gemini] Error in generateChatText: ${error}`);
    throw error;
  }
}

/**
 * チャット履歴を使用したストリーミング生成を行う
 * @param messages チャットメッセージの配列
 * @param systemPrompt システムプロンプト（省略時はデフォルト値を使用）
 * @returns ストリーミングレスポンス
 */
export async function generateChatTextStream(
  messages: Array<{ role: ChatRole; content: string }>,
  systemPrompt: string = SYSTEM_PROMPT,
) {
  try {
    // 配列が有効であることを確認（空かどうかのチェックはしない）
    if (!messages) {
      logger.error(
        "[gemini] Invalid messages array (null/undefined) provided to generateChatTextStream",
      );
      throw new Error("メッセージ配列が無効です");
    }

    // メッセージと最初と最後のメッセージをログに記録
    const msgCount = messages.length;
    logger.debug(
      `[gemini] generateChatTextStream called with ${msgCount} message(s).`,
    );

    if (msgCount > 0) {
      const firstMsg = messages[0];
      const lastMsg = messages[msgCount - 1];

      logger.debug(
        `[gemini] First message - Role: ${firstMsg.role}, Content: ${firstMsg.content.substring(0, 50)}${firstMsg.content.length > 50 ? "..." : ""}`,
      );
      logger.debug(
        `[gemini] Last message - Role: ${lastMsg.role}, Content: ${lastMsg.content.substring(0, 50)}${lastMsg.content.length > 50 ? "..." : ""}`,
      );
    }

    const formattedMessages = formatChatHistoryForGemini(
      messages,
      systemPrompt,
    );
    logger.debug(
      `[gemini] Formatted to ${formattedMessages.length} message(s) for Gemini API.`,
    );

    // フォーマット後のメッセージが空または無効な場合に対応
    if (!formattedMessages || formattedMessages.length === 0) {
      logger.error(
        "[gemini] Formatted messages array is empty after formatting",
      );
      throw new Error("フォーマット後のメッセージ配列が空です");
    }

    // 最小限の有効なリクエストを確保
    if (
      formattedMessages.length === 1 &&
      formattedMessages[0].role === "system"
    ) {
      logger.error("[gemini] Only system prompt present without user messages");
      throw new Error(
        "システムプロンプトのみで、ユーザーメッセージがありません",
      );
    }

    const model = gemini.models;
    try {
      // コード実行を含むストリーミングレスポンスを取得
      const response = await model.generateContentStream({
        model: CONSTANTS.MODEL_NAME,
        contents: formattedMessages,
      });

      // ストリーム処理を行い、コード実行部分をフィルタリングまたは処理するラッパーを返す
      return {
        [Symbol.asyncIterator]() {
          return {
            async next() {
              try {
                const result = await response.next();

                if (result.done) {
                  return { done: true, value: undefined };
                }

                const chunk = result.value;

                // チャンクに適切なテキストがない場合はスキップして次へ
                if (chunk?.candidates?.[0]?.content?.parts?.[0]) {
                  // テキスト部分を抽出
                  const part = chunk.candidates[0].content.parts[0];

                  // executableCodeやcodeExecutionResultがある場合は、結果のみをテキストとして抽出
                  if (part.executableCode) {
                    logger.debug(
                      "[gemini] Found executableCode part, processing...",
                    );
                    // コード実行部分は無視してスキップ
                    return { done: false, value: { text: "" } };
                  }

                  if (part.codeExecutionResult) {
                    logger.debug(
                      "[gemini] Found codeExecutionResult part, extracting output...",
                    );
                    // 実行結果を取得
                    return {
                      done: false,
                      value: {
                        text: part.codeExecutionResult.output || "",
                      },
                    };
                  }

                  if (part.text) {
                    // 通常のテキスト
                    return { done: false, value: { text: part.text } };
                  }
                }

                // テキストが見つからない場合は空文字を返す
                return { done: false, value: { text: "" } };
              } catch (error) {
                logger.error(`[gemini] Error in stream processing: ${error}`);
                throw error;
              }
            },
          };
        },
      };
    } catch (apiError) {
      logger.error(`[gemini] API error in generateContentStream: ${apiError}`);
      // リクエストの詳細をログに記録して診断を容易にする
      logger.debug(
        `[gemini] Request details: model=${CONSTANTS.MODEL_NAME}, messages=${JSON.stringify(formattedMessages)}`,
      );
      throw apiError;
    }
  } catch (error) {
    logger.error(`[gemini] Error in generateChatTextStream: ${error}`);
    // エラーを再スローして呼び出し元で処理できるようにする
    throw error;
  }
}
