/**
 * @jihou/database
 *
 * Prisma生成型・Enum・名前空間をまとめてエクスポートする。
 * discord-bot と front-app（shared-types経由）の両方から参照される。
 */

// モデル型
export type {
  ChatMessage,
  ChatThread,
  CoinFlip,
  Guild,
  GuildChannels,
  GuildMembers,
  GuildRoles,
  Janken,
  JankenRoom,
  Omikuji,
  ScheduledMessage,
  UserSettings,
  Users,
} from "./generated/client/client";
// Prisma Client クラス
// Prisma 名前空間（SortOrder, WhereInput 等）
// Enum
export {
  ChatRole,
  Prisma,
  PrismaClient,
  platform,
  RoomStatus,
  theme,
} from "./generated/client/client";
