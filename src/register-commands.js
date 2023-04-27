require('dotenv').config();

const { REST, Routes, Options, VoiceChannel, SlashCommandBuilder, ChannelType } = require('discord.js');

const commands = [

    {
        name: 'hello',
        description: 'Replies with hey',
    },
    {
        name: 'camellos',
        description: 'Rem calculates how many camels you cost'
    },
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song.')
        .addStringOption((option) => option.setName('url').setDescription('youtube url of the song'))
        .toJSON(),
    {
        name: 'pause',
        description: 'Pauses the current song'
    },
    {
        name: 'resume',
        description: 'Resumes the music'
    },
    {
        name: 'debug_check',
        description: 'DEBUG ONLY'
    },
    {
        name: 'skip',
        description: 'Skips the current song'
    },
    {
        name: 'stop',
        description: 'Stops the music (bot will exit)'
    }
];
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try{
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {body: commands}
        )
        console.log('Commands added successfully');

    } catch(error){
        console.log(error);
    }
})();