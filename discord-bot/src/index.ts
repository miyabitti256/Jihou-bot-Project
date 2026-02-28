import "@bot/api";
import app from "@bot/api";
import { loadCommands } from "@bot/handler/command";
import { setupDiscordEventHandlers } from "@bot/handler/discord-events";
import { client } from "@bot/lib/client";
import { env } from "@bot/lib/env";
import { logger } from "@bot/lib/logger";
import { scheduleStatusUpdates, updateStatus } from "@bot/lib/status-updater";
import { startScheduledMessageDispatcher } from "@bot/services/guilds/scheduled-message";
import { serve } from "bun";
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
