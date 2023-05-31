import { AudioResource } from "@discordjs/voice";

class Song{

    private title: string | undefined;
    private res: AudioResource;

    public constructor(title: string | undefined , res: AudioResource){
        if(title != undefined)
        this.title = title;
        this.res = res;
    }

    public getTitle(){
        return this.title;
    }

    public getRes(){
        return this.res;
    }


}

export default Song;