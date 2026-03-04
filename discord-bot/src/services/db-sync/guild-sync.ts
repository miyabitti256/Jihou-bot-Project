import { db } from "@bot/lib/db";
import { logger } from "@bot/lib/logger";
import { deactivateScheduledMessagesByChannelId } from "@bot/services/guilds/scheduled-message";
import {
  guildChannels,
  guildMembers,
  guildRoles,
  guilds,
  scheduledMessages,
  users,
} from "@jihou/database";
import type { Guild, GuildMember } from "discord.js";
import { and, eq, notInArray, sql } from "drizzle-orm";

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
    const [result] = await db
      .insert(guilds)
      .values({
        id: guildData.id,
        name: guildData.name,
        memberCount: guildData.memberCount,
        iconUrl: guildData.iconUrl || "",
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: guilds.id,
        set: {
          name: guildData.name,
          memberCount: guildData.memberCount,
          iconUrl: guildData.iconUrl || "",
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  } catch (error) {
    logger.error(`[db-sync] Error updating guild data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update guild data");
  }
}

/**
 * チャンネルデータを一括更新する（Drizzle onConflictDoUpdate版）
 *
 * Drizzle の INSERT ... ON CONFLICT DO UPDATE で1本のSQLに集約する。
 * Prisma時代のRaw SQL (pg Pool直接) を完全置換。
 */
export async function updateChannelsData(
  guildId: string,
  channels: ChannelData[],
) {
  if (channels.length === 0) return;

  try {
    await db
      .insert(guildChannels)
      .values(
        channels.map((ch) => ({
          id: ch.id,
          guildId,
          name: ch.name,
          type: ch.type,
        })),
      )
      .onConflictDoUpdate({
        target: guildChannels.id,
        set: {
          name: sql`excluded."name"`,
          type: sql`excluded."type"`,
        },
      });
  } catch (error) {
    logger.error(`[db-sync] Error updating channel data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update channel data");
  }
}

/**
 * メンバーデータを一括更新する（Drizzle onConflictDoUpdate版）
 *
 * Prisma時代は upsert が内部で SELECT + INSERT/UPDATE の2本のSQLに分解され、
 * 1000人のメンバーに対して最大4,000本のSQLが生成されメモリを圧迫していた。
 * Raw SQL (pg Pool直接) で回避していたが、Drizzle の INSERT ... ON CONFLICT DO UPDATE
 * で同等の単一SQL生成が可能になったため、ORM経由に統一。
 */
export async function updateMembersData(
  guildId: string,
  members: { user: UserData; member: MemberData }[],
) {
  if (members.length === 0) return;

  try {
    await db.transaction(async (tx) => {
      // --- users テーブルの一括 upsert ---
      await tx
        .insert(users)
        .values(
          members.map((m) => ({
            id: m.user.id,
            username: m.user.username,
            discriminator: m.user.discriminator,
            avatarUrl: m.user.avatarUrl,
            money: 1000,
            updatedAt: new Date(),
          })),
        )
        .onConflictDoUpdate({
          target: users.id,
          set: {
            username: sql`excluded."username"`,
            discriminator: sql`excluded."discriminator"`,
            avatarUrl: sql`excluded."avatarUrl"`,
            updatedAt: new Date(),
          },
        });

      // --- guild_members テーブルの一括 upsert ---
      await tx
        .insert(guildMembers)
        .values(
          members.map((m) => ({
            guildId,
            userId: m.user.id,
            nickname: m.member.nickname,
            joinedAt: m.member.joinedAt,
          })),
        )
        .onConflictDoUpdate({
          target: [guildMembers.guildId, guildMembers.userId],
          set: {
            nickname: sql`excluded."nickname"`,
            joinedAt: sql`excluded."joinedAt"`,
          },
        });
    });
  } catch (error) {
    logger.error(`[db-sync] Error updating member data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update member data");
  }
}

/**
 * ロールデータを一括更新する（Drizzle onConflictDoUpdate版）
 *
 * Prisma時代のRaw SQL (pg Pool直接) を完全置換。
 */
export async function updateRolesData(guildId: string, roles: RoleData[]) {
  if (roles.length === 0) return;

  try {
    await db
      .insert(guildRoles)
      .values(
        roles.map((role) => ({
          id: role.id,
          guildId,
          name: role.name,
          color: role.color,
          hoist: role.hoist,
          position: role.position,
          permissions: role.permissions,
          managed: role.managed,
          mentionable: role.mentionable,
        })),
      )
      .onConflictDoUpdate({
        target: guildRoles.id,
        set: {
          name: sql`excluded."name"`,
          color: sql`excluded."color"`,
          hoist: sql`excluded."hoist"`,
          position: sql`excluded."position"`,
          permissions: sql`excluded."permissions"`,
          managed: sql`excluded."managed"`,
          mentionable: sql`excluded."mentionable"`,
        },
      });
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
    const activeMessages = await db.query.scheduledMessages.findMany({
      where: and(
        eq(scheduledMessages.guildId, guildId),
        eq(scheduledMessages.isActive, true),
      ),
      columns: { id: true, channelId: true },
    });

    if (activeMessages.length > 0) {
      await db
        .update(scheduledMessages)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(
            eq(scheduledMessages.guildId, guildId),
            eq(scheduledMessages.isActive, true),
          ),
        );
      logger.warn(
        `[db-sync] Deactivated ${activeMessages.length} scheduled messages for guild: ${guildId} (guild deletion)`,
      );
    }

    // 関連データを削除するため、トランザクションを使用
    await db.transaction(async (tx) => {
      await tx
        .delete(scheduledMessages)
        .where(eq(scheduledMessages.guildId, guildId));
      await tx.delete(guildChannels).where(eq(guildChannels.guildId, guildId));
      await tx.delete(guildRoles).where(eq(guildRoles.guildId, guildId));
      await tx.delete(guildMembers).where(eq(guildMembers.guildId, guildId));
      await tx.delete(guilds).where(eq(guilds.id, guildId));
    });
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
    await db
      .delete(guildMembers)
      .where(
        and(eq(guildMembers.guildId, guildId), eq(guildMembers.userId, userId)),
      );
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
  // Drizzleのパラメータ数上限を考慮し、1回あたりのメモリ消費を抑える
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
      const ghostChannels = await db.query.guildChannels.findMany({
        where: and(
          eq(guildChannels.guildId, guild.id),
          notInArray(guildChannels.id, activeChannelIds),
        ),
        columns: { id: true },
      });

      if (ghostChannels.length > 0) {
        for (const channel of ghostChannels) {
          await deactivateScheduledMessagesByChannelId(channel.id);
        }
      }

      await db.transaction(async (tx) => {
        // ゴーストチャンネルに紐づくスケジュールメッセージを削除
        await tx
          .delete(scheduledMessages)
          .where(
            and(
              eq(scheduledMessages.guildId, guild.id),
              notInArray(scheduledMessages.channelId, activeChannelIds),
            ),
          );
        // チャンネルのクリーンアップ
        await tx
          .delete(guildChannels)
          .where(
            and(
              eq(guildChannels.guildId, guild.id),
              notInArray(guildChannels.id, activeChannelIds),
            ),
          );
        // ロールのクリーンアップ
        await tx
          .delete(guildRoles)
          .where(
            and(
              eq(guildRoles.guildId, guild.id),
              notInArray(guildRoles.id, activeRoleIds),
            ),
          );
        // メンバーのクリーンアップ
        await tx
          .delete(guildMembers)
          .where(
            and(
              eq(guildMembers.guildId, guild.id),
              notInArray(guildMembers.userId, Array.from(activeMemberIds)),
            ),
          );
      });
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
    const dbGuilds = await db.query.guilds.findMany({
      columns: { id: true },
    });

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
