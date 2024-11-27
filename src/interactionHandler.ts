import { ChatInputCommandInteraction, userMention } from "discord.js";
import { Storage } from "./storage";
import { Song } from "./player/Song";
import { DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import youtubeDl, { Payload } from "youtube-dl-exec";

const storage = Storage.getInstance();

export default async function interactionHandler(interaction: ChatInputCommandInteraction) {

    if (!interaction.guildId) {
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
        case "skip":
            storage.getPlayer(interaction.guildId!!, interaction.channel!!)?.skip();
            interaction.reply("skipped song! moving to the next one");
            break;
        case "dados":
            let numeroDados: number | null = interaction.options.getInteger("dice_number", false);
            let numeroCaras: number = interaction.options.getInteger("side_number", true);
            interaction.reply(`ha salido ${tirarDados(numeroDados ?? 1, numeroCaras)}`);
            break;
        case "stop":
            storage.getPlayer(interaction.guildId!!, interaction.channel!!)?.stop();
            getVoiceConnection(interaction.guildId!!)?.disconnect();
            interaction.reply("Adios!");
            break;
        case "pause":
            storage.getPlayer(interaction.guildId!!, interaction.channel!!)?.pause();
            interaction.reply("Reproducción Pausada");
            break;
        case "resume":
            storage.getPlayer(interaction.guildId!!, interaction.channel!!)?.resume();
            interaction.reply("Reproducción Continuada");
            break;
    }
}

async function playCommand(interaction: ChatInputCommandInteraction) {
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

    const player = storage.getPlayer(interaction.guildId!!,interaction.channel!!);
    const youtubeUrl = interaction.options.getString("url");

    if (!player || !youtubeUrl) {
        interaction.reply("funcion no implementada aún");
        console.error('[ERROR] NULL_PLAYER || NULL_SONG_URL');
        return;
    }

    if (!youtubeUrl.startsWith('https://www.youtube.com')) {
        interaction.reply('Sólo youtube se puede usar con este comando.');
        console.error('[ERROR] INVALID_SERVICE_URL')
    }

    connection.subscribe(player!!.getPlayer());

    await interaction.deferReply();

    const song = await obtainSong(youtubeUrl);
    player.addSong(song);
    interaction.followUp(`cancion añadida a la cola: ${song.title}`);
}

async function obtainSong(youtubeUrl: string): Promise<Song> {
    return new Promise(async (resolve, reject) => {
        try {
            const obtainedVideo = await youtubeDl(youtubeUrl, {
                dumpJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
                format: 'bestaudio',
                //getUrl: false,
                extractAudio: true,
                audioFormat: 'opus'
            });
            const video = obtainedVideo as Payload;
            const bestAudioFormat = video.formats.find((format) => format.acodec !== 'none' && format.vcodec === 'none');
            const song: Song = { title: video.title, url: bestAudioFormat!!.url };
            resolve(song);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });

}

function tirarDados(numeroDados: number, numeroCaras: number) {
    let total: number = 0;
    for (let index = 0; index < numeroDados; index++) {
        total += Math.round(Math.random() * numeroCaras + 1);
    }
    return total;
}