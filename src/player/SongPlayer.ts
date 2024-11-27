import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior } from "@discordjs/voice";
import { Song } from "./Song";
import { TextBasedChannel } from "discord.js";

export class SongPlayer{

    private TIME: number = 5 * 1000 * 60;

    private index: number = -1;
    private isPlaying: boolean = false;
    private player: AudioPlayer;
    private queue: Song[] = [];
    private channel: TextBasedChannel;
    private guildId: string;

    private timeOut?: NodeJS.Timeout;

    constructor(guildId: string, channel: TextBasedChannel){
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
        this.channel = channel;
        this.guildId = guildId;
    }

    addSong(song: Song){
        this.queue.push(song);
        if(!this.isPlaying){
            this.skip();
        }
    }

    skip(){
        if(this.index < this.queue.length - 1){
            this.index++;
            this.play(this.queue[this.index]);
        } else {
            this.isPlaying = false;
            this.timeOut = setTimeout(() => {
                this.stop();
            }, this.TIME);
        }
    }

    play(song: Song){
        this.isPlaying = true;
        this.player.play(this.prepareSong(song));
        this.channel?.send(`Ahora reproduciendo: ${song.title}`);
        this.player.on(AudioPlayerStatus.Idle, (oldState) => {
            if(oldState.status === AudioPlayerStatus.Playing)
                this.skip();
        });
        this.player.on(AudioPlayerStatus.Playing, () => {
            clearTimeout(this.timeOut);
            this.timeOut = undefined;
        });
    }

    private prepareSong(song: Song): AudioResource {
        console.log(song.url)
        return createAudioResource(song.url,{
            metadata: {
                title: song.title,
            }
        });
    }

    pause(){
        this.player.pause();
        this.isPlaying = false;
    }

    stop(){
        this.player.stop();
        this.disconnect();
        this.isPlaying = false;
    }

    resume(){
        this.player.unpause();
        this.isPlaying = true;
    }

    disconnect(){
        getVoiceConnection(this.guildId)?.disconnect();
    }

    getPlayer(): AudioPlayer {
        return this.player;
    }

}



