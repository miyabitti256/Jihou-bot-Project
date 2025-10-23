import {
  generateChatText,
  generateChatTextStream,
  generateTextStream,
  SYSTEM_PROMPT,
} from "@lib/gemini-client";
import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";
import { estimateTokenCount } from "@lib/utils";
import type { ChatMessage, ChatThread } from "@prisma/client";
import { ChatRole } from "@prisma/client";

// エラークラス
export class ChatServiceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ChatServiceError";
    this.code = code;
  }
}

// メッセージの型定義
export interface ChatMessageData {
  role: ChatRole;
  content: string;
  tokenCount?: number;
  createdAt?: Date;
}

// スレッド作成データの型定義
export interface ChatThreadCreateData {
  channelId: string;
  guildId?: string;
  creatorId: string;
  title?: string;
}

/**
 * チャットスレッドを作成する
 */
export async function createChatThread(
  data: ChatThreadCreateData,
): Promise<ChatThread> {
  try {
    const { channelId, guildId, creatorId, title = "新しい会話" } = data;

    if (!channelId || !creatorId) {
      throw new ChatServiceError(
        "MISSING_REQUIRED_FIELDS",
        "必須フィールドが不足しています",
      );
    }

    // DMチャンネルの場合はguildIdが空の場合があるので特殊値を設定
    const finalGuildId = guildId || "DM_CHANNEL";

    logger.info(
      `[chat] Creating thread in database: channelId=${channelId}, guildId=${finalGuildId}, creatorId=${creatorId}`,
    );

    return await prisma.chatThread.create({
      data: {
        id: channelId,
        guildId: finalGuildId,
        channelId,
        creatorId,
        title,
      },
    });
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }
    logger.error(`[chat] Error creating thread: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "スレッド作成中にエラーが発生しました",
    );
  }
}

/**
 * チャットスレッドを取得する
 */
export async function getChatThread(
  threadId: string,
): Promise<ChatThread & { messages: ChatMessage[] }> {
  try {
    const thread = await prisma.chatThread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!thread) {
      throw new ChatServiceError(
        "THREAD_NOT_FOUND",
        "指定されたスレッドが見つかりません",
      );
    }

    return thread;
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }
    logger.error(`[chat] Error fetching thread: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "スレッド取得中にエラーが発生しました",
    );
  }
}

/**
 * チャットスレッドをアーカイブする
 */
export async function archiveChatThread(threadId: string): Promise<void> {
  try {
    const thread = await prisma.chatThread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      throw new ChatServiceError(
        "THREAD_NOT_FOUND",
        "指定されたスレッドが見つかりません",
      );
    }

    if (!thread.isActive) {
      throw new ChatServiceError(
        "THREAD_ARCHIVED",
        "このスレッドは既にアーカイブされています",
      );
    }

    await prisma.chatThread.update({
      where: {
        id: threadId,
      },
      data: {
        isActive: false,
      },
    });
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }
    logger.error(`[chat] Error archiving thread: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "スレッドのアーカイブ中にエラーが発生しました",
    );
  }
}

/**
 * チャットメッセージを作成する
 */
export async function createChatMessage(
  threadId: string,
  content: string,
  role: ChatRole,
): Promise<ChatMessage> {
  try {
    const tokenCount = estimateTokenCount(content);
    return await prisma.chatMessage.create({
      data: {
        threadId,
        content,
        role,
        tokenCount,
      },
    });
  } catch (error) {
    logger.error(`[chat] Error creating message: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "メッセージの作成中にエラーが発生しました",
    );
  }
}

/**
 * スレッドなしの単発テキスト生成（ストリーミングなし）
 */
export async function generateSingleResponse(content: string): Promise<string> {
  try {
    return (
      (await generateChatText([
        {
          role: ChatRole.USER,
          content,
        },
      ])) || ""
    );
  } catch (error) {
    logger.error(`[chat] Error generating single response: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "テキスト生成中にエラーが発生しました",
    );
  }
}

/**
 * スレッドなしの単発テキスト生成のストリーミングオブジェクトを取得
 */
export async function generateSingleResponseStream(content: string) {
  try {
    return await generateTextStream(`${SYSTEM_PROMPT}\n\nユーザー: ${content}`);
  } catch (error) {
    logger.error(`[chat] Error generating single response stream: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "テキスト生成中にエラーが発生しました",
    );
  }
}

/**
 * スレッドありのチャットテキスト生成
 */
export async function generateThreadResponse(
  threadId: string,
  content: string,
): Promise<{
  userMessage: ChatMessage;
  aiResponse: string;
  aiMessage: ChatMessage;
}> {
  try {
    // スレッドの存在確認と取得
    const thread = await getChatThread(threadId);

    if (!thread.isActive) {
      throw new ChatServiceError(
        "THREAD_ARCHIVED",
        "このスレッドはアーカイブされています",
      );
    }

    // ユーザーメッセージを保存
    const userMessage = await createChatMessage(
      threadId,
      content,
      ChatRole.USER,
    );

    // チャット履歴を準備
    let messages: Array<{ role: ChatRole; content: string }> = [];

    if (thread.messages.length === 0) {
      messages = [
        {
          role: ChatRole.USER,
          content,
        },
      ];
    } else {
      messages = thread.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 最新のユーザーメッセージを追加
      messages.push({
        role: ChatRole.USER,
        content,
      });
    }

    // AIの応答を生成
    const aiResponse = (await generateChatText(messages)) || "";

    // AIの応答をDBに保存
    const aiMessage = await createChatMessage(
      threadId,
      aiResponse,
      ChatRole.ASSISTANT,
    );

    return { userMessage, aiResponse, aiMessage };
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }
    logger.error(`[chat] Error generating thread response: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "テキスト生成中にエラーが発生しました",
    );
  }
}

/**
 * スレッドありのチャットテキスト生成のストリーミングオブジェクトを取得
 */
export async function generateThreadResponseStream(
  threadId: string,
  content: string,
): Promise<{
  userMessage: ChatMessage;
  stream: Awaited<ReturnType<typeof generateChatTextStream>>;
  messages: Array<{ role: ChatRole; content: string }>;
}> {
  try {
    // スレッドの存在確認と取得
    const thread = await getChatThread(threadId);

    if (!thread.isActive) {
      throw new ChatServiceError(
        "THREAD_ARCHIVED",
        "このスレッドはアーカイブされています",
      );
    }

    // ユーザーメッセージを保存
    const userMessage = await createChatMessage(
      threadId,
      content,
      ChatRole.USER,
    );

    // チャット履歴を準備
    let messages: Array<{ role: ChatRole; content: string }> = [];

    if (thread.messages.length === 0) {
      messages = [
        {
          role: ChatRole.USER,
          content,
        },
      ];
    } else {
      messages = thread.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // 最新のユーザーメッセージを追加
      messages.push({
        role: ChatRole.USER,
        content,
      });
    }

    // ストリーミングオブジェクトを取得
    const stream = await generateChatTextStream(messages);

    return { userMessage, stream, messages };
  } catch (error) {
    if (error instanceof ChatServiceError) {
      throw error;
    }
    logger.error(`[chat] Error generating thread response stream: ${error}`);
    throw new ChatServiceError(
      "INTERNAL_SERVER_ERROR",
      "テキスト生成中にエラーが発生しました",
    );
  }
}
