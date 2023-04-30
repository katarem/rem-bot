require('dotenv').config();

const { Client, IntentsBitField, ActivityType, userMention} = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioResource, AudioPlayerStatus } = require('@discordjs/voice')
const playdl = require('play-dl');
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
const player = createAudioPlayer();
var voiceConnection = null;
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
    if(message.content.toLowerCase() === 'hola rem'){
        message.reply('Hola ' + userMention(message.author.id));
    }
    if(message.content.toLowerCase() === 'que'){
        message.reply('so');
    }

})
bot.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'hello'){
        interaction.reply('hey');
    }

    if(interaction.commandName === 'camellos'){
        const number = Math.round(Math.random()* 100);
        const usr = interaction.user;
        interaction.reply(userMention(usr.id) + ' vale ' + number + ' camellos.');
    }

    if(interaction.commandName === 'play'){
        const url = interaction.options.getString('url');
        
            interaction.reply('received');
            voiceConnection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })

            voiceConnection.subscribe(player);
            
            checkType(url);
        
        player.on('error', (error) => {
            console.error('error: ' + error.stack);
        })

        player.on(AudioPlayerStatus.Idle, () => {
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
        if(voiceConnection != null)
            voiceConnection.destroy();
    }
    if(interaction.commandName === 'resume'){
        interaction.reply('Resuming player');
        player.unpause();
    }
    if(interaction.commandName === 'skip'){
        interaction.reply('Skipping song');
        skip();
    }

    if(interaction.commandName === 'clear'){
        interaction.reply('Cleared queue');
        clear();
    }

    function skip(){
        if(index+1<queue.length){
            index++;
            player.play(queue[index].res);
        }
    }

    function clear(){
        queue.length = 0;
        index = 0;
    }

    async function checkType(url){
        var stream;
        const data = await playdl.validate(url);
        switch (data) {
            case 'yt_playlist':
                preparePlaylist(url);
                break;
            case 'yt_video':
                stream = await playdl.stream(url);
                prepareSong(stream);
                break;
            default:
                const yt_info = await playdl.search(url, {
                    limit: 1
                })
                stream = await playdl.stream(yt_info[0].url);
                prepareSong(stream, yt_info[0].url);
                break;
        }
    }


    async function prepareSong(stream, url){
        const res = createAudioResource(stream.stream,{
            inputType: stream.type
        });
        var title;
        if(url === undefined)
            title = (await playdl.video_basic_info(stream.url)).video_details.title;
        else
            title = (await playdl.video_basic_info(url)).video_details.title;
        const song = {
            title,
            res
        }
        if(player.state.status === 'playing'){           
            queue.push(song);
            interaction.channel.send(' Added to the queue: ' + song.title);           
        }
        else{
            queue.push(song);
            player.play(queue[index].res);
            interaction.channel.send(' Now playing: ' + song.title);
        }      
    }

    async function preparePlaylist(url){
        const playlist = (await playdl.playlist_info(url)).all_videos();
        (await playlist).forEach(async video => {
                stream = await playdl.stream(video.url);
                await prepareSong(stream, stream.video_url);
            });   
        }

});

