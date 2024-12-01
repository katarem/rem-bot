import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export default function prepareCommands(): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    
    commands.push(new SlashCommandBuilder()
    .setName('help')
    .setDescription('displays help').toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a song')
    .addStringOption(option => option.setName('url').setRequired(true).setDescription('song url'))
    .toJSON());
    
    commands.push(new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skips current song to the next one')
    .toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('stop')
    .setDescription('stops the bot and disconnects it')
    .toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('pause')
    .setDescription('pauses the music')
    .toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('resume')
    .setDescription('resumes the music')
    .toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('queue')
    .setDescription('displays the current queue')
    .toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('shuffle the current queue')
    .toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('dados')
    .setDescription('rolls a dice')
    .addIntegerOption(option => option
        .setName('dice_number')
        .setDescription('number of dices'))
    .addIntegerOption(option => option
        .setName('side_number')
        .setDescription('number of sides'))
    .toJSON());
    return commands;
}