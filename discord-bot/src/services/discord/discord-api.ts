import { client } from "@bot/lib/client";
import { logger } from "@bot/lib/logger";

export class DiscordApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "DiscordApiError";
  }
}

/**
 * Discord APIからギルド情報を取得する（discord.jsクライアント経由）
 */
export async function fetchGuild(guildId: string) {
  try {
    const guild = await client.guilds.fetch(guildId);
    return {
      id: guild.id,
      name: guild.name,
      icon: guild.icon,
      ownerId: guild.ownerId,
      memberCount: guild.memberCount,
    };
  } catch (error) {
    logger.error(`[discord-api] Failed to fetch guild ${guildId}: ${error}`);
    throw new DiscordApiError(
      "GUILD_NOT_FOUND",
      "Guild not found or bot lacks access",
    );
  }
}

/**
 * Discord APIからギルドのチャンネル一覧を取得する（discord.jsクライアント経由）
 */
export async function fetchGuildChannels(guildId: string) {
  try {
    const guild = await client.guilds.fetch(guildId);
    const channels = await guild.channels.fetch();

    return channels
      .filter((ch) => ch !== null)
      .map((ch) => ({
        id: ch.id,
        name: ch.name,
        type: ch.type,
        position: ch.position,
        parentId: ch.parentId,
      }))
      .sort((a, b) => a.position - b.position);
  } catch (error) {
    logger.error(
      `[discord-api] Failed to fetch channels for guild ${guildId}: ${error}`,
    );
    throw new DiscordApiError(
      "CHANNELS_NOT_FOUND",
      "Channels not found or bot lacks access",
    );
  }
}

/**
 * Discord APIからユーザー情報を取得する（discord.jsクライアント経由）
 */
export async function fetchDiscordUser(userId: string) {
  try {
    const user = await client.users.fetch(userId);
    return {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      bot: user.bot,
    };
  } catch (error) {
    logger.error(`[discord-api] Failed to fetch user ${userId}: ${error}`);
    throw new DiscordApiError(
      "USER_NOT_FOUND",
      "User not found or bot lacks access",
    );
  }
}

/**
 * Discord APIからチャンネル情報を取得する（discord.jsクライアント経由）
 */
export async function fetchChannel(channelId: string) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }

    return {
      id: channel.id,
      name: "name" in channel ? channel.name : null,
      type: channel.type,
      guildId:
        "guildId" in channel ? (channel.guildId ?? undefined) : undefined,
    };
  } catch (error) {
    logger.error(
      `[discord-api] Failed to fetch channel ${channelId}: ${error}`,
    );
    throw new DiscordApiError(
      "CHANNEL_NOT_FOUND",
      "Channel not found or bot lacks access",
    );
  }
}
