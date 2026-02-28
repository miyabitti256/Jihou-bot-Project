import aiMessageHandler from "@handler/ai-message";
import { commands } from "@handler/command";
import { client } from "@lib/client";
import { logger } from "@lib/logger";
import {
  createMemberDataFromGuildMember,
  deleteGuildData,
  deleteMemberData,
  updateChannelsData,
  updateGuildData,
  updateMembersData,
  updateRolesData,
} from "@services/db-sync/guild-sync";
import { deactivateScheduledMessagesByChannelId } from "@services/guilds/scheduled-message";
import type {
  DMChannel,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Interaction,
  Message,
  NonThreadGuildBasedChannel,
  PartialGuildMember,
  Role,
} from "discord.js";
import { MessageFlags } from "discord.js";

// デフォルトのロール設定
const DEFAULT_ROLES = [
  {
    name: "ぬべ吉",
    color: "#f0ff00" as const,
  },
  {
    name: "ヌベキチ└(՞ةڼ◔)」",
    color: "#b32be8" as const,
  },
];

/**
 * すべてのDiscordイベントハンドラを設定する
 */
export function setupDiscordEventHandlers(): void {
  // コマンド実行時
  client.on("interactionCreate", handleInteraction);

  // ギルド参加時
  client.on("guildCreate", handleGuildCreate);

  // ギルド退出時
  client.on("guildDelete", handleGuildDelete);

  // メンバー参加時
  client.on("guildMemberAdd", handleGuildMemberAdd);

  // メンバー退出時
  client.on("guildMemberRemove", handleGuildMemberRemove);

  // チャンネル削除時
  client.on("channelDelete", handleChannelDelete);

  // メッセージ受信時
  client.on("messageCreate", handleMessageCreate);

  logger.info("Setup discord event handlers");
}

/**
 * インタラクション（スラッシュコマンドなど）のハンドラ
 */
async function handleInteraction(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error({ err: error }, "コマンド実行中にエラーが発生しました:");
    await interaction.reply({
      content: "コマンドの実行中にエラーが発生しました。",
      flags: MessageFlags.Ephemeral,
    });
  }
}

/**
 * ギルド参加時のハンドラ
 */
async function handleGuildCreate(guild: Guild) {
  try {
    // ギルドデータを同期
    const guildData = {
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
      iconUrl: guild.iconURL(),
    };
    await updateGuildData(guildData);

    // チャンネルデータを同期
    const channels = [...guild.channels.cache.values()].map(
      (channel: GuildBasedChannel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type.toString(),
      }),
    );
    await updateChannelsData(guild.id, channels);

    // メンバーデータを同期
    const members = [...guild.members.cache.values()]
      .filter((member: GuildMember) => !member.user.bot)
      .map((member: GuildMember) => ({
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
    await updateMembersData(guild.id, members);

    // デフォルトのロールを作成
    const nubekichiRole = guild.roles.cache.find(
      (role: Role) => role.name === "ぬべ吉",
    );
    const badNubekichiRole = guild.roles.cache.find(
      (role: Role) => role.name === "ヌベキチ└(՞ةڼ◔)」",
    );

    if (!nubekichiRole || !badNubekichiRole) {
      if (!nubekichiRole) {
        await guild.roles.create({
          name: DEFAULT_ROLES[0].name,
          color: DEFAULT_ROLES[0].color,
        });
      }

      if (!badNubekichiRole) {
        await guild.roles.create({
          name: DEFAULT_ROLES[1].name,
          color: DEFAULT_ROLES[1].color,
        });
      }
    }

    // ロールデータを同期
    const roles = [...guild.roles.cache.values()].map((role: Role) => ({
      id: role.id,
      name: role.name,
      color: role.colors.toString(),
      position: role.position,
      permissions: JSON.stringify(role.permissions),
      hoist: role.hoist,
      managed: role.managed,
      mentionable: role.mentionable,
    }));
    await updateRolesData(guild.id, roles);
  } catch (error) {
    logger.error({ err: error }, "ギルド参加時の処理でエラーが発生しました:");
  }
}

/**
 * ギルド退出時のハンドラ
 */
async function handleGuildDelete(guild: Guild) {
  try {
    await deleteGuildData(guild.id);
  } catch (error) {
    logger.error({ err: error }, "ギルド退出時の処理でエラーが発生しました:");
  }
}

/**
 * メンバー参加時のハンドラ
 */
async function handleGuildMemberAdd(member: GuildMember) {
  if (member.user.bot) return;
  try {
    const memberData = createMemberDataFromGuildMember(member);
    await updateMembersData(member.guild.id, [memberData]);
  } catch (error) {
    logger.error({ err: error }, "メンバー参加時の処理でエラーが発生しました:");
  }
}

/**
 * メンバー退出時のハンドラ
 */
async function handleGuildMemberRemove(
  member: GuildMember | PartialGuildMember,
) {
  try {
    await deleteMemberData(member.guild.id, member.user.id);
  } catch (error) {
    logger.error({ err: error }, "メンバー退出時の処理でエラーが発生しました:");
  }
}

/**
 * チャンネル削除時のハンドラ
 */
async function handleChannelDelete(
  channel: DMChannel | NonThreadGuildBasedChannel,
) {
  // DMチャンネルの場合は無視
  if (channel.isDMBased()) return;

  try {
    await deactivateScheduledMessagesByChannelId(channel.id);
  } catch (error) {
    logger.error(
      { err: error },
      "チャンネル削除時の処理でエラーが発生しました:",
    );
  }
}

/**
 * メッセージ受信時のハンドラ
 */
async function handleMessageCreate(message: Message) {
  await aiMessageHandler.handleMessageCreate(message);
}
