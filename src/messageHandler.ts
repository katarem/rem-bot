import { JsonHandler } from "@tomhuel/jsonhandler";
import { Message, userMention } from "discord.js";
import path from "path";

export default function messageHandler(message: Message){
    const msg = message.content.toLowerCase().replace(' ','');
    const usr = userMention(message.author.id);
    const json = new Map(Object.entries(new JsonHandler(path.join(__dirname,"./../data/messageAnswers.json")).getJson())) as Map<string, string>;
    const response = json.get(msg);
    if(response) message.reply(`${response} ${usr}`);
}