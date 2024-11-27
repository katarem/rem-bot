import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { SongPlayer } from "./player/SongPlayer";
import { ChatInputCommandInteraction, TextBasedChannel } from "discord.js";

export class Storage {

    private static instance: Storage

    static getInstance(): Storage {
        if(!Storage.instance) 
            Storage.instance = new Storage();
        return Storage.instance;
    }

    private addServer(id: string){
        this.activePlayers.set(id, new SongPlayer());
    }

    getPlayer(id: string): SongPlayer | undefined {
        const existingPlayer = this.activePlayers.get(id);
        if(!existingPlayer && id.length > 0){ this.addServer(id); }
        return this.activePlayers.get(id);
    }

    private constructor(){}

    private activePlayers: Map<string, SongPlayer> = new Map();


}