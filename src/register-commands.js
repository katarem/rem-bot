require("dotenv").config();

const {
  REST,
  Routes,
  Options,
  VoiceChannel,
  SlashCommandBuilder,
  ChannelType,
} = require("discord.js");

const commands = [
  {
    name: "help",
    description: "Shows all commands that RemBot can do",
  },
  {
    name: "hello",
    description: "Replies with hey",
  },
  {
    name: "camellos",
    description: "Rem calculates how many camels you cost",
  },
  {
    name: "flip",
    description: "Flips a coin",
  },
  new SlashCommandBuilder()
    .setName("dados")
    .setDescription("Rem tira los dados de las caras que quieras por ti")
    .addIntegerOption((option) =>
      option.setName("dados").setDescription("Número de dados a tirar")
    )
    .addIntegerOption((option) =>
      option.setName("caras").setDescription("Número de lados de cada dado")
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Search in Youtube, or Video/Playlist URL")
        .setRequired(true)
    )
    .toJSON(),
  {
    name: "pause",
    description: "Pauses the current song",
  },
  {
    name: "resume",
    description: "Resumes the music",
  },
  {
    name: "skip",
    description: "Skips the current song",
  },
  {
    name: "stop",
    description: "Stops the music (bot will exit)",
  },
  {
    name: "clear",
    description: "Clears the queue",
  },
];
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("Commands added successfully");
  } catch (error) {
    console.log(error);
  }
})();
