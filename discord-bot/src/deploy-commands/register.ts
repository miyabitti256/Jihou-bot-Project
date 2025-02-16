import { readdirSync } from "node:fs";
import { join } from "node:path";
import { REST } from "@discordjs/rest";
import { Routes, type APIApplicationCommand } from "discord-api-types/v10";
import { logger } from "@lib/logger";

const token = process.env.DISCORD_TOKEN as string;
const clientId = process.env.DISCORD_CLIENT_ID as string;

const rest = new REST({ version: "10" }).setToken(token);

const commands: APIApplicationCommand[] = [];
const commandFiles = readdirSync(join(__dirname, "..", "..", "src", "commands")).filter(
  (file) => file.endsWith(".ts") || file.endsWith(".js"),
);

for (const file of commandFiles) {
  const filePath = join(__dirname, "..", "..", "src", "commands", file);
  logger.info(`Loading command file: ${filePath}`);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

(async () => {
  try {
    logger.info("Started registering application (/) commands.");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    logger.info("Successfully registered application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
