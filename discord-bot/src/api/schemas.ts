import { z } from "zod";

// === 共通スキーマ ===

/** Discord ID バリデーション（Snowflake形式） */
export const discordIdSchema = z.string().min(1).regex(/^\d+$/, "Invalid ID format");

/** ページネーション */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
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
    .array(
        z.enum([
            "channels",
            "members",
            "roles",
            "messages",
        ]),
    )
    .default([]);
