import { db } from "@bot/lib/db";
import { logger } from "@bot/lib/logger";
import {
  guildChannels,
  guildMembers,
  guildRoles,
  guilds,
} from "@jihou/database";
import { and, eq } from "drizzle-orm";

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
    const data = await db.query.guilds.findFirst({
      where: eq(guilds.id, guildId),
      with: {
        guildRoles: includeOptions.roles ? true : undefined,
        guildChannels: includeOptions.channels ? true : undefined,
        guildMembers: includeOptions.members ? true : undefined,
        scheduledMessages: includeOptions.messages ? true : undefined,
      },
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
    const data = await db.query.guildMembers.findMany({
      where: eq(guildMembers.userId, userId),
      with: {
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
    return await db.query.guildMembers.findMany({
      where: eq(guildMembers.guildId, guildId),
      with: {
        user: true,
      },
    });
  } catch (error) {
    logger.error(`[guild] Failed to get guild members: ${error}`);
    throw new GuildError("INTERNAL_SERVER_ERROR");
  }
}

/**
 * 指定したユーザーが特定のギルドに所属しているか検証する
 * @param userId ユーザーID
 * @param guildId ギルドID
 * @returns メンバーであれば true、そうでなければ false
 */
export async function verifyUserGuildAccess(
  userId: string,
  guildId: string,
): Promise<boolean> {
  try {
    const member = await db.query.guildMembers.findFirst({
      where: and(
        eq(guildMembers.guildId, guildId),
        eq(guildMembers.userId, userId),
      ),
      columns: { guildId: true },
    });
    return member !== undefined;
  } catch (error) {
    logger.error(`[guild] Failed to verify user guild access: ${error}`);
    return false;
  }
}

/**
 * ギルドチャンネル情報を取得する
 * @param guildId ギルドID
 */
export async function getGuildChannels(guildId: string) {
  try {
    return await db.query.guildChannels.findMany({
      where: eq(guildChannels.guildId, guildId),
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
    return await db.query.guildRoles.findMany({
      where: eq(guildRoles.guildId, guildId),
    });
  } catch (error) {
    logger.error(`[guild] Failed to get guild roles: ${error}`);
    throw new GuildError("INTERNAL_SERVER_ERROR");
  }
}
