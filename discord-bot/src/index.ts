import "@api";
import app from "@api";
import { serve } from "bun";
import { client } from "@lib/client";
import cron from "node-cron";
import {
  ActivityType,
  ChannelType,
  MessageFlags,
  ThreadChannel,
  type Guild,
  type GuildMember,
  type Role,
  type User,
} from "discord.js";
import { prisma } from "@lib/prisma";
import { logger } from "@lib/logger";
import { initCronJobs } from "@handler/cron-handler";
import { commands, loadCommands } from "@handler/command-handler";
import aiMessageHandler from "@handler/ai-message-handler";

const token = process.env.DISCORD_TOKEN as string;
export const cronJobs = new Map<string, cron.ScheduledTask>();

serve({
  fetch: app.fetch,
  port: 3001,
});

logger.info("API server started on http://localhost:3001");

async function updateGuild(guild: Guild) {
  return prisma.guild.upsert({
    where: { id: guild.id },
    create: {
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
      iconUrl: guild.iconURL() || "",
    },
    update: {
      name: guild.name,
      memberCount: guild.memberCount,
      iconUrl: guild.iconURL() || "",
    },
  });
}

async function updateChannels(guild: Guild) {
  const channels = [...guild.channels.cache.values()];
  for (const channel of channels) {
    if (!channel) continue;

    await prisma.guildChannels.upsert({
      where: { id: channel.id },
      create: {
        id: channel.id,
        guildId: guild.id,
        name: channel.name,
        type: channel.type.toString(),
      },
      update: {
        name: channel.name,
        type: channel.type.toString(),
      },
    });
    await sleep(200);
  }
}

async function updateMembers(guild: Guild) {
  await guild.members.fetch();
  const members = [...guild.members.cache.values()].filter(
    (member) => !member.user.bot,
  );

  for (const member of members) {
    await prisma.$transaction([
      prisma.users.upsert({
        where: { id: member.user.id },
        create: createUserData(member.user),
        update: createUserData(member.user),
      }),
      prisma.guildMembers.upsert({
        where: {
          guildId_userId: { guildId: guild.id, userId: member.user.id },
        },
        create: createGuildMemberData(guild.id, member),
        update: createGuildMemberData(guild.id, member),
      }),
    ]);
    await sleep(200);
  }
}

async function updateRoles(guild: Guild) {
  const roles = [...guild.roles.cache.values()];
  for (const role of roles) {
    await prisma.guildRoles.upsert({
      where: { id: role.id },
      create: createRoleData(guild.id, role),
      update: createRoleData(guild.id, role),
    });
    await sleep(200);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createUserData = (user: User) => ({
  id: user.id,
  username: user.username,
  discriminator: user.discriminator || null,
  avatarUrl: user.avatarURL() || null,
});

const createGuildMemberData = (guildId: string, member: GuildMember) => ({
  guildId,
  userId: member.user.id,
  nickname: member.nickname,
  joinedAt: member.joinedAt || new Date(),
});

const createRoleData = (guildId: string, role: Role) => ({
  id: role.id,
  guildId,
  name: role.name,
  color: role.color.toString(),
  position: role.position,
  permissions: JSON.stringify(role.permissions),
  hoist: role.hoist,
  managed: role.managed,
  mentionable: role.mentionable,
});

async function updateStatus(startTime: Date) {
  try {
    for (const guild of client.guilds.cache.values()) {
      await updateGuild(guild);
      await updateChannels(guild);
      await updateMembers(guild);
      await updateRoles(guild);
      logger.info(`Updated ${guild.name} data`);
    }
  } catch (error) {
    logger.error("Error updating guild data:", error);
    console.error(error);
  }

  const now = new Date();
  const h = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60 / 60);
  client.user?.setActivity(`${h}時間稼働中`, { type: ActivityType.Custom });
}

client.on("ready", async () => {
  logger.info("Discord client connected");
  initCronJobs();
  loadCommands();
  const startTime = new Date();
  await updateStatus(startTime);
  cron.schedule(
    `${startTime.getSeconds()} ${startTime.getMinutes()} * * * *`,
    async () => {
      await updateStatus(startTime);
    },
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error("Error executing command:", error);
    await interaction.reply({
      content: "コマンドの実行中にエラーが発生しました。",
      flags: MessageFlags.Ephemeral,
    });
  }
});

client.on("guildCreate", async (guild) => {
  try {
    await updateGuild(guild);
    await updateChannels(guild);
    await updateMembers(guild);

    const nubekichiRole = guild.roles.cache.find(
      (role) => role.name === "ぬべ吉",
    );
    const badNubekichiRole = guild.roles.cache.find(
      (role) => role.name === "ヌベキチ└(՞ةڼ◔)」",
    );

    if (!nubekichiRole) {
      await guild.roles.create({
        name: "ぬべ吉",
        color: "#f0ff00",
      });
    }
    if (!badNubekichiRole) {
      await guild.roles.create({
        name: "ヌベキチ└(՞ةڼ◔)」",
        color: "#b32be8",
      });
    }

    await updateRoles(guild);
  } catch (error) {
    logger.error("Error creating guild:", error);
  }
});

client.on("guildDelete", async (guild) => {
  try {
    await prisma.$transaction([
      prisma.guild.delete({ where: { id: guild.id } }),
      prisma.guildChannels.deleteMany({ where: { guildId: guild.id } }),
      prisma.guildRoles.deleteMany({ where: { guildId: guild.id } }),
      prisma.guildMembers.deleteMany({ where: { guildId: guild.id } }),
    ]);
  } catch (error) {
    logger.error("Error deleting guild:", error);
  }
});

client.on("guildMemberAdd", async (member) => {
  if (member.user.bot) return;

  try {
    await prisma.$transaction([
      prisma.users.upsert({
        where: { id: member.user.id },
        create: createUserData(member.user),
        update: createUserData(member.user),
      }),
      prisma.guildMembers.upsert({
        where: {
          guildId_userId: { userId: member.user.id, guildId: member.guild.id },
        },
        create: createGuildMemberData(member.guild.id, member),
        update: createGuildMemberData(member.guild.id, member),
      }),
    ]);
  } catch (error) {
    logger.error("Error creating guild member:", error);
  }
});

client.on("guildMemberRemove", async (member) => {
  try {
    await prisma.guildMembers.delete({
      where: {
        guildId_userId: {
          guildId: member.guild.id,
          userId: member.user.id,
        },
      },
    });
  } catch (error) {
    logger.error("Error deleting guild member:", error);
  }
});

// AIメッセージハンドラーを使用してmessageCreateイベントを処理
client.on("messageCreate", async (message) => {
  await aiMessageHandler.handleMessageCreate(message);
});

client.login(token);
