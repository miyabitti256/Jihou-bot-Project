import { logger } from "@bot/lib/logger";
import { pool, prisma } from "@bot/lib/prisma";
import { deactivateScheduledMessagesByChannelId } from "@bot/services/guilds/scheduled-message";
import type { Guild, GuildMember } from "discord.js";

// エラークラス
export class DbSyncError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "DbSyncError";
    this.code = code;
  }
}

export interface GuildData {
  id: string;
  name: string;
  memberCount: number;
  iconUrl: string | null;
}

export interface ChannelData {
  id: string;
  name: string;
  type: string;
}

export interface UserData {
  id: string;
  username: string;
  discriminator: string | null;
  avatarUrl: string | null;
}

export interface MemberData {
  nickname: string | null;
  joinedAt: Date;
}

export interface RoleData {
  id: string;
  name: string;
  color: string;
  position: number;
  permissions: string;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
}

export interface DefaultRole {
  name: string;
  color: string;
}

/**
 * ギルドデータを更新する
 */
export async function updateGuildData(guildData: GuildData) {
  try {
    return await prisma.guild.upsert({
      where: { id: guildData.id },
      create: {
        id: guildData.id,
        name: guildData.name,
        memberCount: guildData.memberCount,
        iconUrl: guildData.iconUrl || "",
      },
      update: {
        name: guildData.name,
        memberCount: guildData.memberCount,
        iconUrl: guildData.iconUrl || "",
      },
    });
  } catch (error) {
    logger.error(`[db-sync] Error updating guild data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update guild data");
  }
}

/**
 * チャンネルデータを更新する
 *
 * guild.channels.cache からの読み取りデータのみ使用（Discord APIコールなし）。
 * リモートSupabaseへのラウンドトリップを最小化するため、
 * 個別upsertではなく $transaction でバッチ処理する。
 */
export async function updateChannelsData(
  guildId: string,
  channels: ChannelData[],
) {
  try {
    return await prisma.$transaction(
      channels.map((channel) =>
        prisma.guildChannels.upsert({
          where: { id: channel.id },
          create: {
            id: channel.id,
            guildId: guildId,
            name: channel.name,
            type: channel.type,
          },
          update: {
            name: channel.name,
            type: channel.type,
          },
        }),
      ),
    );
  } catch (error) {
    logger.error(`[db-sync] Error updating channel data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update channel data");
  }
}

/**
 * メンバーデータを一括更新する（Raw SQL版）
 *
 * Prismaの upsert は内部で SELECT + INSERT/UPDATE の2本のSQLに分解されるため、
 * 1000人のメンバーに対して最大4,000本のSQLが生成され、512MBメモリ環境では
 * Prismaエンジンのメモリ消費でOOMが発生していた。
 *
 * PostgreSQLネイティブの INSERT ... ON CONFLICT DO UPDATE を使用することで、
 * 同じ処理がたった2本のSQL（users + guild_members）で完了する。
 * Prismaを経由せずpg Poolを直接使用するため、クエリエンジンのオーバーヘッドもゼロ。
 */
export async function updateMembersData(
  guildId: string,
  members: { user: UserData; member: MemberData }[],
) {
  if (members.length === 0) return;

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // --- users テーブルの一括 upsert ---
      // パラメータ: id, username, discriminator, avatarUrl の4カラム
      const userValues: unknown[] = [];
      const userPlaceholders: string[] = [];
      for (let i = 0; i < members.length; i++) {
        const u = members[i].user;
        const offset = i * 4;
        userPlaceholders.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, 1000, NOW(), NOW())`,
        );
        userValues.push(u.id, u.username, u.discriminator, u.avatarUrl);
      }

      await client.query(
        `INSERT INTO "users" ("id", "username", "discriminator", "avatarUrl", "money", "createdAt", "updatedAt")
         VALUES ${userPlaceholders.join(", ")}
         ON CONFLICT ("id") DO UPDATE SET
           "username" = EXCLUDED."username",
           "discriminator" = EXCLUDED."discriminator",
           "avatarUrl" = EXCLUDED."avatarUrl",
           "updatedAt" = NOW()`,
        userValues,
      );

      // --- guild_members テーブルの一括 upsert ---
      // パラメータ: guildId, userId, nickname, joinedAt の4カラム
      const memberValues: unknown[] = [];
      const memberPlaceholders: string[] = [];
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const offset = i * 4;
        memberPlaceholders.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`,
        );
        memberValues.push(
          guildId,
          m.user.id,
          m.member.nickname,
          m.member.joinedAt,
        );
      }

      await client.query(
        `INSERT INTO "guild_members" ("guildId", "userId", "nickname", "joinedAt")
         VALUES ${memberPlaceholders.join(", ")}
         ON CONFLICT ("guildId", "userId") DO UPDATE SET
           "nickname" = EXCLUDED."nickname",
           "joinedAt" = EXCLUDED."joinedAt"`,
        memberValues,
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error(`[db-sync] Error updating member data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update member data");
  }
}

/**
 * ロールデータを更新する
 *
 * guild.roles.cache からの読み取りデータのみ使用（Discord APIコールなし）。
 * リモートSupabaseへのラウンドトリップを最小化するため、
 * 個別upsertではなく $transaction でバッチ処理する。
 */
export async function updateRolesData(guildId: string, roles: RoleData[]) {
  try {
    return await prisma.$transaction(
      roles.map((role) =>
        prisma.guildRoles.upsert({
          where: { id: role.id },
          create: {
            id: role.id,
            guildId: guildId,
            name: role.name,
            color: role.color,
            position: role.position,
            permissions: role.permissions,
            hoist: role.hoist,
            managed: role.managed,
            mentionable: role.mentionable,
          },
          update: {
            name: role.name,
            color: role.color,
            position: role.position,
            permissions: role.permissions,
            hoist: role.hoist,
            managed: role.managed,
            mentionable: role.mentionable,
          },
        }),
      ),
    );
  } catch (error) {
    logger.error(`[db-sync] Error updating role data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update role data");
  }
}

/**
 * ギルドデータを削除する
 */
export async function deleteGuildData(guildId: string) {
  try {
    // スケジュールメッセージを事前に無効化してログ出力
    const scheduledMessages = await prisma.scheduledMessage.findMany({
      where: { guildId, isActive: true },
      select: { id: true, channelId: true },
    });

    if (scheduledMessages.length > 0) {
      await prisma.scheduledMessage.updateMany({
        where: { guildId, isActive: true },
        data: { isActive: false, updatedAt: new Date() },
      });
      logger.warn(
        `[db-sync] Deactivated ${scheduledMessages.length} scheduled messages for guild: ${guildId} (guild deletion)`,
      );
    }

    // 関連データを削除するため、トランザクションを使用
    return await prisma.$transaction([
      prisma.scheduledMessage.deleteMany({
        where: { guildId },
      }),
      prisma.guildChannels.deleteMany({
        where: { guildId },
      }),
      prisma.guildRoles.deleteMany({
        where: { guildId },
      }),
      prisma.guildMembers.deleteMany({
        where: { guildId },
      }),
      prisma.guild.delete({
        where: { id: guildId },
      }),
    ]);
  } catch (error) {
    logger.error(`[db-sync] Error deleting guild data: ${error}`);
    throw new DbSyncError("DELETE_FAILED", "Failed to delete guild data");
  }
}

/**
 * メンバーデータを削除する
 */
export async function deleteMemberData(guildId: string, userId: string) {
  try {
    return await prisma.guildMembers.deleteMany({
      where: { guildId, userId },
    });
  } catch (error) {
    logger.error(`[db-sync] Error deleting member data: ${error}`);
    throw new DbSyncError("DELETE_FAILED", "Failed to delete member data");
  }
}

/**
 * Discord.js のオブジェクトからデータ形式に変換する関数群
 */

/**
 * Guild オブジェクトから GuildData を作成
 */
export function createGuildDataFromGuild(guild: Guild): GuildData {
  return {
    id: guild.id,
    name: guild.name,
    memberCount: guild.memberCount,
    iconUrl: guild.iconURL(),
  };
}

/**
 * Guild オブジェクトから ChannelData 配列を作成
 */
export function createChannelDataFromGuild(guild: Guild): ChannelData[] {
  return [...guild.channels.cache.values()].map((channel) => ({
    id: channel.id,
    name: channel.name,
    type: channel.type.toString(),
  }));
}

/**
 * Guild オブジェクトから MemberData 配列を作成
 */
export function createMemberDataFromGuild(guild: Guild): {
  user: UserData;
  member: MemberData;
}[] {
  return [...guild.members.cache.values()]
    .filter((member) => !member.user.bot)
    .map((member) => ({
      user: {
        id: member.user.id,
        username: member.user.username,
        discriminator: member.user.discriminator || null,
        avatarUrl: member.user.avatarURL() || null,
      },
      member: {
        nickname: member.nickname,
        joinedAt: member.joinedAt || new Date(),
      },
    }));
}

/**
 * Guild オブジェクトから RoleData 配列を作成
 */
export function createRoleDataFromGuild(guild: Guild): RoleData[] {
  return [...guild.roles.cache.values()].map((role) => ({
    id: role.id,
    name: role.name,
    color: role.colors.toString(),
    position: role.position,
    permissions: JSON.stringify(role.permissions),
    hoist: role.hoist,
    managed: role.managed,
    mentionable: role.mentionable,
  }));
}

/**
 * GuildMember オブジェクトからメンバーデータを作成
 */
export function createMemberDataFromGuildMember(member: GuildMember): {
  user: UserData;
  member: MemberData;
} {
  return {
    user: {
      id: member.user.id,
      username: member.user.username,
      discriminator: member.user.discriminator || null,
      avatarUrl: member.user.avatarURL() || null,
    },
    member: {
      nickname: member.nickname,
      joinedAt: member.joinedAt || new Date(),
    },
  };
}

/**
 * ページネーションを使って全メンバーをDBに同期する
 * 常に最大1000人分のメモリしか使わず、処理後即キャッシュから追い出す
 *
 * 【Discord APIレート制限について】
 * guild.members.list() は Discord REST API を呼び出すため、
 * バッチ間に1秒の遅延を入れてレート制限（10 req/10s）に対応している。
 * この遅延は Discord API 側の制約であり、削除不可。
 * （DB書き込みの updateMembersData は Discord API を経由しないため遅延不要）
 */
async function syncMembersInBatches(guild: Guild): Promise<Set<string>> {
  let after: string | undefined;
  let totalSynced = 0;
  const activeMemberIds = new Set<string>();

  // Discord APIからの取得単位を200に縮小
  // Raw SQLのパラメータ数上限（65535）を考慮し、1回あたりのメモリ消費を抑える
  const FETCH_LIMIT = 200;

  while (true) {
    const members = await guild.members.list({ limit: FETCH_LIMIT, after });
    if (members.size === 0) break;

    const memberData = [...members.values()]
      .filter((m) => !m.user.bot)
      .map((m) => ({
        user: {
          id: m.user.id,
          username: m.user.username,
          discriminator: m.user.discriminator || null,
          avatarUrl: m.user.avatarURL() || null,
        },
        member: {
          nickname: m.nickname,
          joinedAt: m.joinedAt || new Date(),
        },
      }));

    if (memberData.length > 0) {
      await updateMembersData(guild.id, memberData);
      totalSynced += memberData.length;
      for (const member of memberData) {
        activeMemberIds.add(member.user.id);
      }
    }

    // 処理済みのメンバーをキャッシュから即追い出す
    for (const [id] of members) {
      guild.members.cache.delete(id);
    }

    after = members.last()?.id;
    if (members.size < FETCH_LIMIT) break;

    // Discord REST API レート制限対策（guild.members.list は API コール）
    // ※ DB書き込みではないため、この遅延は削除不可
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  logger.info(`[db-sync] Synced ${totalSynced} members for "${guild.name}"`);
  return activeMemberIds;
}

/**
 * ギルドの全データを同期する
 * @param guild Discordのギルドオブジェクト
 */
export async function syncGuildAllData(guild: Guild): Promise<void> {
  try {
    const guildData = createGuildDataFromGuild(guild);
    const channels = createChannelDataFromGuild(guild);
    const roles = createRoleDataFromGuild(guild);

    await updateGuildData(guildData);
    await updateChannelsData(guild.id, channels);
    await updateRolesData(guild.id, roles);

    // ページネーションで全メンバーを同期し、有効なメンバーIDのセットを取得
    const activeMemberIds = await syncMembersInBatches(guild);

    // 不要な（Discord上から消えた）ゴーストデータを一括削除
    const activeChannelIds = channels.map((c) => c.id);
    const activeRoleIds = roles.map((r) => r.id);

    try {
      // ゴーストチャンネルに紐づくスケジュールメッセージを事前に無効化
      // Cascade削除で暗黙的に消えるのを防ぎ、ログを残す
      const ghostChannels = await prisma.guildChannels.findMany({
        where: {
          guildId: guild.id,
          id: { notIn: activeChannelIds },
        },
        select: { id: true },
      });

      if (ghostChannels.length > 0) {
        for (const channel of ghostChannels) {
          await deactivateScheduledMessagesByChannelId(channel.id);
        }
      }

      await prisma.$transaction([
        // ゴーストチャンネルに紐づくスケジュールメッセージを削除
        prisma.scheduledMessage.deleteMany({
          where: {
            guildId: guild.id,
            channelId: { notIn: activeChannelIds },
          },
        }),
        // チャンネルのクリーンアップ
        prisma.guildChannels.deleteMany({
          where: {
            guildId: guild.id,
            id: { notIn: activeChannelIds },
          },
        }),
        // ロールのクリーンアップ
        prisma.guildRoles.deleteMany({
          where: {
            guildId: guild.id,
            id: { notIn: activeRoleIds },
          },
        }),
        // メンバーのクリーンアップ
        prisma.guildMembers.deleteMany({
          where: {
            guildId: guild.id,
            userId: { notIn: Array.from(activeMemberIds) },
          },
        }),
      ]);
      logger.info(
        `[db-sync] Cleaned up ghost records for guild "${guild.name}"`,
      );
    } catch (cleanupError) {
      logger.error(
        `[db-sync] Error cleaning up ghost records: ${cleanupError}`,
      );
    }

    logger.info(`[db-sync] Synchronized guild data for "${guild.name}"`);
  } catch (error) {
    logger.error(
      `[db-sync] Error occurred during guild synchronization: ${error}`,
    );
    throw new DbSyncError("SYNC_FAILED", "Failed to synchronize guild data");
  }
}

/**
 * DBに残っているがボットが参加していないギルドのデータを削除する
 * @param activeGuildIds ボットが現在参加しているギルドIDのセット
 */
export async function cleanupGhostGuilds(
  activeGuildIds: Set<string>,
): Promise<void> {
  try {
    const dbGuilds = await prisma.guild.findMany({ select: { id: true } });

    for (const dbGuild of dbGuilds) {
      if (!activeGuildIds.has(dbGuild.id)) {
        logger.warn(
          `[db-sync] Removing ghost guild: ${dbGuild.id} (bot is no longer a member)`,
        );
        await deleteGuildData(dbGuild.id);
      }
    }
  } catch (error) {
    logger.error(`[db-sync] Error cleaning up ghost guilds: ${error}`);
  }
}
