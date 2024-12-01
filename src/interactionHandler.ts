import { ChatInputCommandInteraction, userMention } from "discord.js";
import { Storage } from "./storage";
import { Song } from "./player/Song";
import { DiscordGatewayAdapterCreator, getVoiceConnection, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import youtubeDl, { Payload } from "youtube-dl-exec";
import { SongPlayer } from "./player/SongPlayer";

const storage = Storage.getInstance();

export default async function interactionHandler(interaction: ChatInputCommandInteraction) {

    if (!interaction.guildId) {
        interaction.reply('❗ Internal Error');
        console.error('[ERROR] NO_SERVER_ID');
        return;
    }

    const player: SongPlayer | undefined = storage.getPlayer(interaction.guildId!!, interaction.channel!!);

    switch (interaction.commandName) {
        case "help":
            interaction.reply("");
            break;
        case "play":
            playCommand(interaction);
            break;
        case "skip":
            interaction.reply("⏩ Skipping song!");
            player?.skip();
            break;
        case "dados":
            let diceNumber: number | null = interaction.options.getInteger("dice_number", false);
            let sideNumber: number = interaction.options.getInteger("side_number", true);
            interaction.reply(`🎲 ${userMention(interaction.user.id)} obtained ${throwDice(diceNumber ?? 1, sideNumber)} in ${diceNumber} dice of ${sideNumber} sides.`);
            break;
        case "stop":
            player?.stop();
            interaction.reply("👋 Bye!");
            break;
        case "queue":
            player?.displayQueue();
            interaction.reply('⛓️‍💥 Displaying Queue');
            break;
        case "pause":
            player?.pause();
            interaction.reply("⏸️ Paused player");
            break;
        case "resume":
            player?.resume();
            interaction.reply("⏯️ Resuming player");
            break;
        case "shuffle":
            player?.shuffle();
            interaction.reply("🔀 Shuffling playlist");
            break;
    } 
}

async function userIsInVoiceChannel(interaction: ChatInputCommandInteraction): Promise<boolean> {
    return new Promise(async (resolve) => {
        const voiceChannel = interaction.guild?.members.cache.get(interaction.user.id)?.voice.channel;

        if (!voiceChannel) {
            await interaction.reply('🚫 You have to be in a voice channel to use this command!');
            resolve(false);
        }
        resolve(true);
    });
}

async function playCommand(interaction: ChatInputCommandInteraction) {

    if(!userIsInVoiceChannel(interaction)) return;

    const voiceChannel = interaction.guild?.members.cache.get(interaction.user.id)?.voice.channel!!;

    const connection: VoiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    const player = storage.getPlayer(interaction.guildId!!,interaction.channel!!);
    const youtubeUrl = interaction.options.getString("url");

    if (!player || !youtubeUrl) {
        interaction.reply("❗ Internal Error");
        console.error('[ERROR] NULL_PLAYER || NULL_SONG_URL');
        return;
    }

    if (!youtubeUrl.startsWith('https://www.youtube.com')) {
        interaction.reply('🚫 Only YouTube is available for this command.');
        console.error('[ERROR] INVALID_SERVICE_URL')
    }

    connection.subscribe(player!!.getPlayer());

    await interaction.deferReply();

    const song = await obtainSong(youtubeUrl);
    player.addSong(song);
    interaction.followUp(`✅ Added ${song.title} to the queue.`);
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

function throwDice(diceNumber: number, sideNumber: number) {
    let total: number = 0;
    for (let index = 0; index < diceNumber; index++) {
        total += Math.floor((Math.random() * sideNumber) + 1);
    }
    return total;
}