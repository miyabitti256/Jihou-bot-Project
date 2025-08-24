import "@api";
import "./types/hono";
import app from "@api";
import { loadCommands } from "@handler/command";
import { setupDiscordEventHandlers } from "@handler/discord-events";
import { client } from "@lib/client";
import { logger } from "@lib/logger";
import { scheduleStatusUpdates, updateStatus } from "@lib/status-updater";
import { initCronJobs } from "@services/guilds/scheduled-message";
import { serve } from "bun";

const token = process.env.DISCORD_TOKEN as string;

// APIサーバーを起動
serve({
  fetch: app.fetch,
  port: 3001,
});

logger.info("API server started on http://localhost:3001");

client.on("ready", async () => {
  logger.info("Discord client connected");

  loadCommands();

  initCronJobs();

  setupDiscordEventHandlers();

  // ステータス更新の初期設定
  const startTime = new Date();
  await updateStatus(startTime);
  scheduleStatusUpdates(startTime);
});

client.login(token);
