import { REST } from "@discordjs/rest";
import { env } from "@lib/env";
import { logger } from "@lib/logger";
import {
  type RESTGetAPIApplicationCommandsResult,
  Routes,
} from "discord-api-types/v10";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
(async () => {
  try {
    logger.info("Started deleting application (/) commands.");

    const commands = (await rest.get(
      Routes.applicationCommands(env.DISCORD_CLIENT_ID),
    )) as RESTGetAPIApplicationCommandsResult;

    await Promise.all(
      commands.map((command) =>
        rest.delete(
          Routes.applicationCommand(env.DISCORD_CLIENT_ID, command.id),
        ),
      ),
    );

    logger.info(
      `Successfully deleted ${commands.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
})();
