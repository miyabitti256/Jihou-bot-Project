import path from "node:path";
import pino from "pino";

export const logger = pino({
  level: "info",

  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
        level: "info",
      },
      {
        target: "pino/file",
        options: {
          destination: path.join(process.cwd(), "logs", "app.log"),
          mkdir: true,
        },
        level: "info",
      },
    ],
  },

  base: {
    env: process.env.NODE_ENV,
    pid: process.pid,
  },
});
