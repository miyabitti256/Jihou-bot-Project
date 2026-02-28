import { ChatRole } from "@bot/generated/prisma/client/client";
import rateLimitManager from "@bot/handler/rate-limit";
import { logger } from "@bot/lib/logger";
import {
  ChatServiceError,
  createChatMessage,
  createChatThread,
  generateSingleResponseStream,
  generateThreadResponseStream,
  getChatThread,
} from "@bot/services/chat/chat";
import { ensureUserExists } from "@bot/services/users/user";
import {
  ChannelType,
  type ChatInputCommandInteraction,
  Colors,
  type DMChannel,
  EmbedBuilder,
  type Message,
  SlashCommandBuilder,
  type TextBasedChannel,
  type TextChannel,
  ThreadAutoArchiveDuration,
  type ThreadChannel,
} from "discord.js";

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
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
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
          saveHistory,
        );

        thread = result.thread;
        isNewThread = result.isNewThread;

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
      let responseText = "";

      if (saveHistory && thread) {
        // スレッドありの場合、履歴付きでレスポンスを生成
        const response = await generateThreadResponseStream(
          thread.id,
          contents,
        );

        // AIメッセージの内容を収集
        for await (const chunk of response.stream) {
          if (chunk?.text) {
            responseText += chunk.text;
          }
        }

        // AIメッセージをデータベースに保存
        await createChatMessage(thread.id, responseText, ChatRole.ASSISTANT);
      } else {
        // スレッドなしの場合、単発のレスポンスを生成
        const generator = await generateSingleResponseStream(contents);
        for await (const chunk of generator) {
          if (chunk?.text) {
            responseText += chunk.text;
          }
        }
      }

      const responseEmbed = new EmbedBuilder()
        .setAuthor({
          name: "AI",
          iconURL: interaction.client.user?.displayAvatarURL(),
        })
        .setDescription(responseText)
        .setColor(Colors.Purple);

      await aiMessage.edit({ embeds: [responseEmbed] });

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
    } catch (error) {
      logger.error(`[chat] Error generating response: ${error}`);

      const errorEmbed = new EmbedBuilder()
        .setTitle("エラー")
        .setDescription(`AIサービスでエラーが発生しました: ${error}`)
        .setColor(Colors.Red);

      await aiMessage.edit({
        embeds: [errorEmbed],
      });

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("エラー")
            .setDescription("AIレスポンス生成中にエラーが発生しました。")
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
 * チャンネルタイプに応じた処理を行い、スレッドとその状態を返す
 * DMチャンネル、テキストチャンネル、スレッドの各タイプに対応し、
 * 必要に応じてスレッドの作成や既存スレッドの利用、スレッド登録を行う
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
}> {
  let thread: ThreadChannel | null = null;
  let isNewThread = false;

  try {
    if (channel.type === ChannelType.GuildText) {
      logger.info(`[chat] Creating new thread in text channel ${channel.id}`);
      // ChannelType.GuildText ガード後、channel は GuildTextBasedChannel 型だが
      // threads.create は TextChannel のメソッドであるため、型ナローイングが必要。
      // Discord.js の channel 型ガードは isTextBased() では threads プロパティを推論しない。
      const textChannel = channel as TextChannel;
      thread = await textChannel.threads.create({
        name: title,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        reason: "AIとの会話用スレッド",
      });
      isNewThread = true;

      if (saveHistory) {
        await createChatThread({
          channelId: thread.id,
          guildId: guildId || undefined,
          creatorId: userId,
          title: title,
        });
      }
    } else if (channel.type === ChannelType.PublicThread) {
      // ChannelType.PublicThread ガード後、channel は PublicThreadChannel 型に推論されるが
      // ThreadChannel との型互換性のため明示的にキャストが必要。
      thread = channel as ThreadChannel;
      logger.info(`[chat] Using existing thread ${thread.id}`);

      if (saveHistory) {
        try {
          // スレッドが存在するか確認
          await getChatThread(thread.id);
        } catch (error) {
          if (
            error instanceof ChatServiceError &&
            error.code === "THREAD_NOT_FOUND"
          ) {
            // スレッドが存在しない場合は作成
            logger.info(
              `[chat] Thread ${thread.id} not found in database, registering...`,
            );
            await createChatThread({
              channelId: thread.id,
              guildId: guildId || undefined,
              creatorId: userId,
              title: thread.name,
            });
            isNewThread = true;
          } else {
            throw error;
          }
        }
      }
    } else if (channel.type === ChannelType.DM) {
      const dmChannel = channel as DMChannel;
      // Discord.js の DMChannel と ThreadChannel は共通の send() メソッドを持つが、
      // 型階層が異なるため直接の互換性がない。
      // この関数の戻り値型が ThreadChannel を要求するため、構造的なリファクタリングなしには as を除去できない。
      thread = dmChannel as unknown as ThreadChannel;
      logger.info(`[chat] Using DM channel ${dmChannel.id} as thread`);

      if (saveHistory) {
        const dmChannelId = dmChannel.id;
        try {
          // DMチャンネルが存在するか確認
          await getChatThread(dmChannelId);
        } catch (error) {
          if (
            error instanceof ChatServiceError &&
            error.code === "THREAD_NOT_FOUND"
          ) {
            // DMチャンネルが存在しない場合は作成
            logger.info(
              `[chat] DM channel ${dmChannelId} not found in database, registering...`,
            );
            await createChatThread({
              channelId: dmChannelId,
              guildId: "DM_CHANNEL",
              creatorId: userId,
              title: title,
            });
            isNewThread = true;
          } else {
            throw error;
          }
        }
      }
    } else {
      logger.error(`[chat] Unsupported channel type: ${channel.type}`);
      throw new Error("サポートされていないチャンネルタイプです");
    }

    if (thread === null) {
      throw new Error("スレッドの作成または取得に失敗しました");
    }

    return { thread, isNewThread };
  } catch (error) {
    logger.error(`[chat] Error in handleChannelType: ${error}`);
    throw error;
  }
}
