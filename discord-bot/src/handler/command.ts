import { readdirSync } from "node:fs";
import path from "node:path";
import { logger } from "@bot/lib/logger";
import {
  type ChatInputCommandInteraction,
  Collection,
  type SlashCommandBuilder,
} from "discord.js";

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands = new Collection<string, Command>();

export const loadCommands = async () => {
  const commandsPath = path.join("./src/commands");
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".ts"),
  );

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = await import(filePath);
      if (!command.data || !command.execute) {
        logger.error(`Command ${file} is missing data or execute function`);
        continue;
      }

      commands.set(command.data.name, command);
      logger.info(`Loaded command ${command.data.name}`);
    } catch (error) {
      logger.error(`Error loading command ${file}: ${error}`);
    }
  }
};
