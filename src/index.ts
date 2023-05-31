require("dotenv").config();

import playdl, { SoundCloudStream, YouTubeStream } from "play-dl";
import { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";
import { Client, EmbedBuilder, GuildMember, IntentsBitField, User, userMention } from "discord.js";
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
var voiceConnection: VoiceConnection;

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

    if(message.content.toLowerCase() === "status"){
      message.reply("estado: " + player.state.status);
    }

    if(message.content.toLowerCase().replace(" ", "") === "holarem"){
        message.reply("Hola " + userMention(message.author.id));
    }
    if(message.content.toLowerCase() === "que"){
        message.reply("so");
    }
    if(message.content.toLowerCase() === ""){
        const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle("Song name")
      .setDescription("the song is playing");
    message.channel.send({ embeds: [embed] });
  }
});

bot.on("interactionCreate", (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === "help"){
        interaction.reply(
            "These are all the commands I have:\n" +
              "/hello   I will say you hello back\n" +
              "/help    Displays this help\n" +
              "/camellos    I calculate how many camels do you cost\n" +
              "/dados   I will throw you the dice amount with the size you want, if you don't give any argument, I'll throw 1 six-sided dice.\n" +
              "/play    Plays one song you want to search on YouTube, you can use YouTube video url's and playlists too. If a song is already playing, it will be added to the queue\n" +
              "/resume  Will unpause the player\n" +
              "/pause Will pause the player\n" +
              "/skip    Will skip the current song to the next one\n" +
              "/stop    Will stop the music and I'll exit the voice channel\n" +
              "/clear   Will clear the music queue"
          );
    }
    if (interaction.commandName === "camellos") {
        const number: number = Math.floor(Math.random() * 100);
        const usr: User = interaction.user;
        if (number === 1)
          interaction.reply(userMention(usr.id) + " vale " + number + " camello.");
        else if (number === 0)
          interaction.reply(userMention(usr.id) + " no vales ni un camello colega");
        else
          interaction.reply(userMention(usr.id) + " vale " + number + " camellos.");
      }
    
      if (interaction.commandName === "dados") {
        const numDados: number = interaction.options.getInteger("dados") ?? 1;
        const numCaras: number = interaction.options.getInteger("caras") ?? 6;
    
        var numeroTotal: number = 0;
        for (let i = 0; i < numDados; i++) {
          numeroTotal += Math.floor(Math.random() * numCaras + 1);
        }
        interaction.reply(
          ":control_knobs: " +
            userMention(interaction.user.id) +
            " ha sacado " +
            numeroTotal +
            " de " +
            numDados +
            " dados de " +
            numCaras +
            " caras!"
        );
      };
      if (interaction.commandName === "play") {
        const member = <GuildMember>interaction.member;
        voiceConnection = joinVoiceChannel({
          channelId: member.voice.channel!.id,
          guildId: interaction.guild!.id,
          adapterCreator: interaction.guild!.voiceAdapterCreator,
        });
        voiceConnection.subscribe(player);

        const url: string = interaction.options.getString("url")!;
    
        interaction.reply(":white_check_mark: Command received!");
        
        checkType(url);
    
        player.on("error", (error) => {
          interaction.channel!.send(":no_entry_sign: error!");
          console.log(error.name);
        });

        player.on(AudioPlayerStatus.Idle, () => {
          console.log("idle");
          if (index+1 === queue.length) {
            index = 0;
            queue = new Array<Song>;
            skipped = false;
            player.stop();
            if (voiceConnection != null) voiceConnection.disconnect();
          }
          else if(!skipped){
            skipped = true;
            skip();
          }
        });
    
        player.on(AudioPlayerStatus.Playing, () => {
          console.log("playing");
          skipped = false;
        });
      }
      if (interaction.commandName === "pause") {
        interaction.reply(":pause_button:  Paused player");
        player.pause();
      }
      if(interaction.commandName === "list"){

        let list: string = ":scroll: This is the current playlist:\n";
        for (let i = 0; i < queue.length; i++) {
          if(i=== index)
            list += ":arrow_right: " + queue[i].getTitle() + "\n";
          else
            list += queue[i].getTitle() + "\n";
        }
        interaction.reply(list);
      }
      if (interaction.commandName === "stop") {
        interaction.reply(":stop_button:  Player exiting");
        index = 0;
        queue = new Array<Song>;
        skipped = false;
        player.stop();
        if (voiceConnection != null) voiceConnection.disconnect();
      }
      if (interaction.commandName === "resume") {
        interaction.reply(":arrow_forward:  Resuming player");
        player.unpause();
      }
      if (interaction.commandName === "skip") {
        interaction.reply(":fast_forward:  Skipping song");
        skip();
      }
    
      if (interaction.commandName === "clear") {
        interaction.reply(":broom:  Cleared queue");
        clear();
      }
    
      function skip() {
        if (index < queue.length - 1) {
          index++;
          console.log("reproduciendo " + index);
          displaySong(queue[index].getTitle());
          player.play(queue[index].getRes());
        } 
      }
    
      function displaySong(songName: string | undefined) {
        interaction.channel!.send(":musical_note:  Now playing: " + songName);
      }
    
      function clear() {
        queue.length = 0;
        index = 0;
      }
    
      async function checkType(url: string) {
        var stream: YouTubeStream | SoundCloudStream;
        const data = await playdl.validate(url);
        try {
          switch (data) {
            case "yt_playlist":
              interaction.channel!.send(":inbox_tray:  Adding playlist...");
              preparePlaylist(url);
              break;
            case "yt_video":
              stream = await playdl.stream(url);
              prepareSong(stream, url);
              break;
            default:
              interaction.channel!.send(":mag:  Searching song...");
              const yt_info = await playdl.search(url, {
                limit: 1,
              });
              stream = await playdl.stream(yt_info[0].url);
              prepareSong(stream, yt_info[0].url);
              break;
          }
        } catch (error: any) {
          if (error.message === "This is not a YouTube Watch URL") {
            interaction.channel!.send("there has been an error");
          }
        }
      }
    
      async function prepareSong(stream: YouTubeStream | SoundCloudStream , url: string) {
        const res = createAudioResource(stream.stream, {
          inputType: stream.type,
        });
        const title: string | undefined = (await playdl.video_basic_info(url)).video_details.title;
        const song = new Song(title,res);
        if (queue.length >= 1 && player.state.status === "playing") {
          queue.push(song);
          interaction.channel!.send(":notes:  Added to the queue: " + song.getTitle());
        } else if (queue.length >= 1) {
          queue.push(song);
          index++;
          player.play(queue[index].getRes());
          interaction.channel!.send(":musical_note:  Now playing: " + song.getTitle());
        } else {
          queue.push(song);
          player.play(queue[index].getRes());
          interaction.channel!.send(":musical_note:  Now playing: " + song.getTitle());
        }
      }
    
      async function preparePlaylist(url: string) {
        const playlist = (await playdl.playlist_info(url)).all_videos();
        (await playlist).forEach(async (video) => {
          const stream: YouTubeStream | SoundCloudStream = await playdl.stream(video.url);
          await prepareSong(stream, video.url);
        });
      }
});

