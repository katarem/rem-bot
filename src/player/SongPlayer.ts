import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection } from "@discordjs/voice";
import { Song } from "./Song";
import { TextBasedChannel } from "discord.js";

export class SongPlayer{

    private index: number = -1;
    private isPlaying: boolean = false;
    private player: AudioPlayer;
    private queue: Song[] = [];
    private channel: TextBasedChannel;

    constructor(channel: TextBasedChannel){
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
        this.channel = channel;
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
        this.player.pause();
        this.isPlaying = false;
    }

    resume(){
        this.player.unpause();
        this.isPlaying = true;
    }


    getPlayer(): AudioPlayer {
        return this.player;
    }

}



