import { Client, IntentsBitField } from "discord.js";

import { Configuration } from "../config/config";
import messageHandler from "./messageHandler";
import interactionHandler from "./interactionHandler";

const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
});
// conectamos con el token de la api de discordjs
bot.login(Configuration.API_TOKEN);

//evento ready
bot.on("ready", (message) => {
    console.log("REM ACTIVA PAPI");
    bot.user?.setPresence({
        activities: [{ name: "Designed and coded by @katarem on GitHub" }],
        status: 'dnd',
    })
});

//cuando envian mensaje
bot.on("messageCreate", async (message) => {
    if(message.author.bot) return;
    let mensaje = await message.fetch();
    messageHandler(mensaje);
});

//cuando alguien usa un comando
bot.on("interactionCreate", (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    interactionHandler(interaction);
});

