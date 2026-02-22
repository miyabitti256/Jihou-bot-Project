import { Client, GatewayIntentBits, Options } from "discord.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  makeCache: Options.cacheWithLimits({
    // メッセージはキャッシュしない（AIハンドラはMessageオブジェクトを直接受け取るので問題なし）
    MessageManager: 0,
    // メンバーは直近200人/サーバーのみ（イベント処理に必要な分）
    // 200人超はguildMemberAddイベントで個別にupsert、全員同期はバッチで実施
    GuildMemberManager: 200,
    // Userオブジェクトは GuildMember 経由で参照できるためキャッシュ不要
    UserManager: 0,
    // 以下は未使用機能
    ReactionManager: 0,
    GuildInviteManager: 0,
    GuildScheduledEventManager: 0,
    StageInstanceManager: 0,
  }),
});
