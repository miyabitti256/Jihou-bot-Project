import { prisma } from "@lib/prisma";
import { logger } from "@lib/logger";

type GuildData = {
  id: string;
  name: string;
  memberCount: number;
  iconUrl: string | null;
};

type ChannelData = {
  id: string;
  name: string;
  type: string;
};

type UserData = {
  id: string;
  username: string;
  discriminator: string | null;
  avatarUrl: string | null;
};

type MemberData = {
  nickname: string | null;
  joinedAt: Date;
};

type RoleData = {
  id: string;
  name: string;
  color: string;
  position: number;
  permissions: string;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
};

export async function updateGuildData(guildData: GuildData) {
  return prisma.guild.upsert({
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
}

export async function updateChannelsData(
  guildId: string,
  channels: ChannelData[],
) {
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
}

export async function updateMembersData(
  guildId: string,
  members: { user: UserData; member: MemberData }[],
) {
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
}

export async function updateRolesData(guildId: string, roles: RoleData[]) {
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
}

export async function createDefaultRoles(guildId: string) {
  // デフォルトのロールデータを返す（クライアント側で作成するため）
  return [
    {
      name: "ぬべ吉",
      color: "#f0ff00",
    },
    {
      name: "ヌベキチ└(՞ةڼ◔)」",
      color: "#b32be8",
    },
  ];
}
