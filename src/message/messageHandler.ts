import prompt from "../../data/prompt.json";
import { Message } from "discord.js";
import { config } from "../../config/config";
import { AIResponse } from "./messageModels";

export default async function messageHandler(message: Message){
    const reply = await message.reply('loading...');
    const members = await message.guild?.members.fetch();
    const member = await message.guild?.members.fetch(message.author.id); 
    const nickname = member?.nickname || message.author.displayName || message.author.username;
    let guildMembers = '';
    members?.forEach(member => {
        guildMembers += member.nickname + ","
    });
    const response = await fetchAIResponse(message.content, nickname, guildMembers);
    reply.edit(response);
}


async function fetchAIResponse(message: string, author: string, guildMembers: string): Promise<string> {
    return new Promise(async (resolve) => {
        const personality = prompt.personality
        .replace("{author}",author)
        .replace("{guildMembers}",guildMembers);
    
        const requestBody = {
            model: "llama3.2",
            messages: [
                {
                    role: "system",
                    content: personality
                },
                {
                    role: "user",
                    content: message
                }
            ]
        }

        try {
            const response = await fetch(config.AI_URL, { method: "POST", body: JSON.stringify(requestBody) });
            const reader = response.body!!.getReader();
            const decoder = new TextDecoder();
            let parsedResponse = ''; 
        
            while(true){
                const {done, value } = await reader.read();
                if(done) break;
                const json = JSON.parse(decoder.decode(value, { stream: true })) as AIResponse;
                parsedResponse += json.message.content;
            }
            resolve(parsedResponse);
        } catch (error) {
            console.error(error);
            resolve("🚫 No pude pensar nada original para lo tuyo.");    
        }
        
        
    });
}