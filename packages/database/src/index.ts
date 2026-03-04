/**
 * @jihou/database
 *
 * Drizzle ORMスキーマ・推論型・Enumをまとめてエクスポートする。
 * discord-bot と front-app（shared-types経由）の両方から参照される。
 */

// リレーション定義
export * from "./relations";
// スキーマ定義（テーブル・Enum）
export {
  chatMessages,
  chatRoleEnum,
  chatThreads,
  coinFlip,
  guildChannels,
  guildMembers,
  guildRoles,
  guilds,
  janken,
  omikuji,
  scheduledMessages,
  themeEnum,
  userSettings,
  users,
} from "./schema";

// ─── モデル型（Prisma生成型の代替: $inferSelect） ──────────
import type {
  chatMessages,
  chatThreads,
  coinFlip,
  guildChannels,
  guildMembers,
  guildRoles,
  guilds,
  janken,
  omikuji,
  scheduledMessages,
  userSettings,
  users,
} from "./schema";

export type Guild = typeof guilds.$inferSelect;
export type GuildChannels = typeof guildChannels.$inferSelect;
export type GuildRoles = typeof guildRoles.$inferSelect;
export type GuildMembers = typeof guildMembers.$inferSelect;
export type Users = typeof users.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type ScheduledMessage = typeof scheduledMessages.$inferSelect;
export type Omikuji = typeof omikuji.$inferSelect;
export type CoinFlip = typeof coinFlip.$inferSelect;
export type Janken = typeof janken.$inferSelect;
export type ChatThread = typeof chatThreads.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

// ─── Enum 値オブジェクト（既存コードとの互換性維持） ─────

/**
 * ChatRole Enum
 * 既存コード: ChatRole.USER, ChatRole.ASSISTANT, ChatRole.SYSTEM
 */
export const ChatRole = {
  SYSTEM: "SYSTEM",
  USER: "USER",
  ASSISTANT: "ASSISTANT",
} as const;
export type ChatRole = (typeof ChatRole)[keyof typeof ChatRole];
