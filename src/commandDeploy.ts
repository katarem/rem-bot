import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { config } from "../config/config";

export async function commandDeploy(commands: RESTPostAPIChatInputApplicationCommandsJSONBody[], guildId: string): Promise<any> {
    const rest = new REST().setToken(config.API_TOKEN);
    rest.put(
        Routes.applicationGuildCommands(config.CLIENT_ID, guildId),
        { body: commands }
    );
}