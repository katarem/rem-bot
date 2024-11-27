import { ChatInputCommandInteraction, userMention } from "discord.js";
import { Storage } from "./storage";
import { Song } from "./player/Song";
import { DiscordGatewayAdapterCreator, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";

const storage = Storage.getInstance();

export default async function interactionHandler(interaction: ChatInputCommandInteraction){

    if(!interaction.guildId){
        interaction.reply('Error desconocido');
        console.error('[ERROR] NO_SERVER_ID');
        return;
    }

    switch (interaction.commandName) {
        case "help":
            interaction.reply("no necesitas ayuda, leete la puta docu");
            break;
        case "play":
            playCommand(interaction);
            break;
        case "dados":
            let numeroDados: number | null = interaction.options.getInteger("dice_number",false);
            let numeroCaras: number = interaction.options.getInteger("side_number",true);
            interaction.reply(`ha salido ${tirarDados(numeroDados ?? 1, numeroCaras)}`);
            break;
    }
}

async function playCommand(interaction: ChatInputCommandInteraction){
    const voiceChannel = interaction.guild?.members.cache.get(interaction.user.id)?.voice.channel;
            
    if (!voiceChannel) {
        await interaction.reply('¡Debes estar en un canal de voz para usar este comando!');
        return;
    }

    const connection: VoiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    const player = storage.getPlayer(interaction.guildId!!);
    const songUrl = interaction.options.getString("url");

    if(!player || !songUrl){
        interaction.reply("funcion no implementada aún");
        console.error('[ERROR] NULL_PLAYER || NULL_SONG_URL');
        return;
    }

    connection.subscribe(player!!.getPlayer());
    
    // youtube dl momento
    

    const song: Song = { title: 'a', url: songUrl };
    
    player.addSong(song);
    
    interaction.reply(`cancion añadida a la cola: ${song.title}`);
}

function tirarDados(numeroDados: number, numeroCaras: number){
    let total: number = 0;
    for (let index = 0; index < numeroDados; index++) {
        total += Math.round(Math.random() * numeroCaras + 1);
    }
    return total;
}