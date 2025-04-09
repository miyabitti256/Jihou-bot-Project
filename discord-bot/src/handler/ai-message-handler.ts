import { logger } from "@lib/logger";
import type { Message, MessageEditOptions, TextChannel } from "discord.js";
import { ThreadChannel as ThreadChannelClass, EmbedBuilder } from "discord.js";
import { prisma } from "@lib/prisma";
import rateLimitManager from "../handler/rate-limit-handler";
import { splitMessage } from "@lib/utils";

const CONSTANTS = {
  API_ENDPOINT: "http://localhost:3001/api/chat",
} as const;

// 更新間隔（文字数）
const UPDATE_INTERVAL = 100;

/**
 * ストリーミングレスポンスを処理し、Discordメッセージを更新する
 * @param response ストリーミングレスポンス
 * @param message 更新するDiscordメッセージ
 * @param useEmbed 埋め込みメッセージを使用するかどうか
 * @param embedOptions 埋め込みメッセージのオプション
 */
export async function handleStreamingResponse(
  response: Response,
  message: Message,
  useEmbed = false,
  embedOptions?: {
    embed: EmbedBuilder;
    authorName?: string;
    authorIconURL?: string;
  },
): Promise<void> {
  // レスポンスが正常でない場合のエラーハンドリング
  if (!response.ok) {
    let errorMsg = `APIエラー: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.text();
      logger.error(
        `[handleStreamingResponse] API error response: ${errorBody}`,
      );

      try {
        const errorData = JSON.parse(errorBody);
        if (errorData.error?.message) {
          errorMsg = `APIエラー: ${errorData.error.message}`;
        }
      } catch (parseError) {
        logger.error(
          `[handleStreamingResponse] Error parsing error response: ${parseError}`,
        );
      }
    } catch (textError) {
      logger.error(
        `[handleStreamingResponse] Error reading error response: ${textError}`,
      );
    }

    if (useEmbed && embedOptions) {
      embedOptions.embed.setDescription(errorMsg);
      await message.edit({ embeds: [embedOptions.embed] });
    } else {
      await message.edit(errorMsg);
    }
    return;
  }

  // レスポンスボディが存在しない場合のエラーハンドリング
  if (!response.body) {
    const errorMsg = "レスポンスボディが空です";
    logger.error(`[handleStreamingResponse] ${errorMsg}`);

    if (useEmbed && embedOptions) {
      embedOptions.embed.setDescription(errorMsg);
      await message.edit({ embeds: [embedOptions.embed] });
    } else {
      await message.edit(errorMsg);
    }
    return;
  }

  const reader = response.body.getReader();
  let fullText = "";
  let lastUpdateLength = 0;
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 受信データをデコードし、ログに記録
      const chunk = decoder.decode(value);
      logger.debug(
        `[handleStreamingResponse] Received chunk: ${chunk.substring(0, 100)}${chunk.length > 100 ? "..." : ""}`,
      );

      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.trim().startsWith("data: ")) {
          if (line.includes("data: [DONE]")) {
            continue;
          }

          try {
            const dataText = line.trim().substring(6);
            try {
              const data = JSON.parse(dataText);
              if (data.text) {
                fullText += data.text;
              }
            } catch (e) {
              // パースに失敗した場合はスキップ
              logger.debug(`[handleStreamingResponse] Parse error: ${e}`);
            }
          } catch (e) {
            logger.error(
              `[handleStreamingResponse] Error processing line: ${e}`,
            );
          }
        }
      }

      // 更新間隔に達した場合または最後のチャンクの場合のみ更新
      if (fullText.length - lastUpdateLength >= UPDATE_INTERVAL || done) {
        // メッセージを分割して送信
        const messages = splitMessage(fullText, useEmbed);
        if (messages.length > 0) {
          // 最初のメッセージは既存のメッセージを更新
          if (useEmbed && embedOptions) {
            embedOptions.embed.setDescription(messages[0]);
            if (embedOptions.authorName) {
              embedOptions.embed.setAuthor({
                name: embedOptions.authorName,
                iconURL: embedOptions.authorIconURL,
              });
            }
            await message.edit({ embeds: [embedOptions.embed] });
          } else {
            await message.edit(messages[0]);
          }

          // 残りのメッセージは新しいメッセージとして送信
          const textChannel = message.channel as TextChannel;
          for (let i = 1; i < messages.length; i++) {
            if (useEmbed && embedOptions) {
              const newEmbed = new EmbedBuilder()
                .setDescription(messages[i])
                .setColor(embedOptions.embed.data.color || 0x000000);
              if (embedOptions.authorName) {
                newEmbed.setAuthor({
                  name: embedOptions.authorName,
                  iconURL: embedOptions.authorIconURL,
                });
              }
              await textChannel.send({ embeds: [newEmbed] });
            } else {
              await textChannel.send(messages[i]);
            }
          }
        }
        lastUpdateLength = fullText.length;
      }
    }

    // 最終チェック - 更新されていなければ更新
    if (fullText.length > 0 && fullText.length !== lastUpdateLength) {
      const messages = splitMessage(fullText, useEmbed);
      if (messages.length > 0) {
        if (useEmbed && embedOptions) {
          embedOptions.embed.setDescription(messages[0]);
          if (embedOptions.authorName) {
            embedOptions.embed.setAuthor({
              name: embedOptions.authorName,
              iconURL: embedOptions.authorIconURL,
            });
          }
          await message.edit({ embeds: [embedOptions.embed] });
        } else {
          await message.edit(messages[0]);
        }

        const textChannel = message.channel as TextChannel;
        for (let i = 1; i < messages.length; i++) {
          if (useEmbed && embedOptions) {
            const newEmbed = new EmbedBuilder()
              .setDescription(messages[i])
              .setColor(embedOptions.embed.data.color || 0x000000);
            if (embedOptions.authorName) {
              newEmbed.setAuthor({
                name: embedOptions.authorName,
                iconURL: embedOptions.authorIconURL,
              });
            }
            await textChannel.send({ embeds: [newEmbed] });
          } else {
            await textChannel.send(messages[i]);
          }
        }
      }
    }

    // 空のレスポンスの場合
    if (fullText.length === 0) {
      const noResponseMsg = "レスポンスを生成できませんでした。";
      logger.warn(`[handleStreamingResponse] ${noResponseMsg}`);

      if (useEmbed && embedOptions) {
        embedOptions.embed.setDescription(noResponseMsg);
        await message.edit({ embeds: [embedOptions.embed] });
      } else {
        await message.edit(noResponseMsg);
      }
    }
  } catch (error) {
    const errorMsg = `[handleStreamingResponse] Stream processing error: ${error}`;
    logger.error(errorMsg);

    if (useEmbed && embedOptions) {
      embedOptions.embed.setDescription(
        `ストリーム処理中にエラーが発生しました: ${error}`,
      );
      await message.edit({ embeds: [embedOptions.embed] });
    } else {
      await message.edit(`ストリーム処理中にエラーが発生しました: ${error}`);
    }
  } finally {
    try {
      reader.releaseLock();
    } catch (lockError) {
      logger.error(
        `[handleStreamingResponse] Error releasing reader lock: ${lockError}`,
      );
    }
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
        const response = await fetch(
          `${CONSTANTS.API_ENDPOINT}/threads/${thread.id}/archive`,
          {
            method: "POST",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          await message.reply(
            `スレッドのアーカイブに失敗しました: ${
              errorData.error?.message || "不明なエラー"
            }`,
          );
          return;
        }

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
        await message.reply("スレッドのアーカイブ中にエラーが発生しました。");
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

    // APIにリクエストを送信
    const genResponse = await fetch(`${CONSTANTS.API_ENDPOINT}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: message.content,
        stream: true,
        threadId: chatThread.id,
      }),
    });

    if (!genResponse.ok) {
      const errorData = await genResponse.json();
      const errorEmbed = new EmbedBuilder()
        .setAuthor({
          name: "AI",
          iconURL: message.client.user?.displayAvatarURL(),
        })
        .setDescription(
          `エラーが発生しました: ${errorData.error?.message || "不明なエラー"}`,
        )
        .setColor(0xff0000);

      await aiMessage.edit({ embeds: [errorEmbed] });
      return;
    }

    // ストリーミングレスポンスの処理
    const finalEmbed = new EmbedBuilder()
      .setAuthor({
        name: "AI",
        iconURL: message.client.user?.displayAvatarURL(),
      })
      .setColor(0x7289da);

    await handleStreamingResponse(genResponse, aiMessage, true, {
      embed: finalEmbed,
      authorName: "AI",
      authorIconURL: message.client.user?.displayAvatarURL(),
    });
  } catch (error) {
    logger.error(`[messageCreate] Error processing message: ${error}`);
  }
}

// エクスポートするオブジェクト
export default {
  handleMessageCreate,
  handleStreamingResponse,
};
