import type { Guild, GuildMember } from "discord.js";
import { logger } from "./logger";

/**
 * ギルドデータをAPIを介して同期する
 */
export async function syncGuildData(guild: Guild) {
  try {
    const response = await fetch("http://localhost:3001/api/db-sync/guild", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId: guild.id,
        guildData: {
          id: guild.id,
          name: guild.name,
          memberCount: guild.memberCount,
          iconUrl: guild.iconURL() || null,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(`ギルドデータの同期エラー: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    logger.error("ギルドデータの同期に失敗:", error);
  }
}

/**
 * チャンネルデータをAPIを介して同期する
 */
export async function syncChannelsData(guild: Guild) {
  try {
    const channels = [...guild.channels.cache.values()].map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type.toString(),
    }));

    const response = await fetch("http://localhost:3001/api/db-sync/channels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId: guild.id,
        channels,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(`チャンネルデータの同期エラー: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    logger.error("チャンネルデータの同期に失敗:", error);
  }
}

/**
 * メンバーデータをAPIを介して同期する
 */
export async function syncMembersData(guild: Guild) {
  try {
    await guild.members.fetch();
    const members = [...guild.members.cache.values()]
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
          joinedAt: member.joinedAt?.toISOString() || new Date().toISOString(),
        },
      }));

    const response = await fetch("http://localhost:3001/api/db-sync/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId: guild.id,
        members,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(`メンバーデータの同期エラー: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    logger.error("メンバーデータの同期に失敗:", error);
  }
}

/**
 * ロールデータをAPIを介して同期する
 */
export async function syncRolesData(guild: Guild) {
  try {
    const roles = [...guild.roles.cache.values()].map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color.toString(),
      position: role.position,
      permissions: JSON.stringify(role.permissions),
      hoist: role.hoist,
      managed: role.managed,
      mentionable: role.mentionable,
    }));

    const response = await fetch("http://localhost:3001/api/db-sync/roles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId: guild.id,
        roles,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(`ロールデータの同期エラー: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    logger.error("ロールデータの同期に失敗:", error);
  }
}

/**
 * ギルドの全データを同期する
 */
export async function syncGuildAllData(guild: Guild) {
  await syncGuildData(guild);
  await syncChannelsData(guild);
  await syncMembersData(guild);
  await syncRolesData(guild);
  logger.info(`ギルド「${guild.name}」のデータを同期しました`);
}

/**
 * 単一メンバーのデータを同期する
 */
export async function syncSingleMemberData(member: GuildMember) {
  if (member.user.bot) return;

  try {
    const memberData = {
      user: {
        id: member.user.id,
        username: member.user.username,
        discriminator: member.user.discriminator || null,
        avatarUrl: member.user.avatarURL() || null,
      },
      member: {
        nickname: member.nickname,
        joinedAt: member.joinedAt?.toISOString() || new Date().toISOString(),
      },
    };

    const response = await fetch("http://localhost:3001/api/db-sync/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guildId: member.guild.id,
        members: [memberData],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(`新メンバーデータの同期エラー: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    logger.error("新メンバーデータの同期に失敗:", error);
  }
}

/**
 * ギルドデータを削除する
 */
export async function deleteGuildData(guildId: string) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/db-sync/guild/${guildId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error(`ギルドデータの削除エラー: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    logger.error("ギルドデータの削除に失敗:", error);
  }
}

/**
 * メンバーデータを削除する
 */
export async function deleteMemberData(guildId: string, userId: string) {
  try {
    const response = await fetch(
      `http://localhost:3001/api/db-sync/members/${guildId}/${userId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error(`メンバーデータの削除エラー: ${JSON.stringify(error)}`);
    }
  } catch (error) {
    logger.error("メンバーデータの削除に失敗:", error);
  }
}

/**
 * デフォルトのロール情報を取得する
 */
export async function createDefaultRoles(guild: Guild) {
  try {
    const response = await fetch(
      "http://localhost:3001/api/db-sync/default-roles",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guildId: guild.id,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error(`デフォルトロールの取得エラー: ${JSON.stringify(error)}`);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    logger.error("デフォルトロールの取得に失敗:", error);
    return null;
  }
}
