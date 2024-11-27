import { SongPlayer } from "./player/SongPlayer";
import { TextBasedChannel } from "discord.js";

export class Storage {

    private static instance: Storage

    static getInstance(): Storage {
        if(!Storage.instance) 
            Storage.instance = new Storage();
        return Storage.instance;
    }

    private addServer(id: string, textChannel: TextBasedChannel){
        this.activePlayers.set(id, new SongPlayer(id, textChannel));
    }

    getPlayer(id: string, textChannel: TextBasedChannel): SongPlayer | undefined {
        const existingPlayer = this.activePlayers.get(id);
        if(!existingPlayer && id.length > 0){ this.addServer(id, textChannel); }
        return this.activePlayers.get(id);
    }

    private constructor(){}

    private activePlayers: Map<string, SongPlayer> = new Map();


}