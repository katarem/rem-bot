require('dotenv').config();

const { Client, IntentsBitField, ActivityType, userMention} = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioResource, AudioPlayerStatus } = require('@discordjs/voice')
const ytdl = require('ytdl-core');
const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates
    ]
});

bot.login(process.env.TOKEN);
var queue;
var index;
var isPlaying;
const player = createAudioPlayer();
bot.on('ready', (c) => {
    console.log('REM ACTIVATED')
        bot.user.setPresence({ activities: [{ name: 'Designed and coded by @Katarem on GitHub' }], status: 'dnd' });
        queue = [];
        index = 0;
        isPlaying = false;
})

bot.on('messageCreate', (message) => {
    if(message.author.bot)
        return;
    if(message.content === 'hey')
        message.reply('hey');
})
bot.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'hello'){
        async () => {
            interaction.reply('hey');
        } 
    }

    if(interaction.commandName === 'camellos'){
        const number = Math.round(Math.random()* 100);
        const usr = interaction.user;
        interaction.reply(userMention(usr.id) + ' vale ' + number + ' camellos.');
    }

    if(interaction.commandName === 'play'){
        const url = interaction.options.getString('url');
        if(isPlaying){
            const stream = ytdl(url, {filter: 'audioonly'});
            const res = createAudioResource(stream);
            queue.push(res);
            interaction.reply('Added to the queue');
        }
        else{
            const voiceConnection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })
            const stream = ytdl(url, {filter: 'audioonly'});
            const res = createAudioResource(stream);
            queue.push(res);
            interaction.reply('Now playing song number ' + (index+1));
            player.play(queue[index]);
            voiceConnection.subscribe(player);
        }    
        
        player.on('error', (error) => {
            console.error('error: ' + error);
        })

        // player.on(AudioPlayerStatus.Idle, () => {
        //     voiceConnection.destroy();
        //     index = 0;
        //     isPlaying = false;
        // })

        player.on(AudioPlayerStatus.AutoPaused, () => {
            skip();
        })

        player.on(AudioPlayerStatus.Playing, () =>{
            isPlaying = true;
        });

    }
    if(interaction.commandName === 'pause'){
        interaction.reply('Paused player');
        player.pause();
    }
    if(interaction.commandName === 'stop'){
        interaction.reply('Player exiting');
        index = 0;
        player.stop();
    }
    if(interaction.commandName === 'resume'){
        interaction.reply('Resuming player');
        player.unpause();
    }
    if(interaction.commandName === 'skip'){
        interaction.reply('Skipping song');
        skip();
    }
    if(interaction.commandName === 'debug_check'){
        interaction.reply(player.state);
    }

})

function checkIfLastSong(index) {
    if(index == queue.length-1){
        return true;
    }
    else
        return false;
}

function skip(){
    if(index+1<queue.length){
        index++;
        player.play(queue[index]);
    }
    else{
        voiceConnection.destroy();
    }
}