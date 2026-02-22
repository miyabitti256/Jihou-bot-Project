import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";
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
 */
export async function updateChannelsData(
  guildId: string,
  channels: ChannelData[],
) {
  try {
    const results = [];

    for (const channel of channels) {
      const result = await prisma.guildChannels.upsert({
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
      });
      results.push(result);
      // レート制限を回避するための遅延
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  } catch (error) {
    logger.error(`[db-sync] Error updating channel data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update channel data");
  }
}

/**
 * メンバーデータを更新する
 */
export async function updateMembersData(
  guildId: string,
  members: { user: UserData; member: MemberData }[],
) {
  try {
    const results = [];

    for (const { user, member } of members) {
      const result = await prisma.$transaction([
        prisma.users.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatarUrl: user.avatarUrl,
          },
          update: {
            username: user.username,
            discriminator: user.discriminator,
            avatarUrl: user.avatarUrl,
          },
        }),
        prisma.guildMembers.upsert({
          where: {
            guildId_userId: { guildId: guildId, userId: user.id },
          },
          create: {
            guildId: guildId,
            userId: user.id,
            nickname: member.nickname,
            joinedAt: member.joinedAt,
          },
          update: {
            nickname: member.nickname,
            joinedAt: member.joinedAt,
          },
        }),
      ]);

      results.push(result);
      // レート制限を回避するための遅延
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  } catch (error) {
    logger.error(`[db-sync] Error updating member data: ${error}`);
    throw new DbSyncError("UPDATE_FAILED", "Failed to update member data");
  }
}

/**
 * ロールデータを更新する
 */
export async function updateRolesData(guildId: string, roles: RoleData[]) {
  try {
    const results = [];

    for (const role of roles) {
      const result = await prisma.guildRoles.upsert({
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
      });

      results.push(result);
      // レート制限を回避するための遅延
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
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
    // 関連データを削除するため、トランザクションを使用
    return await prisma.$transaction([
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
    return await prisma.guildMembers.delete({
      where: {
        guildId_userId: { guildId, userId },
      },
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
    color: role.color.toString(),
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
 */
async function syncMembersInBatches(guild: Guild): Promise<void> {
  let after: string | undefined = undefined;
  let totalSynced = 0;

  while (true) {
    const members = await guild.members.list({ limit: 1000, after });
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
    }

    // 処理済みのメンバーをキャッシュから即追い出す
    for (const [id] of members) {
      guild.members.cache.delete(id);
    }

    after = members.last()?.id;
    if (members.size < 1000) break;

    // Discord REST APIレート制限対策
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  logger.info(
    `[db-sync] Synced ${totalSynced} members for "${guild.name}"`,
  );
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

    // ページネーションで全メンバーを同期
    await syncMembersInBatches(guild);

    logger.info(`[db-sync] Synchronized guild data for "${guild.name}"`);
  } catch (error) {
    logger.error(
      `[db-sync] Error occurred during guild synchronization: ${error}`,
    );
    throw new DbSyncError("SYNC_FAILED", "Failed to synchronize guild data");
  }
}
