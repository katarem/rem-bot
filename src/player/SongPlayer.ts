import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection } from "@discordjs/voice";
import { Song } from "./Song";

export class SongPlayer{

    private index: number = -1;
    private isPlaying: boolean = false;
    private player: AudioPlayer;
    private queue: Song[] = [];

    constructor(){
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause
            }
        });
    }

    addSong(song: Song){
        this.queue.push(song);
        if(!this.isPlaying){
            this.skip();
        }
    }

    skip(){
        this.index++;
        this.play(this.queue[this.index]);
    }

    play(song: Song){
        this.player.play(this.prepareSong(song));
        this.player.on(AudioPlayerStatus.Idle, () => {
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



