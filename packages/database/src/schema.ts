/**
 * Drizzle ORM スキーマ定義
 *
 * drizzle-kit pull で既存DBから自動生成し、以下を手動調整:
 * - _prisma_migrations テーブルの除外
 * - timestamp の mode を 'date' に統一（既存コードとの互換性）
 * - scheduledMessages.time → scheduleTime プロパティエイリアス
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────

export const chatRoleEnum = pgEnum("ChatRole", ["SYSTEM", "USER", "ASSISTANT"]);
export const themeEnum = pgEnum("theme", ["system", "light", "dark"]);

// ─── Tables ──────────────────────────────────────────────

export const guilds = pgTable(
  "guilds",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    memberCount: integer().notNull(),
    iconUrl: text(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("guilds_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const guildChannels = pgTable(
  "guild_channels",
  {
    id: text().primaryKey().notNull(),
    guildId: text().notNull(),
    name: text().notNull(),
    type: text().notNull(),
  },
  (table) => [
    uniqueIndex("guild_channels_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.guildId],
      foreignColumns: [guilds.id],
      name: "guild_channels_guildId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const guildRoles = pgTable(
  "guild_roles",
  {
    id: text().primaryKey().notNull(),
    guildId: text().notNull(),
    name: text().notNull(),
    color: text().notNull(),
    hoist: boolean().notNull(),
    position: integer().notNull(),
    permissions: text().notNull(),
    managed: boolean().notNull(),
    mentionable: boolean().notNull(),
  },
  (table) => [
    uniqueIndex("guild_roles_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.guildId],
      foreignColumns: [guilds.id],
      name: "guild_roles_guildId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const guildMembers = pgTable(
  "guild_members",
  {
    guildId: text().notNull(),
    userId: text().notNull(),
    nickname: text(),
    joinedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.guildId],
      foreignColumns: [guilds.id],
      name: "guild_members_guildId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "guild_members_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    primaryKey({
      columns: [table.guildId, table.userId],
      name: "guild_members_pkey",
    }),
  ],
);

export const users = pgTable(
  "users",
  {
    id: text().primaryKey().notNull(),
    username: text().notNull(),
    discriminator: text(),
    avatarUrl: text(),
    money: integer().default(1000).notNull(),
    lastDraw: timestamp({ precision: 3, mode: "date" }),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("users_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const userSettings = pgTable(
  "user_settings",
  {
    userId: text().notNull(),
    theme: themeEnum().default("system").notNull(),
    locale: text(),
    published: boolean().default(false).notNull(),
  },
  (table) => [
    uniqueIndex("user_settings_userId_key").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_settings_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const scheduledMessages = pgTable(
  "scheduled_messages",
  {
    id: text().primaryKey().notNull(),
    channelId: text().notNull(),
    message: text().notNull(),
    /** DBカラム名は "time" だが、既存コードとの互換性のためプロパティ名は scheduleTime */
    scheduleTime: text("time").notNull(),
    createdUserId: text().notNull(),
    lastUpdatedUserId: text().notNull(),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    guildId: text().notNull(),
  },
  (table) => [
    uniqueIndex("scheduled_messages_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.channelId],
      foreignColumns: [guildChannels.id],
      name: "scheduled_messages_channelId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.createdUserId],
      foreignColumns: [users.id],
      name: "scheduled_messages_createdUserId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.guildId],
      foreignColumns: [guilds.id],
      name: "scheduled_messages_guildId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.lastUpdatedUserId],
      foreignColumns: [users.id],
      name: "scheduled_messages_lastUpdatedUserId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const omikuji = pgTable(
  "omikuji",
  {
    id: text().primaryKey().notNull(),
    userId: text().notNull(),
    result: text().notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("omikuji_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "omikuji_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const coinFlip = pgTable(
  "coin_flip",
  {
    id: text().primaryKey().notNull(),
    userId: text().notNull(),
    bet: integer().notNull(),
    win: boolean().notNull(),
    updatedMoney: integer().notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("coin_flip_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "coin_flip_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const janken = pgTable(
  "janken",
  {
    id: text().primaryKey().notNull(),
    bet: boolean().notNull(),
    challengerId: text().notNull(),
    opponentId: text().notNull(),
    challengerHand: text().notNull(),
    opponentHand: text().notNull(),
    challengerBet: integer(),
    opponentBet: integer(),
    winnerUserId: text(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("challenger_id_idx").using(
      "btree",
      table.challengerId.asc().nullsLast().op("text_ops"),
    ),
    uniqueIndex("janken_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    index("opponent_id_idx").using(
      "btree",
      table.opponentId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.challengerId],
      foreignColumns: [users.id],
      name: "janken_challengerId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.opponentId],
      foreignColumns: [users.id],
      name: "janken_opponentId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const chatThreads = pgTable(
  "chat_threads",
  {
    id: text().primaryKey().notNull(),
    title: text(),
    guildId: text().notNull(),
    channelId: text().notNull(),
    creatorId: text().notNull(),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    index("channel_id_idx").using(
      "btree",
      table.channelId.asc().nullsLast().op("text_ops"),
    ),
    uniqueIndex("chat_threads_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [users.id],
      name: "chat_threads_creatorId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
  ],
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: text().primaryKey().notNull(),
    threadId: text().notNull(),
    content: text().notNull(),
    role: chatRoleEnum().notNull(),
    tokenCount: integer().notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    uniqueIndex("chat_messages_id_key").using(
      "btree",
      table.id.asc().nullsLast().op("text_ops"),
    ),
    index("thread_id_idx").using(
      "btree",
      table.threadId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.threadId],
      foreignColumns: [chatThreads.id],
      name: "chat_messages_threadId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ],
);
