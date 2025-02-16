import { spawn } from "node:child_process";
import { join } from "node:path";
import { logger } from "./lib/logger";

const botScript = join(import.meta.dir, "index.ts");
const RESTART_DELAY = 5000;

function startBot() {
  const bot = spawn("bun", ["run", botScript], { stdio: "inherit" });

  bot.on("close", (code) => {
    logger.error(`Botプロセスがコード${code}で終了しました`);
    logger.info("Botを再起動しています...");

    setTimeout(() => {
      logger.info("Botを再起動しています...");
      startBot();
    }, RESTART_DELAY);
  });
}

startBot();
