require("dotenv").config();

import playdl from "play-dl";
import { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioResource, AudioPlayerStatus, NoSubscriberBehavior } from "@discordjs/voice";
import { Client, EmbedBuilder, IntentsBitField, userMention } from "discord.js";
import Song from "./objs/song";

const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

bot.login(process.env.TOKEN);

var skipped: boolean = false;
var queue:Array<Song>;
var index: number;
const player = createAudioPlayer();
var voiceConnection = null;

bot.on("ready", (c) => {
    console.log("REM ACTIVATED TS VERSION");
    queue = new Array<Song>();
    index = 0;
    bot.user?.setPresence({
        activities: [{name: "Designed and coded by @katarem on GitHub. Switching to ts atm."}],
        status: "dnd",
    });
});

bot.on("messageCreate", (message) => {
    if(message.author.bot) return;
    if(message.content.toLowerCase().replace(" ", "") === "holarem"){
        message.reply("Hola " + userMention(message.author.id));
    }
    if(message.content.toLowerCase() === "que"){
        message.reply("so");
    }
    if(message.content.toLowerCase()){
        const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle("Song name")
      .setDescription("the song is playing");
    message.channel.send({ embeds: [embed] });
  }
});

