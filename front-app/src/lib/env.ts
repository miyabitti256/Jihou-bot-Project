import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url(),
  API_KEY: z.string().min(1),
  AUTH_SECRET: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
