import { logger } from "@/lib/logger";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  ChannelType,
  ThreadAutoArchiveDuration,
  type TextChannel,
  type ThreadChannel,
  type Message,
  type DMChannel,
  type TextBasedChannel,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { prisma } from "@/lib/prisma";
import rateLimitManager from "@/handler/rate-limit-handler";
import aiMessageHandler from "@/handler/ai-message-handler";

// API設定 - 環境に応じて変更可能
const CONSTANTS = {
  API_ENDPOINT: process.env.API_ENDPOINT || "http://localhost:3001/api",
  TIMEOUT_MS: 30000, // 30秒タイムアウト
} as const;

// API接続のヘルスチェック
async function checkApiHealth(): Promise<{ ok: boolean; message: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${CONSTANTS.API_ENDPOINT}/health`, {
      signal: controller.signal,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).catch((error) => {
      if (error.name === "AbortError") {
        throw new Error("API接続がタイムアウトしました");
      }
      throw error;
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      try {
        const healthData = await response.json();
        return {
          ok: true,
          message: `API接続は正常です: ${healthData.status || "OK"}`,
        };
      } catch (jsonError) {
        logger.warn(
          `[checkApiHealth] Error parsing health response: ${jsonError}`,
        );
        return {
          ok: true,
          message: "API接続は正常ですが、詳細情報を取得できませんでした",
        };
      }
    }

    try {
      const errorText = await response.text();
      return {
        ok: false,
        message: `APIは応答しましたが、エラーを返しました: ${response.status} ${response.statusText}. 詳細: ${errorText}`,
      };
    } catch (textError) {
      return {
        ok: false,
        message: `APIは応答しましたが、エラーを返しました: ${response.status} ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: `API接続エラー: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export const data = new SlashCommandBuilder()
  .setName("chat")
  .setDescription("AIとチャットできます")
  .addStringOption((option) =>
    option
      .setName("contents")
      .setDescription("チャットの内容")
      .setRequired(true),
  )
  .addBooleanOption((option) =>
    option
      .setName("save_history")
      .setDescription("会話履歴を保存するかどうか（デフォルト: 保存しない）")
      .setRequired(false),
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    // APIのヘルスチェック
    const healthCheck = await checkApiHealth();
    if (!healthCheck.ok) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("APIエラー")
            .setDescription(healthCheck.message)
            .setColor(Colors.Red),
        ],
      });
      return;
    }

    const channel = interaction.channel;
    if (!channel) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("エラー")
            .setDescription("チャンネル情報を取得できませんでした。")
            .setColor(Colors.Red),
        ],
      });
      return;
    }

    if (!("send" in channel)) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("エラー")
            .setDescription("このタイプのチャンネルはサポートされていません。")
            .setColor(Colors.Red),
        ],
      });
      return;
    }

    const channelId = channel.id;

    if (rateLimitManager.isRateLimited(channelId, "chat")) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("レート制限")
            .setDescription(
              "短時間に複数のリクエストが送信されました。少し待ってからもう一度お試しください。",
            )
            .setColor(Colors.Orange),
        ],
      });
      return;
    }

    rateLimitManager.updateRateLimit(channelId);

    const contents = interaction.options.getString("contents", true);
    const saveHistory = interaction.options.getBoolean("save_history") ?? false;
    const title =
      contents.substring(0, 30) + (contents.length > 30 ? "..." : "");

    const guild = interaction.guild;

    if (!guild && saveHistory) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("エラー")
            .setDescription("会話履歴の保存はサーバー内でのみ利用できます。")
            .setColor(Colors.Red),
        ],
      });
      return;
    }

    await ensureUserExists(
      interaction.user.id,
      interaction.user.username,
      interaction.user.avatarURL() || undefined,
    );

    let thread: ThreadChannel | null = null;
    let isNewThread = false;

    if (saveHistory && channel) {
      try {
        const result = await handleChannelType(
          channel,
          interaction.user.id,
          guild?.id || null,
          title,
          true,
        );

        thread = result.thread;
        isNewThread = result.isNewThread;

        if (isNewThread && result.needsRegistration) {
          let isRegistered = false;
          for (let i = 0; i < 3; i++) {
            try {
              const checkResponse = await fetch(
                `${CONSTANTS.API_ENDPOINT}/chat/threads/${thread.id}`,
              );
              if (checkResponse.ok) {
                isRegistered = true;
                break;
              }

              if (checkResponse.status === 404) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                continue;
              }
              break;
            } catch (checkError) {
              break;
            }
          }
        }

        await thread.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setDescription(contents)
              .setColor(Colors.Blue),
          ],
        });
      } catch (error) {
        logger.error(`[chat] Error creating thread: ${error}`);
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("エラー")
              .setDescription("スレッドの作成中にエラーが発生しました。")
              .setColor(Colors.Red),
          ],
        });
        return;
      }
    }

    let aiMessage: Message;
    const aiEmbed = new EmbedBuilder()
      .setAuthor({
        name: "AI",
        iconURL: interaction.client.user?.displayAvatarURL(),
      })
      .setDescription("考え中...")
      .setColor(Colors.Greyple);

    if (thread) {
      aiMessage = await thread.send({
        embeds: [aiEmbed],
      });
    } else {
      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(contents)
            .setColor(Colors.Blue),
        ],
      });

      aiMessage = await channel.send({
        embeds: [aiEmbed],
      });
    }

    try {
      const requestBody = {
        contents,
        stream: true,
        threadId: saveHistory && thread ? thread.id : null,
      };

      const genResponse = await fetch(
        `${CONSTANTS.API_ENDPOINT}/chat/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!genResponse.ok) {
        const errorData = await genResponse.json();
        await aiMessage.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle("エラー")
              .setDescription(
                `エラーが発生しました: ${
                  errorData.error?.message || "不明なエラー"
                }`,
              )
              .setColor(Colors.Red),
          ],
        });
        return;
      }

      const responseEmbed = new EmbedBuilder()
        .setAuthor({
          name: "AI",
          iconURL: interaction.client.user?.displayAvatarURL(),
        })
        .setColor(Colors.Purple);

      await aiMessageHandler.handleStreamingResponse(
        genResponse,
        aiMessage,
        true,
        {
          embed: responseEmbed,
          authorName: "AI",
          authorIconURL: interaction.client.user?.displayAvatarURL(),
        },
      );

      const statusEmbed = new EmbedBuilder()
        .setTitle("AI応答")
        .setColor(Colors.Green);

      if (saveHistory && thread) {
        if (isNewThread && channel.type === ChannelType.GuildText) {
          statusEmbed
            .setDescription(`会話スレッドを作成しました！ ${thread}`)
            .addFields({
              name: "会話履歴",
              value: "✅ 会話履歴を保存します",
            });
        } else {
          statusEmbed.setDescription("メッセージを送信しました！").addFields({
            name: "会話履歴",
            value: "✅ 会話履歴を保存します",
          });
        }
      } else {
        statusEmbed.setDescription("メッセージを送信しました！").addFields({
          name: "会話履歴",
          value: "❌ 会話履歴は保存されません",
        });
      }

      await interaction.editReply({ embeds: [statusEmbed] });
    } catch (apiError) {
      logger.error(`[chat] Error connecting to API: ${apiError}`);

      const errorEmbed = new EmbedBuilder()
        .setTitle("API接続エラー")
        .setDescription(`AIサービスに接続できませんでした: ${apiError}`)
        .setColor(Colors.Red);

      await aiMessage.edit({
        embeds: [errorEmbed],
      });

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("APIエラー")
            .setDescription(
              "AIサービスに接続できませんでした。サービスが実行されているか確認してください。",
            )
            .setColor(Colors.Red),
        ],
      });
      return;
    }
  } catch (error) {
    logger.error(`[chat] Error executing command: ${error}`);
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("エラー")
          .setDescription("チャット処理中にエラーが発生しました。")
          .setColor(Colors.Red),
      ],
    });
  }
}

/**
 * ユーザーがデータベースに存在するか確認し、存在しない場合は作成する
 */
async function ensureUserExists(
  userId: string,
  username: string,
  avatarUrl?: string,
): Promise<void> {
  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      await prisma.users.create({
        data: {
          id: userId,
          username,
          avatarUrl,
          money: 1000, // デフォルト値
          discriminator: "0",
        },
      });
      logger.info(`[chat] Created new user: ${userId} (${username})`);
    }
  } catch (error) {
    logger.error(`[chat] Error ensuring user exists: ${error}`);
    throw error;
  }
}

/**
 * チャンネルタイプに応じた処理を行い、スレッドとその状態を返す
 * DMチャンネル、テキストチャンネル、スレッドの各タイプに対応し、
 * 必要に応じてスレッドの作成や既存スレッドの利用、APIへの登録を行う
 */
async function handleChannelType(
  channel: TextBasedChannel,
  userId: string,
  guildId: string | null,
  title: string,
  saveHistory: boolean,
): Promise<{
  thread: ThreadChannel;
  isNewThread: boolean;
  needsRegistration: boolean;
}> {
  let thread: ThreadChannel | null = null;
  let isNewThread = false;
  let needsRegistration = false;

  try {
    if (channel.type === ChannelType.GuildText) {
      logger.info(`[chat] Creating new thread in text channel ${channel.id}`);
      thread = await (channel as TextChannel).threads.create({
        name: title,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        reason: "AIとの会話用スレッド",
      });
      isNewThread = true;

      if (saveHistory) {
        const registrationSuccess = await registerThread(
          thread.id,
          guildId || "",
          userId,
          title,
        );
        needsRegistration = true;

        if (!registrationSuccess) {
          logger.warn(
            `[chat] Failed to register new thread ${thread.id} with API. Continuing with local thread.`,
          );
        }
      }
    } else if (channel.type === ChannelType.PublicThread) {
      thread = channel as ThreadChannel;
      logger.info(`[chat] Using existing thread ${thread.id}`);

      if (saveHistory) {
        try {
          const checkResponse = await fetch(
            `${CONSTANTS.API_ENDPOINT}/chat/threads/${thread.id}`,
          );

          if (checkResponse.status === 404) {
            logger.info(
              `[chat] Thread ${thread.id} not found in API, registering...`,
            );
            const registrationSuccess = await registerThread(
              thread.id,
              guildId || "",
              userId,
              thread.name,
            );
            needsRegistration = true;

            if (!registrationSuccess) {
              logger.warn(
                `[chat] Failed to register existing thread ${thread.id} with API. Continuing anyway.`,
              );
            } else {
              isNewThread = true;
            }
          } else if (!checkResponse.ok) {
            logger.error(
              `[chat] Error checking thread existence: ${checkResponse.status} ${checkResponse.statusText}`,
            );
          } else {
            logger.info(`[chat] Thread ${thread.id} already registered in API`);
          }
        } catch (checkError) {
          logger.error(`[chat] Error checking thread existence: ${checkError}`);
        }
      }
    } else if (channel.type === ChannelType.DM) {
      const dmChannel = channel as DMChannel;
      thread = dmChannel as unknown as ThreadChannel;
      logger.info(`[chat] Using DM channel ${dmChannel.id} as thread`);

      if (saveHistory) {
        const dmChannelId = dmChannel.id;
        try {
          const checkResponse = await fetch(
            `${CONSTANTS.API_ENDPOINT}/chat/threads/${dmChannelId}`,
          );

          if (checkResponse.status === 404) {
            logger.info(
              `[chat] DM channel ${dmChannelId} not found in API, registering...`,
            );
            // DMの場合は固定値を使用
            const dmGuildId = "DM_CHANNEL";
            const registrationSuccess = await registerThread(
              dmChannelId,
              dmGuildId,
              userId,
              title,
            );
            needsRegistration = true;

            if (!registrationSuccess) {
              logger.warn(
                `[chat] Failed to register DM channel ${dmChannelId} with API. Continuing anyway.`,
              );
            } else {
              isNewThread = true;
            }
          } else if (!checkResponse.ok) {
            logger.error(
              `[chat] Error checking DM channel existence: ${checkResponse.status} ${checkResponse.statusText}`,
            );
          } else {
            logger.info(
              `[chat] DM channel ${dmChannelId} already registered in API`,
            );
          }
        } catch (checkError) {
          logger.error(
            `[chat] Error checking DM channel existence: ${checkError}`,
          );
        }
      }
    } else {
      logger.error(`[chat] Unsupported channel type: ${channel.type}`);
      throw new Error("サポートされていないチャンネルタイプです");
    }

    if (thread === null) {
      throw new Error("スレッドの作成または取得に失敗しました");
    }

    return { thread, isNewThread, needsRegistration };
  } catch (error) {
    logger.error(`[chat] Error in handleChannelType: ${error}`);
    throw error;
  }
}

/**
 * スレッド情報をAPIに登録する
 */
async function registerThread(
  threadId: string,
  guildId: string,
  creatorId: string,
  title: string,
): Promise<boolean> {
  try {
    // guildIdがDMチャンネルの場合は特殊な値を使用
    const finalGuildId = guildId || "DM_CHANNEL";

    // リクエスト詳細をログに出力
    const requestBody = {
      channelId: threadId,
      guildId: finalGuildId,
      creatorId,
      title,
    };

    logger.info(`[chat] Registering thread: ${JSON.stringify(requestBody)}`);

    const response = await fetch(`${CONSTANTS.API_ENDPOINT}/chat/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      try {
        const errorText = await response.text();
        logger.error(
          `[chat] Error registering thread: status=${response.status}, body=${errorText}`,
        );
      } catch (textError) {
        logger.error(
          `[chat] Error registering thread: status=${response.status}, could not read error response: ${textError}`,
        );
      }
      return false;
    }

    logger.info(`[chat] Thread registered successfully: ${threadId}`);
    return true;
  } catch (error) {
    logger.error(`[chat] Error registering thread: ${error}`);
    return false;
  }
}
