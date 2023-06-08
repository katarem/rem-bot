"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const play_dl_1 = __importDefault(require("play-dl"));
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const song_1 = __importDefault(require("./objs/song"));
const bot = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.GuildVoiceStates
    ]
});
bot.login(process.env.TOKEN);
console.log(__dirname);
var skipped = false;
var queue;
var index;
const player = (0, voice_1.createAudioPlayer)();
var voiceConnection;
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
    if (message.content.toLowerCase() === "status") {
        message.reply("estado: " + player.state.status);
    }
    if (message.content.toLowerCase().replace(" ", "") === "holarem") {
        message.reply("Hola " + (0, discord_js_1.userMention)(message.author.id));
    }
    if (message.content.toLowerCase() === "que") {
        message.reply("so");
    }
    if (message.content.toLowerCase() === "") {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("DarkRed")
            .setTitle("Song name")
            .setDescription("the song is playing");
        message.channel.send({ embeds: [embed] });
    }
});
bot.on("interactionCreate", (interaction) => {
    var _a, _b;
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === "help") {
        interaction.reply("These are all the commands I have:\n" +
            "/hello   I will say you hello back\n" +
            "/help    Displays this help\n" +
            "/camellos    I calculate how many camels do you cost\n" +
            "/dados   I will throw you the dice amount with the size you want, if you don't give any argument, I'll throw 1 six-sided dice.\n" +
            "/play    Plays one song you want to search on YouTube, you can use YouTube video url's and playlists too. If a song is already playing, it will be added to the queue\n" +
            "/resume  Will unpause the player\n" +
            "/pause Will pause the player\n" +
            "/skip    Will skip the current song to the next one\n" +
            "/stop    Will stop the music and I'll exit the voice channel\n" +
            "/clear   Will clear the music queue");
    }
    if (interaction.commandName === "camellos") {
        const number = Math.floor(Math.random() * 100);
        const usr = interaction.user;
        if (number === 1)
            interaction.reply((0, discord_js_1.userMention)(usr.id) + " vale " + number + " camello.");
        else if (number === 0)
            interaction.reply((0, discord_js_1.userMention)(usr.id) + " no vales ni un camello colega");
        else
            interaction.reply((0, discord_js_1.userMention)(usr.id) + " vale " + number + " camellos.");
    }
    if (interaction.commandName === "dados") {
        const numDados = (_a = interaction.options.getInteger("dados")) !== null && _a !== void 0 ? _a : 1;
        const numCaras = (_b = interaction.options.getInteger("caras")) !== null && _b !== void 0 ? _b : 6;
        var numeroTotal = 0;
        for (let i = 0; i < numDados; i++) {
            numeroTotal += Math.floor(Math.random() * numCaras + 1);
        }
        interaction.reply(":control_knobs: " +
            (0, discord_js_1.userMention)(interaction.user.id) +
            " ha sacado " +
            numeroTotal +
            " de " +
            numDados +
            " dados de " +
            numCaras +
            " caras!");
    }
    ;
    if (interaction.commandName === "play") {
        const member = interaction.member;
        voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        voiceConnection.subscribe(player);
        const url = interaction.options.getString("url");
        interaction.reply(":white_check_mark: Command received!");
        checkType(url);
        player.on("error", (error) => {
            interaction.channel.send(":no_entry_sign: error!");
            console.log(error.name);
        });
        player.on(voice_1.AudioPlayerStatus.Idle, () => {
            console.log(player.state.status);
            if (index + 1 === queue.length) {
                index = 0;
                queue = new Array();
                skipped = false;
                player.stop();
                if (voiceConnection != null)
                    voiceConnection.disconnect();
            }
            else if (!skipped) {
                skipped = true;
                skip();
            }
        });
        player.on(voice_1.AudioPlayerStatus.Playing, () => {
            console.log("playing");
            skipped = false;
        });
    }
    if (interaction.commandName === "pause") {
        interaction.reply(":pause_button:  Paused player");
        player.pause();
    }
    if (interaction.commandName === "list") {
        let list = ":scroll: This is the current playlist:\n";
        for (let i = 0; i < queue.length; i++) {
            if (i === index)
                list += ":arrow_right: " + queue[i].getTitle() + "\n";
            else
                list += queue[i].getTitle() + "\n";
        }
        interaction.reply(list);
    }
    if (interaction.commandName === "stop") {
        interaction.reply(":stop_button:  Player exiting");
        index = 0;
        queue = new Array();
        skipped = false;
        player.stop();
        if (voiceConnection != null)
            voiceConnection.disconnect();
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
    function displaySong(songName) {
        interaction.channel.send(":musical_note:  Now playing: " + songName);
    }
    function clear() {
        queue.length = 0;
        index = 0;
    }
    function checkType(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var stream;
            const data = yield play_dl_1.default.validate(url);
            try {
                switch (data) {
                    case "yt_playlist":
                        interaction.channel.send(":inbox_tray:  Adding playlist...");
                        preparePlaylist(url);
                        break;
                    case "yt_video":
                        stream = yield play_dl_1.default.stream(url);
                        prepareSong(stream, url);
                        break;
                    default:
                        interaction.channel.send(":mag:  Searching song...");
                        const yt_info = yield play_dl_1.default.search(url, {
                            limit: 1,
                        });
                        stream = yield play_dl_1.default.stream(yt_info[0].url);
                        prepareSong(stream, yt_info[0].url);
                        break;
                }
            }
            catch (error) {
                if (error.message === "This is not a YouTube Watch URL") {
                    interaction.channel.send("there has been an error");
                }
            }
        });
    }
    function prepareSong(stream, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = (0, voice_1.createAudioResource)(stream.stream, {
                inputType: stream.type,
            });
            const title = (yield play_dl_1.default.video_basic_info(url)).video_details.title;
            const song = new song_1.default(title, res);
            if (queue.length >= 1 && player.state.status === "playing") {
                queue.push(song);
                interaction.channel.send(":notes:  Added to the queue: " + song.getTitle());
            }
            else if (queue.length >= 1) {
                queue.push(song);
                index++;
                player.play(queue[index].getRes());
                interaction.channel.send(":musical_note:  Now playing: " + song.getTitle());
            }
            else {
                queue.push(song);
                player.play(queue[index].getRes());
                interaction.channel.send(":musical_note:  Now playing: " + song.getTitle());
            }
        });
    }
    function preparePlaylist(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlist = (yield play_dl_1.default.playlist_info(url)).all_videos();
            (yield playlist).forEach((video) => __awaiter(this, void 0, void 0, function* () {
                const stream = yield play_dl_1.default.stream(video.url);
                yield prepareSong(stream, video.url);
            }));
        });
    }
});
//# sourceMappingURL=index.js.map