import "@api";
import app from "@api";
import { serve } from "bun";
import { client } from "@lib/client";
import cron from "node-cron";
import { ActivityType, MessageFlags } from "discord.js";
import { logger } from "@lib/logger";
import { initCronJobs } from "@handler/cron-handler";
import { commands, loadCommands } from "@handler/command-handler";
import aiMessageHandler from "@handler/ai-message-handler";
import {
  syncGuildData,
  syncChannelsData,
  syncMembersData,
  syncRolesData,
  syncGuildAllData,
  syncSingleMemberData,
  deleteGuildData,
  deleteMemberData,
  createDefaultRoles,
} from "@lib/database-sync";

const token = process.env.DISCORD_TOKEN as string;
export const cronJobs = new Map<string, cron.ScheduledTask>();

// APIサーバーを起動
serve({
  fetch: app.fetch,
  port: 3001,
});

logger.info("API server started on http://localhost:3001");

/**
 * ステータス更新関数
 */
async function updateStatus(startTime: Date) {
  try {
    for (const guild of client.guilds.cache.values()) {
      await syncGuildAllData(guild);
    }
  } catch (error) {
    logger.error("ギルドデータの更新中にエラーが発生しました:", error);
  }

  const now = new Date();
  const h = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60 / 60);
  client.user?.setActivity(`${h}時間稼働中`, { type: ActivityType.Custom });
}

// Botの準備完了時
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

// コマンド実行時
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error("コマンド実行中にエラーが発生しました:", error);
    await interaction.reply({
      content: "コマンドの実行中にエラーが発生しました。",
      flags: MessageFlags.Ephemeral,
    });
  }
});

// ギルド参加時
client.on("guildCreate", async (guild) => {
  try {
    await syncGuildData(guild);
    await syncChannelsData(guild);
    await syncMembersData(guild);

    const nubekichiRole = guild.roles.cache.find(
      (role) => role.name === "ぬべ吉",
    );
    const badNubekichiRole = guild.roles.cache.find(
      (role) => role.name === "ヌベキチ└(՞ةڼ◔)」",
    );

    if (!nubekichiRole || !badNubekichiRole) {
      const defaultRoles = await createDefaultRoles(guild);

      if (defaultRoles) {
        if (!nubekichiRole) {
          await guild.roles.create({
            name: defaultRoles[0].name,
            color: defaultRoles[0].color,
          });
        }

        if (!badNubekichiRole) {
          await guild.roles.create({
            name: defaultRoles[1].name,
            color: defaultRoles[1].color,
          });
        }
      }
    }

    await syncRolesData(guild);
  } catch (error) {
    logger.error("ギルド参加時の処理でエラーが発生しました:", error);
  }
});

// ギルド退出時
client.on("guildDelete", async (guild) => {
  try {
    await deleteGuildData(guild.id);
  } catch (error) {
    logger.error("ギルド退出時の処理でエラーが発生しました:", error);
  }
});

// メンバー参加時
client.on("guildMemberAdd", async (member) => {
  if (member.user.bot) return;
  try {
    await syncSingleMemberData(member);
  } catch (error) {
    logger.error("メンバー参加時の処理でエラーが発生しました:", error);
  }
});

// メンバー退出時
client.on("guildMemberRemove", async (member) => {
  try {
    await deleteMemberData(member.guild.id, member.user.id);
  } catch (error) {
    logger.error("メンバー退出時の処理でエラーが発生しました:", error);
  }
});

// メッセージ受信時
client.on("messageCreate", async (message) => {
  await aiMessageHandler.handleMessageCreate(message);
});

// ログイン
client.login(token);
