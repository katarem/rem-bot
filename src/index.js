require("dotenv").config();

const {
  Client,
  IntentsBitField,
  ActivityType,
  userMention,
} = require("discord.js");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  AudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const playdl = require("play-dl");
const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

bot.login(process.env.TOKEN);
var queue;
var index;
const player = createAudioPlayer();
var voiceConnection = null;
bot.on("ready", (c) => {
  console.log("REM ACTIVATED");
  bot.user.setPresence({
    activities: [{ name: "Designed and coded by @Katarem on GitHub" }],
    status: "dnd",
  });
  queue = [];
  index = 0;
  isPlaying = false;
});

bot.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.toLowerCase() === "hola rem") {
    message.reply("Hola " + userMention(message.author.id));
  }
  if (message.content.toLowerCase() === "que") {
    message.reply("so");
  }
});
bot.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "help") {
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

  if (interaction.commandName === "hello") {
    interaction.reply("hey");
  }

  if (interaction.commandName === "camellos") {
    const number = Math.floor(Math.random() * 100);
    const usr = interaction.user;
    if (number === 1)
      interaction.reply(userMention(usr.id) + " vale " + number + " camello.");
    else if (number === 0)
      interaction.reply(userMention(usr.id) + " no vales ni un camello colega");
    else
      interaction.reply(userMention(usr.id) + " vale " + number + " camellos.");
  }

  if (interaction.commandName === "dados") {
    const numDados = interaction.options.getInteger("dados");
    const numCaras = interaction.options.getInteger("caras");

    if (numDados === nul) numDados = 1;
    if (numCaras === undefined) numCaras = 6;

    var numeroTotal = 0;
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
  }

  if (interaction.commandName === "play") {
    const url = interaction.options.getString("url");

    interaction.reply(":white_check_mark: Command received!");
    voiceConnection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    voiceConnection.subscribe(player);

    checkType(url);

    player.on("error", (error) => {
      interaction.channel.send(":no_entry_sign: error!");
      console.log(error.name);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      skip();
    });

    // player.on(AudioPlayerStatus.AutoPaused, () => {
    //   skip();
    // });

    player.on(AudioPlayerStatus.Playing, () => {
      isPlaying = true;
    });
  }
  if (interaction.commandName === "pause") {
    interaction.reply(":pause_button:  Paused player");
    player.pause();
  }
  if (interaction.commandName === "stop") {
    interaction.reply(":stop_button:  Player exiting");
    index = 0;
    player.stop();
    if (voiceConnection != null) voiceConnection.destroy();
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
    if (index + 1 < queue.length) {
      index++;
      displaySong(queue[index].title);
      player.play(queue[index].res);
    }
  }

  function displaySong(songName) {
    interaction.channel.send(":musical_note:  Now playing: " + songName);
  }

  function clear() {
    queue.length = 0;
    index = 0;
  }

  async function checkType(url) {
    var stream;
    const data = await playdl.validate(url);
    try {
      switch (data) {
        case "yt_playlist":
          interaction.channel.send(":inbox_tray:  Adding playlist...");
          preparePlaylist(url);
          break;
        case "yt_video":
          stream = await playdl.stream(url);
          prepareSong(stream, url);
          break;
        default:
          interaction.channel.send(":mag:  Searching song...");
          const yt_info = await playdl.search(url, {
            limit: 1,
          });
          stream = await playdl.stream(yt_info[0].url);
          prepareSong(stream, yt_info[0].url);
          break;
      }
    } catch (error) {
      if (error.message === "This is not a YouTube Watch URL") {
        interaction.channel.send("there has been an error");
      }
    }
  }

  async function prepareSong(stream, url) {
    const res = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    var title;
    if (url === undefined)
      title = (await playdl.video_basic_info(stream.url)).video_details.title;
    else title = (await playdl.video_basic_info(url)).video_details.title;
    const song = {
      title,
      res,
    };
    if (queue.length >= 1 && player.state.status === "playing") {
      queue.push(song);
      interaction.channel.send(":notes:  Added to the queue: " + song.title);
    } else if (queue.length >= 1) {
      queue.push(song);
      index++;
      player.play(queue[index].res);
      interaction.channel.send(":musical_note:  Now playing: " + song.title);
    } else {
      queue.push(song);
      player.play(queue[index].res);
      interaction.channel.send(":musical_note:  Now playing: " + song.title);
    }
  }

  async function preparePlaylist(url) {
    const playlist = (await playdl.playlist_info(url)).all_videos();
    (await playlist).forEach(async (video) => {
      stream = await playdl.stream(video.url);
      await prepareSong(stream, stream.video_url);
    });
  }
});
