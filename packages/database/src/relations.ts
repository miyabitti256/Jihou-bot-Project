/**
 * Drizzle ORM リレーション定義
 *
 * drizzle-kit pull で自動生成されたリレーションを src/ 配下に配置。
 * Relational Query API (db.query.xxx.findMany({ with: ... })) で使用される。
 */
import { relations } from "drizzle-orm/relations";
import {
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

export const usersRelations = relations(users, ({ many }) => ({
  coinFlips: many(coinFlip),
  jankens_challengerId: many(janken, {
    relationName: "janken_challengerId_users_id",
  }),
  jankens_opponentId: many(janken, {
    relationName: "janken_opponentId_users_id",
  }),
  scheduledMessages_createdUserId: many(scheduledMessages, {
    relationName: "scheduledMessages_createdUserId_users_id",
  }),
  scheduledMessages_lastUpdatedUserId: many(scheduledMessages, {
    relationName: "scheduledMessages_lastUpdatedUserId_users_id",
  }),
  userSettings: many(userSettings),
  omikujis: many(omikuji),
  chatThreads: many(chatThreads),
  guildMembers: many(guildMembers),
}));

export const guildsRelations = relations(guilds, ({ many }) => ({
  scheduledMessages: many(scheduledMessages),
  guildChannels: many(guildChannels),
  guildRoles: many(guildRoles),
  guildMembers: many(guildMembers),
}));

export const guildChannelsRelations = relations(
  guildChannels,
  ({ one, many }) => ({
    scheduledMessages: many(scheduledMessages),
    guild: one(guilds, {
      fields: [guildChannels.guildId],
      references: [guilds.id],
    }),
  }),
);

export const guildRolesRelations = relations(guildRoles, ({ one }) => ({
  guild: one(guilds, {
    fields: [guildRoles.guildId],
    references: [guilds.id],
  }),
}));

export const guildMembersRelations = relations(guildMembers, ({ one }) => ({
  guild: one(guilds, {
    fields: [guildMembers.guildId],
    references: [guilds.id],
  }),
  user: one(users, {
    fields: [guildMembers.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const scheduledMessagesRelations = relations(
  scheduledMessages,
  ({ one }) => ({
    guildChannel: one(guildChannels, {
      fields: [scheduledMessages.channelId],
      references: [guildChannels.id],
    }),
    createdUser: one(users, {
      fields: [scheduledMessages.createdUserId],
      references: [users.id],
      relationName: "scheduledMessages_createdUserId_users_id",
    }),
    guild: one(guilds, {
      fields: [scheduledMessages.guildId],
      references: [guilds.id],
    }),
    updatedUser: one(users, {
      fields: [scheduledMessages.lastUpdatedUserId],
      references: [users.id],
      relationName: "scheduledMessages_lastUpdatedUserId_users_id",
    }),
  }),
);

export const omikujiRelations = relations(omikuji, ({ one }) => ({
  user: one(users, {
    fields: [omikuji.userId],
    references: [users.id],
  }),
}));

export const coinFlipRelations = relations(coinFlip, ({ one }) => ({
  user: one(users, {
    fields: [coinFlip.userId],
    references: [users.id],
  }),
}));

export const jankenRelations = relations(janken, ({ one }) => ({
  challenger: one(users, {
    fields: [janken.challengerId],
    references: [users.id],
    relationName: "janken_challengerId_users_id",
  }),
  opponent: one(users, {
    fields: [janken.opponentId],
    references: [users.id],
    relationName: "janken_opponentId_users_id",
  }),
}));

export const chatThreadsRelations = relations(chatThreads, ({ one, many }) => ({
  creator: one(users, {
    fields: [chatThreads.creatorId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  thread: one(chatThreads, {
    fields: [chatMessages.threadId],
    references: [chatThreads.id],
  }),
}));
