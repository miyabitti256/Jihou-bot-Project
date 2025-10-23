import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";
import { splitMessage, splitStreamingMessage } from "@lib/utils";
import { ChatRole } from "@prisma/client";
import {
  archiveChatThread,
  ChatServiceError,
  createChatMessage,
  generateThreadResponseStream,
} from "@services/chat/chat";
import type { Message, TextChannel } from "discord.js";
import { EmbedBuilder, ThreadChannel as ThreadChannelClass } from "discord.js";
import rateLimitManager from "./rate-limit";

/**
 * メッセージが分割された場合、後続のメッセージを送信する
 * @param channel メッセージを送信するチャンネル
 * @param chunks メッセージチャンク配列（最初のチャンクは除く）
 * @param useEmbed 埋め込みメッセージを使用するかどうか
 * @param embedOptions 埋め込みメッセージのオプション
 */
async function sendRemainingChunks(
  channel: TextChannel,
  chunks: string[],
  useEmbed = false,
  embedOptions?: {
    color?: number;
    authorName?: string;
    authorIconURL?: string;
  },
): Promise<void> {
  if (!chunks || chunks.length === 0) return;

  logger.debug(
    `[sendRemainingChunks] Sending ${chunks.length} remaining chunks`,
  );

  for (const chunk of chunks) {
    try {
      if (useEmbed && embedOptions) {
        const newEmbed = new EmbedBuilder()
          .setDescription(chunk)
          .setColor(embedOptions.color || 0x000000);

        if (embedOptions.authorName) {
          newEmbed.setAuthor({
            name: embedOptions.authorName,
            iconURL: embedOptions.authorIconURL,
          });
        }

        await channel.send({ embeds: [newEmbed] });
      } else {
        await channel.send(chunk);
      }
    } catch (error) {
      logger.error(`[sendRemainingChunks] Error sending chunk: ${error}`);
    }
  }
}

/**
 * ストリーミングレスポンスのチャンクからテキストを収集する
 * @param stream Geminiからのストリーミングレスポンス
 * @param onChunk チャンク処理コールバック
 */
export async function processStreamFromGemini(
  stream: Awaited<ReturnType<typeof generateThreadResponseStream>>["stream"],
  onChunk?: (text: string) => void,
): Promise<string> {
  let fullText = "";

  try {
    for await (const chunk of stream) {
      if (chunk?.text) {
        fullText += chunk.text;
        if (onChunk) {
          onChunk(chunk.text);
        }
      }
    }
    return fullText;
  } catch (error) {
    logger.error(`[processStreamFromGemini] Error processing stream: ${error}`);
    throw error;
  }
}

/**
 * Discord上のメッセージが作成されたときに呼び出す処理
 * @param message Discordメッセージオブジェクト
 */
export async function handleMessageCreate(message: Message): Promise<void> {
  // botのメッセージは無視
  if (message.author.bot) return;

  // スレッド内のメッセージのみ処理
  if (!(message.channel instanceof ThreadChannelClass)) return;

  // スレッドの情報を取得
  const thread = message.channel as ThreadChannelClass;
  const channelId = thread.id;

  // データベースでAIチャットスレッドかどうかを確認
  try {
    const chatThread = await prisma.chatThread.findUnique({
      where: { id: thread.id },
      include: { messages: true },
    });

    // AIチャットスレッドでない場合は無視
    if (!chatThread) return;

    // アーカイブコマンドの処理
    if (
      message.content.toLowerCase() === "/archive" ||
      message.content.toLowerCase() === "/close"
    ) {
      if (!chatThread.isActive) {
        await message.reply("このスレッドは既にアーカイブされています。");
        return;
      }

      try {
        // サービス層のメソッドを使用してスレッドをアーカイブ
        await archiveChatThread(thread.id);

        await message.reply(
          "このスレッドはアーカイブされました。新しいメッセージは送信できません。",
        );

        // スレッドを閉じる（Discord上でアーカイブする）
        try {
          await thread.setArchived(true);
        } catch (archiveError) {
          logger.error(
            `[messageCreate] Error archiving Discord thread: ${archiveError}`,
          );
        }
        return;
      } catch (error) {
        logger.error(`[messageCreate] Error archiving thread: ${error}`);
        let errorMessage = "スレッドのアーカイブ中にエラーが発生しました。";

        if (error instanceof ChatServiceError) {
          errorMessage = `スレッドのアーカイブに失敗しました: ${error.message}`;
        }

        await message.reply(errorMessage);
        return;
      }
    }

    // アーカイブされたスレッドでのメッセージ送信を防止
    if (!chatThread.isActive) {
      await message.reply(
        "このスレッドはアーカイブされています。新しいメッセージは送信できません。",
      );
      return;
    }

    // レート制限のチェック
    if (rateLimitManager.isRateLimited(channelId, "messageCreate")) {
      return;
    }

    // すでにボットが処理中の可能性があるので最近のメッセージをチェック
    const recentMessages = await thread.messages.fetch({ limit: 3 });
    const processingMessage = recentMessages.find(
      (msg) => msg.author.bot && msg.content === "AIが考え中...",
    );

    // 既に「考え中...」メッセージがある場合は処理しない
    if (processingMessage) return;

    // レート制限カウンターを更新
    rateLimitManager.updateRateLimit(channelId);

    // 「AIが考え中...」メッセージを送信
    const responseEmbed = new EmbedBuilder()
      .setAuthor({
        name: "AI",
        iconURL: message.client.user?.displayAvatarURL(),
      })
      .setDescription("考え中...")
      .setColor(0x7289da);

    const aiMessage = await thread.send({ embeds: [responseEmbed] });

    try {
      // サービス層のメソッドを使用してレスポンスを生成
      const response = await generateThreadResponseStream(
        chatThread.id,
        message.content,
      );

      let responseText = "";

      // ストリーミングレスポンスを処理し、レスポンステキストを収集
      const finalEmbed = new EmbedBuilder()
        .setAuthor({
          name: "AI",
          iconURL: message.client.user?.displayAvatarURL(),
        })
        .setColor(0x7289da);

      // 応答を逐次処理
      responseText = await processStreamFromGemini(
        response.stream,
        async (chunkText) => {
          // 十分なテキストが集まったら更新
          const currentText = responseText + chunkText;
          const { text } = splitStreamingMessage(currentText, true);

          finalEmbed.setDescription(text);
          try {
            await aiMessage.edit({ embeds: [finalEmbed] });
          } catch (editError) {
            logger.error(
              `[messageCreate] Error updating message: ${editError}`,
            );
          }
        },
      );

      // 最終的なレスポンスをデータベースに保存
      await createChatMessage(chatThread.id, responseText, ChatRole.ASSISTANT);

      // 最終的なレスポンスで更新（長文の場合は分割）
      const { chunks, wasChunked } = splitMessage(responseText, true);

      if (chunks.length > 0) {
        finalEmbed.setDescription(chunks[0]);
        await aiMessage.edit({ embeds: [finalEmbed] });

        // 残りのメッセージを別途送信（2つ目以降）
        if (wasChunked && chunks.length > 1) {
          const textChannel = thread as unknown as TextChannel;
          const remainingChunks = chunks.slice(1);

          await sendRemainingChunks(textChannel, remainingChunks, true, {
            color: 0x7289da,
            authorName: "AI",
            authorIconURL: message.client.user?.displayAvatarURL(),
          });
        }
      }
    } catch (error) {
      logger.error(`[messageCreate] Error generating response: ${error}`);

      let errorMessage = "AIレスポンス生成中にエラーが発生しました。";
      if (error instanceof ChatServiceError) {
        errorMessage = `エラーが発生しました: ${error.message}`;
      }

      const errorEmbed = new EmbedBuilder()
        .setAuthor({
          name: "AI",
          iconURL: message.client.user?.displayAvatarURL(),
        })
        .setDescription(errorMessage)
        .setColor(0xff0000);

      await aiMessage.edit({ embeds: [errorEmbed] });
    }
  } catch (error) {
    logger.error(`[messageCreate] Error processing message: ${error}`);
  }
}

// エクスポートするオブジェクト
export default {
  handleMessageCreate,
  processStreamFromGemini,
};
