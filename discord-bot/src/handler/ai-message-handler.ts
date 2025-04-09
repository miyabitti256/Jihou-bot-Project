import { logger } from "@lib/logger";
import type { Message, TextChannel } from "discord.js";
import { ThreadChannel as ThreadChannelClass, EmbedBuilder } from "discord.js";
import { prisma } from "@lib/prisma";
import rateLimitManager from "../handler/rate-limit-handler";
import {
  splitMessage,
  splitStreamingMessage,
} from "@lib/utils";

const CONSTANTS = {
  API_ENDPOINT: "http://localhost:3001/api/chat",
} as const;

// 更新間隔（文字数）
const UPDATE_INTERVAL = 100;

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
 * ストリーミングレスポンスを処理し、Discordメッセージを更新する
 * @param response ストリーミングレスポンス
 * @param message 更新するDiscordメッセージ
 * @param useEmbed 埋め込みメッセージを使用するかどうか
 * @param embedOptions 埋め込みメッセージのオプション
 */
export async function handleStreamingResponse(
  response: Response,
  initialMessage: Message,
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
      await initialMessage.edit({ embeds: [embedOptions.embed] });
    } else {
      await initialMessage.edit(errorMsg);
    }
    return;
  }

  // レスポンスボディが存在しない場合のエラーハンドリング
  if (!response.body) {
    const errorMsg = "レスポンスボディが空です";
    logger.error(`[handleStreamingResponse] ${errorMsg}`);

    if (useEmbed && embedOptions) {
      embedOptions.embed.setDescription(errorMsg);
      await initialMessage.edit({ embeds: [embedOptions.embed] });
    } else {
      await initialMessage.edit(errorMsg);
    }
    return;
  }

  // 処理用の状態変数
  const MAX_TEXT_LENGTH = useEmbed ? 4000 : 1900; // 埋め込みメッセージかどうかで最大長を設定
  let fullText = "";
  let lastUpdateLength = 0;

  // コードブロックの状態を追跡
  let lastCodeBlockState = {
    isInCodeBlock: false,
    codeBlockType: null as string | null,
  };

  // 最後に完全にチャンク送信処理を行った位置を追跡
  let lastProcessedLength = 0;

  // メッセージ継続用のフラグと変数
  let currentMessage = initialMessage;
  let textChannel: TextChannel | null = null;

  try {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // ストリーム読み取りループ
    while (true) {
      let done = false;
      let value: Uint8Array | undefined;

      try {
        const readResult = await reader.read();
        done = readResult.done;
        value = readResult.value;
      } catch (readError) {
        logger.error(
          `[handleStreamingResponse] Error reading stream: ${readError}`,
        );
        break;
      }

      if (done) break;
      if (!value) continue;

      // 受信データをデコードし、ログに記録
      const chunk = decoder.decode(value);
      logger.debug(
        `[handleStreamingResponse] Received chunk: ${chunk.substring(0, 100)}${
          chunk.length > 100 ? "..." : ""
        }`,
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

      // テキストの長さをチェック
      if (fullText.length > MAX_TEXT_LENGTH * 10) {
        // テキストが極端に長くなった場合は、一部を切り捨てて再開
        logger.warn(
          `[handleStreamingResponse] Text too long (${fullText.length} chars), truncating...`,
        );
        fullText = fullText.substring(fullText.length - MAX_TEXT_LENGTH * 5);
        lastProcessedLength = 0;
        lastUpdateLength = 0;
      }

      // 更新間隔に達した場合、最後のチャンクの場合、または文字数が制限に近づいたときに更新
      const shouldUpdate =
        fullText.length - lastUpdateLength >= UPDATE_INTERVAL ||
        done ||
        fullText.length - lastProcessedLength >= MAX_TEXT_LENGTH * 0.8; // 80%に達したら更新

      if (shouldUpdate) {
        if (done) {
          // 完了時はsplitMessageで複数メッセージに分割
          const { chunks, wasChunked } = splitMessage(fullText, useEmbed);

          if (chunks.length > 0) {
            // 最初のメッセージは既存のメッセージを更新
            if (useEmbed && embedOptions) {
              embedOptions.embed.setDescription(chunks[0]);
              if (embedOptions.authorName) {
                embedOptions.embed.setAuthor({
                  name: embedOptions.authorName,
                  iconURL: embedOptions.authorIconURL,
                });
              }
              await currentMessage.edit({ embeds: [embedOptions.embed] });

              // 残りのメッセージを別途送信（2つ目以降）
              if (wasChunked && chunks.length > 1) {
                textChannel = currentMessage.channel as TextChannel;
                const remainingChunks = chunks.slice(1);

                await sendRemainingChunks(
                  textChannel,
                  remainingChunks,
                  useEmbed,
                  {
                    color: embedOptions.embed.data.color || 0x000000,
                    authorName: embedOptions.authorName,
                    authorIconURL: embedOptions.authorIconURL,
                  },
                );
              }
            } else {
              await currentMessage.edit(chunks[0]);

              // 残りのテキストメッセージを送信
              if (wasChunked && chunks.length > 1) {
                textChannel = currentMessage.channel as TextChannel;
                const remainingChunks = chunks.slice(1);
                await sendRemainingChunks(textChannel, remainingChunks);
              }
            }
          }
        } else {
          // 文字数チェック: 許容最大長を超えそうな場合は途中でメッセージを分割して送信
          if (fullText.length > lastProcessedLength + MAX_TEXT_LENGTH) {
            logger.debug(
              "[handleStreamingResponse] Text exceeds chunk limit, sending chunked...",
            );

            // 現在までの完全なテキストで分割を行う
            const { chunks, wasChunked } = splitMessage(fullText, useEmbed);

            if (chunks.length > 0) {
              // 最初のチャンクを既存のメッセージに設定
              if (useEmbed && embedOptions) {
                embedOptions.embed.setDescription(chunks[0]);
                if (embedOptions.authorName) {
                  embedOptions.embed.setAuthor({
                    name: embedOptions.authorName,
                    iconURL: embedOptions.authorIconURL,
                  });
                }
                await currentMessage.edit({ embeds: [embedOptions.embed] });

                // 残りのチャンクを新しいメッセージとして送信
                if (wasChunked && chunks.length > 1) {
                  textChannel = currentMessage.channel as TextChannel;
                  const remainingChunks = chunks.slice(1);

                  // 最後のチャンクが「続く...」表示で終わるようにする
                  if (remainingChunks.length > 0) {
                    const lastIndex = remainingChunks.length - 1;
                    remainingChunks[lastIndex] += "\n\n*続く...*";
                  }

                  await sendRemainingChunks(
                    textChannel,
                    remainingChunks,
                    useEmbed,
                    {
                      color: embedOptions.embed.data.color || 0x000000,
                      authorName: embedOptions.authorName,
                      authorIconURL: embedOptions.authorIconURL,
                    },
                  );

                  // 新しいメッセージを準備
                  const newEmbed = new EmbedBuilder()
                    .setDescription("*続きを受信中...*")
                    .setColor(embedOptions?.embed?.data?.color || 0x000000);

                  if (embedOptions?.authorName) {
                    newEmbed.setAuthor({
                      name: embedOptions.authorName,
                      iconURL: embedOptions?.authorIconURL,
                    });
                  }

                  // 新しいメッセージを送信
                  const nextMessage = await textChannel.send({
                    embeds: [newEmbed],
                  });

                  // 埋め込みを更新
                  if (embedOptions) {
                    embedOptions.embed = newEmbed;
                  }

                  // 処理済みとしてマーク
                  currentMessage = nextMessage;
                  fullText = ""; // フルテキストをリセット
                  lastProcessedLength = 0;
                  lastUpdateLength = 0;
                }
              } else {
                await currentMessage.edit(chunks[0]);

                // 残りのテキストメッセージを送信
                if (wasChunked && chunks.length > 1) {
                  textChannel = currentMessage.channel as TextChannel;
                  const remainingChunks = chunks.slice(1);

                  // 最後のチャンクが「続く...」表示で終わるようにする
                  if (remainingChunks.length > 0) {
                    const lastIndex = remainingChunks.length - 1;
                    remainingChunks[lastIndex] += "\n\n*続く...*";
                  }

                  await sendRemainingChunks(textChannel, remainingChunks);

                  // 新しいメッセージを準備
                  const newEmbed = new EmbedBuilder()
                    .setDescription("*続きを受信中...*")
                    .setColor(embedOptions?.embed?.data?.color || 0x000000);

                  if (embedOptions?.authorName) {
                    newEmbed.setAuthor({
                      name: embedOptions.authorName,
                      iconURL: embedOptions?.authorIconURL,
                    });
                  }

                  // 新しいメッセージを送信
                  const nextMessage = await textChannel.send({
                    embeds: [newEmbed],
                  });

                  // 処理済みとしてマーク
                  currentMessage = nextMessage;
                  fullText = ""; // フルテキストをリセット
                  lastProcessedLength = 0;
                  lastUpdateLength = 0;
                }
              }
            }
          } else {
            // 通常のストリーミング更新：コードブロックなどが適切に閉じられた単一のメッセージを使用
            const { text, codeBlockState } = splitStreamingMessage(
              fullText,
              useEmbed,
            );

            // 前回の状態を保存して、次回のために更新
            lastCodeBlockState = codeBlockState;

            if (useEmbed && embedOptions) {
              embedOptions.embed.setDescription(text);
              if (embedOptions.authorName) {
                embedOptions.embed.setAuthor({
                  name: embedOptions.authorName,
                  iconURL: embedOptions.authorIconURL,
                });
              }
              await currentMessage.edit({ embeds: [embedOptions.embed] });
            } else {
              await currentMessage.edit(text);
            }
          }
        }
        lastUpdateLength = fullText.length;
      }
    }

    // 最終チェック - 更新されていなければ更新
    if (fullText.length > 0 && fullText.length !== lastUpdateLength) {
      // 完了時は常にsplitMessageを使用
      const { chunks, wasChunked } = splitMessage(fullText, useEmbed);

      if (chunks.length > 0) {
        if (useEmbed && embedOptions) {
          embedOptions.embed.setDescription(chunks[0]);
          if (embedOptions.authorName) {
            embedOptions.embed.setAuthor({
              name: embedOptions.authorName,
              iconURL: embedOptions.authorIconURL,
            });
          }
          await currentMessage.edit({ embeds: [embedOptions.embed] });

          // 残りのメッセージを別途送信（2つ目以降）
          if (wasChunked && chunks.length > 1) {
            textChannel = currentMessage.channel as TextChannel;
            const remainingChunks = chunks.slice(1);

            await sendRemainingChunks(textChannel, remainingChunks, useEmbed, {
              color: embedOptions.embed.data.color || 0x000000,
              authorName: embedOptions.authorName,
              authorIconURL: embedOptions.authorIconURL,
            });
          }
        } else {
          await currentMessage.edit(chunks[0]);

          // 残りのテキストメッセージを送信
          if (wasChunked && chunks.length > 1) {
            textChannel = currentMessage.channel as TextChannel;
            const remainingChunks = chunks.slice(1);
            await sendRemainingChunks(textChannel, remainingChunks);
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
        await currentMessage.edit({ embeds: [embedOptions.embed] });
      } else {
        await currentMessage.edit(noResponseMsg);
      }
    }
  } catch (error) {
    const errorMsg = `[handleStreamingResponse] Stream processing error: ${error}`;
    logger.error(errorMsg);

    if (useEmbed && embedOptions) {
      embedOptions.embed.setDescription(
        `ストリーム処理中にエラーが発生しました: ${error}`,
      );
      await currentMessage.edit({ embeds: [embedOptions.embed] });
    } else {
      await currentMessage.edit(
        `ストリーム処理中にエラーが発生しました: ${error}`,
      );
    }
  } finally {
    // ストリームが自動的に閉じられるため、特別なクリーンアップは不要
    // リーダーのロック状態をチェックしてからリリースする
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
