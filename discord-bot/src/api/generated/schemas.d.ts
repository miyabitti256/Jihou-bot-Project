import { z } from "zod";
/** Discord ID バリデーション（Snowflake形式） */
export declare const discordIdSchema: z.ZodString;
/** ページネーション */
export declare const paginationSchema: z.ZodObject<
  {
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
  },
  z.core.$strip
>;
export declare const coinflipPlaySchema: z.ZodObject<
  {
    bet: z.ZodNumber;
    choice: z.ZodEnum<{
      heads: "heads";
      tails: "tails";
    }>;
  },
  z.core.$strip
>;
export declare const coinflipHistorySchema: z.ZodObject<
  {
    userId: z.ZodString;
    take: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
  },
  z.core.$strip
>;
export declare const userUpdateSchema: z.ZodObject<
  {
    username: z.ZodString;
    discriminator: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  },
  z.core.$strip
>;
export declare const userMoneyUpdateSchema: z.ZodObject<
  {
    amount: z.ZodNumber;
    operation: z.ZodDefault<
      z.ZodEnum<{
        add: "add";
        set: "set";
      }>
    >;
  },
  z.core.$strip
>;
export declare const userQuerySchema: z.ZodObject<
  {
    userId: z.ZodString;
    includes: z.ZodDefault<
      z.ZodArray<
        z.ZodEnum<{
          scheduledmessage: "scheduledmessage";
          omikuji: "omikuji";
          coinflip: "coinflip";
          janken: "janken";
        }>
      >
    >;
  },
  z.core.$strip
>;
export declare const guildIncludesSchema: z.ZodDefault<
  z.ZodArray<
    z.ZodEnum<{
      channels: "channels";
      members: "members";
      roles: "roles";
      messages: "messages";
    }>
  >
>;
