import { z } from "zod";

const envSchema = z.object({
  // Discord
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),

  // API
  API_KEY: z.string().min(1),

  // Database
  DATABASE_URL: z.string().min(1),

  // External services
  GEMINI_API_KEY: z.string().min(1).optional(),

  // Runtime
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
});

export const env = envSchema.parse(process.env);
