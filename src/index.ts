import { Client, IntentsBitField, userMention } from "discord.js";

import { config } from "../config/config";
import messageHandler from "./message/messageHandler";
import interactionHandler from "./interactionHandler";
import DatabaseService from "./database";
import { commandDeploy } from "./commandDeploy";
import prepareCommands from "./commands/commands";

const service = DatabaseService.getInstance();
const commands = prepareCommands();

const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent
    ],
});
// conectamos con el token de la api de discordjs
bot.login(config.API_TOKEN);

//evento ready
bot.on("ready", async () => {
    console.log("rem active for fighting");
    bot.user?.setPresence({
        activities: [{ name: "Designed and coded by @katarem on GitHub" }],
        status: 'dnd',
    });

    const guilds = await bot.guilds.fetch();
    guilds.forEach(async (guild) => {
        const existsAlready = await service.fetchGuild(guild.id);
        if(existsAlready.length === 0)
            service.saveGuild(guild);
        await commandDeploy(commands, guild.id);
    });
});

//cuando envian mensaje
bot.on("messageCreate", async (message) => {
    if(message.author.bot) return;
    if(!bot.user) return;
    if(!message.mentions.has(bot.user?.id)) return;
    let mensaje = await message.fetch();
    messageHandler(mensaje);
});

//cuando alguien usa un comando
bot.on("interactionCreate", (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    interactionHandler(interaction);
});
