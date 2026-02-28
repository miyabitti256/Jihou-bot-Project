import { z } from "zod";

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
