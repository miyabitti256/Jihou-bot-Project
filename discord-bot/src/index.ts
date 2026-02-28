import "@/api";
import { serve } from "bun";
import app from "@/api";
import { loadCommands } from "@/handler/command";
import { setupDiscordEventHandlers } from "@/handler/discord-events";
import { client } from "@/lib/client";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { scheduleStatusUpdates, updateStatus } from "@/lib/status-updater";
import { startScheduledMessageDispatcher } from "@/services/guilds/scheduled-message";
import "./types/hono";

const token = env.DISCORD_TOKEN;

// APIサーバーを起動
serve({
  fetch: app.fetch,
  port: 3001,
});

logger.info("API server started on http://localhost:3001");

client.on("clientReady", async () => {
  logger.info("Discord client connected");

  loadCommands();

  startScheduledMessageDispatcher();

  setupDiscordEventHandlers();

  // ステータス更新の初期設定
  const startTime = new Date();
  await updateStatus(startTime);
  scheduleStatusUpdates(startTime);
});

client.login(token);
