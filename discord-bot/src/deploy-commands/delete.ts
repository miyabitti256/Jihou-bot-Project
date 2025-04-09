import { REST } from "@discordjs/rest";
import { logger } from "@lib/logger";
import { Routes } from "discord-api-types/v10";

const token = process.env.DISCORD_TOKEN as string;
const clientId = process.env.DISCORD_CLIENT_ID as string;

const rest = new REST({ version: "10" }).setToken(token);
(async () => {
  try {
    logger.info("Started deleting application (/) commands.");

    const commands = (await rest.get(
      Routes.applicationCommands(clientId),
    )) as Array<{ id: string }>;

    await Promise.all(
      commands.map((command) =>
        rest.delete(Routes.applicationCommand(clientId, command.id)),
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
