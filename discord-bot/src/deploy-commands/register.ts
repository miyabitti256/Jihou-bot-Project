import { readdirSync } from "node:fs";
import { join } from "node:path";
import { REST } from "@discordjs/rest";
import { env } from "@lib/env";
import { logger } from "@lib/logger";
import { type APIApplicationCommand, Routes } from "discord-api-types/v10";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

const commands: APIApplicationCommand[] = [];
const commandFiles = readdirSync(
  join(__dirname, "..", "..", "src", "commands"),
).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = join(__dirname, "..", "..", "src", "commands", file);
  logger.info(`Loading command file: ${filePath}`);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

(async () => {
  try {
    logger.info("Started registering application (/) commands.");

    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
      body: commands,
    });

    logger.info("Successfully registered application (/) commands.");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
})();
