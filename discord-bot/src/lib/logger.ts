import { env } from "@bot/lib/env";
import pino from "pino";

const isProduction = env.NODE_ENV === "production";

export const logger = pino({
  level: "info",

  // production: Worker Thread なしの JSON 直接出力（メモリ最小化）
  // development: pino-pretty で人間に読みやすい出力
  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
          },
        },
      }),

  base: {
    pid: process.pid,
  },
});
