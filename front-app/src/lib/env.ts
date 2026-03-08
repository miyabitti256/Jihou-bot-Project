import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url(),
  API_KEY: z.string().min(1),
  AUTH_SECRET: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "production"]),
});

export const env = envSchema.parse(process.env);
