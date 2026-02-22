import { logger } from "@lib/logger";

const DISCORD_API_BASE = "https://discord.com/api/v10";

export class DiscordApiError extends Error {
    constructor(
        public code: string,
        message: string,
    ) {
        super(message);
        this.name = "DiscordApiError";
    }
}

function getAuthHeaders(): Record<string, string> {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        throw new DiscordApiError(
            "CONFIGURATION_ERROR",
            "DISCORD_BOT_TOKEN is not set",
        );
    }
    return {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
    };
}

/**
 * Discord APIからギルド情報を取得する
 */
export async function fetchGuild(guildId: string) {
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        logger.error(`[discord-api] Failed to fetch guild ${guildId}: ${response.status}`);
        throw new DiscordApiError("GUILD_NOT_FOUND", "Guild not found or bot lacks access");
    }

    return response.json();
}

/**
 * Discord APIからギルドのチャンネル一覧を取得する
 */
export async function fetchGuildChannels(guildId: string) {
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}/channels`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        logger.error(`[discord-api] Failed to fetch channels for guild ${guildId}: ${response.status}`);
        throw new DiscordApiError("CHANNELS_NOT_FOUND", "Channels not found or bot lacks access");
    }

    return response.json();
}

/**
 * Discord APIからユーザー情報を取得する
 */
export async function fetchDiscordUser(userId: string) {
    const response = await fetch(`${DISCORD_API_BASE}/users/${userId}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        logger.error(`[discord-api] Failed to fetch user ${userId}: ${response.status}`);
        throw new DiscordApiError("USER_NOT_FOUND", "User not found or bot lacks access");
    }

    return response.json();
}

/**
 * Discord APIからチャンネル情報を取得する
 */
export async function fetchChannel(channelId: string) {
    const response = await fetch(`${DISCORD_API_BASE}/channels/${channelId}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        logger.error(`[discord-api] Failed to fetch channel ${channelId}: ${response.status}`);
        throw new DiscordApiError("CHANNEL_NOT_FOUND", "Channel not found or bot lacks access");
    }

    const data = await response.json();
    return {
        id: data.id,
        name: data.name,
        type: data.type,
    };
}
