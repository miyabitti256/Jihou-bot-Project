import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";

export interface GuildIncludeOptions {
  roles?: boolean;
  channels?: boolean;
  members?: boolean;
  messages?: boolean;
}

export class GuildError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuildError";
  }
}

/**
 * ギルド情報を取得する関数
 * @param guildId ギルドID
 * @param includeOptions 関連データのincludeオプション
 * @throws {GuildError} ギルドが見つからない場合
 */
export async function getGuildWithData(
  guildId: string,
  includeOptions: GuildIncludeOptions = {},
) {
  try {
    const includeMap = {
      roles: includeOptions.roles ?? false,
      channels: includeOptions.channels ?? false,
      members: includeOptions.members ?? false,
      ScheduledMessage: includeOptions.messages ?? false,
    };

    const data = await prisma.guild.findUnique({
      where: { id: guildId },
      include: includeMap,
    });

    if (!data) {
      throw new GuildError("GUILD_NOT_FOUND");
    }

    return data;
  } catch (error) {
    logger.error(`[guild] Failed to get guild data: ${error}`);
    if (error instanceof GuildError) {
      throw error;
    }
    throw new GuildError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * ユーザーが所属するギルドの情報を取得する
 * @param userId ユーザーID
 */
export async function getUserGuilds(userId: string) {
  try {
    const data = await prisma.guildMembers.findMany({
      where: { userId },
      include: {
        guild: true,
      },
    });

    return data;
  } catch (error) {
    logger.error(`[guild] Failed to get user guilds: ${error}`);
    throw new GuildError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * ギルドメンバー情報を取得する
 * @param guildId ギルドID
 */
export async function getGuildMembers(guildId: string) {
  try {
    return await prisma.guildMembers.findMany({
      where: { guildId },
      include: {
        user: true,
      },
    });
  } catch (error) {
    logger.error(`[guild] Failed to get guild members: ${error}`);
    throw new GuildError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * ギルドチャンネル情報を取得する
 * @param guildId ギルドID
 */
export async function getGuildChannels(guildId: string) {
  try {
    return await prisma.guildChannels.findMany({
      where: { guildId },
    });
  } catch (error) {
    logger.error(`[guild] Failed to get guild channels: ${error}`);
    throw new GuildError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * ギルドロール情報を取得する
 * @param guildId ギルドID
 */
export async function getGuildRoles(guildId: string) {
  try {
    return await prisma.guildRoles.findMany({
      where: { guildId },
    });
  } catch (error) {
    logger.error(`[guild] Failed to get guild roles: ${error}`);
    throw new GuildError("INTERNAL_SERVER_ERROR");
  }
}
