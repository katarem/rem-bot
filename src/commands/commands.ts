import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export default function prepareCommands(): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    
    commands.push(new SlashCommandBuilder()
    .setName('help')
    .setDescription('displays help').toJSON());

    commands.push(new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a song [NOT WORKING YET]')
    .addStringOption(option => option.setName('url').setDescription('song url'))
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