import { JsonHandler } from "@tomhuel/jsonhandler";
import { Message, userMention } from "discord.js";
import path from "path";

var lastmsg: string = "";

export default function messageHandler(message: Message){
    let msg = message.content.toLowerCase().replace(' ','');
    let usr = userMention(message.author.id);
    let json = new Map(Object.entries(new JsonHandler(path.join(__dirname,"./../data/messageAnswers.json")).getJson())) as Map<string, string>;
    console.log(json.get(msg));
    
    message.reply(`${json.get(msg)} ${usr}`);


   lastmsg = msg;
}