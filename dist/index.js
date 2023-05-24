"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const bot = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.GuildVoiceStates
    ]
});
bot.login(process.env.TOKEN);
var skipped = false;
var queue;
var index;
const player = (0, voice_1.createAudioPlayer)();
var voiceConnection = null;
bot.on("ready", (c) => {
    var _a;
    console.log("REM ACTIVATED TS VERSION");
    queue = new Array();
    index = 0;
    (_a = bot.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        activities: [{ name: "Designed and coded by @katarem on GitHub. Switching to ts atm." }],
        status: "dnd",
    });
});
bot.on("messageCreate", (message) => {
    if (message.author.bot)
        return;
    if (message.content.toLowerCase().replace(" ", "") === "holarem") {
        message.reply("Hola " + (0, discord_js_1.userMention)(message.author.id));
    }
    if (message.content.toLowerCase() === "que") {
        message.reply("so");
    }
    if (message.content.toLowerCase()) {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("DarkRed")
            .setTitle("Song name")
            .setDescription("the song is playing");
        message.channel.send({ embeds: [embed] });
    }
});
//# sourceMappingURL=index.js.map