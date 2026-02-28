import { z } from "zod";

// === 共通スキーマ ===

/** Discord ID バリデーション（Snowflake形式） */
export const discordIdSchema = z
  .string()
  .min(1)
  .regex(/^\d+$/, "Invalid ID format");

/** ページネーション */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// === パラメータスキーマ（zValidator("param", ...) 用） ===

export const guildIdParamSchema = z.object({
  guildId: discordIdSchema,
});

export const userIdParamSchema = z.object({
  userId: discordIdSchema,
});

export const channelIdParamSchema = z.object({
  channelId: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

// === クエリスキーマ（zValidator("query", ...) 用） ===

// includes enum定数
const userIncludeEnum = z.enum([
  "scheduledmessage",
  "omikuji",
  "coinflip",
  "janken",
]);

const guildIncludeEnum = z.enum(["channels", "members", "roles", "messages"]);

/** ギルド includes クエリ（配列形式対応） */
export const guildIncludesQuerySchema = z.object({
  includes: z
    .union([guildIncludeEnum, z.array(guildIncludeEnum)])
    .optional()
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }),
});

/** ユーザー includes クエリ（配列形式対応） */
export const userIncludesQuerySchema = z.object({
  includes: z
    .union([userIncludeEnum, z.array(userIncludeEnum)])
    .optional()
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }),
});

/** ユーザー一覧クエリ */
export const usersListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

/** おみくじ履歴クエリ */
export const omikujiResultQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).default(10),
});

/** コインフリップ履歴クエリ */
export const coinflipHistoryQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).default(100),
});

/** スケジュールメッセージ照会クエリ */
export const scheduledMessageQuerySchema = z.object({
  type: z.enum(["user", "guild"]).default("guild"),
});

// === ミニゲーム ===

export const coinflipPlaySchema = z.object({
  bet: z.number().int().min(1),
  choice: z.enum(["heads", "tails"]),
});

export const coinflipHistorySchema = z.object({
  userId: discordIdSchema,
  take: z.coerce.number().int().min(1).max(100).default(10),
});

// === ユーザー ===

export const userUpdateSchema = z.object({
  username: z.string().min(1),
  discriminator: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const userMoneyUpdateSchema = z.object({
  amount: z.number(),
  operation: z.enum(["add", "set"]).default("add"),
});

export const userQuerySchema = z.object({
  userId: discordIdSchema,
  includes: z
    .array(z.enum(["scheduledmessage", "omikuji", "coinflip", "janken"]))
    .default([]),
});

// === ギルド ===

export const guildIncludesSchema = z
  .array(z.enum(["channels", "members", "roles", "messages"]))
  .default([]);

// === スケジュールメッセージ ===

export const scheduledMessageCreateSchema = z.object({
  data: z.object({
    channelId: z.string().min(1),
    message: z.string().min(1).max(200),
    scheduleTime: z.string().regex(/^([01]?\d|2[0-3]):([0-5]\d)$/),
    guildId: z.string().min(1),
    userId: z.string().min(1),
  }),
});

export const scheduledMessageUpdateSchema = z.object({
  data: z.object({
    id: z.string().min(1),
    channelId: z.string().min(1).optional(),
    message: z.string().min(1).max(200).optional(),
    scheduleTime: z
      .string()
      .regex(/^([01]?\d|2[0-3]):([0-5]\d)$/)
      .optional(),
    guildId: z.string().min(1),
    userId: z.string().min(1),
    isActive: z.boolean().optional(),
  }),
});

export const scheduledMessageDeleteSchema = z.object({
  id: z.string().min(1),
  guildId: z.string().min(1),
});
