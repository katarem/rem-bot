import { ChatInputCommandInteraction } from "discord.js";


export default function interactionHandler(interaction: ChatInputCommandInteraction){

    switch (interaction.commandName) {
        case "help":
            interaction.reply("no necesitas ayuda, leete la puta docu");
            break;
        case "play":
            interaction.reply("funcion no implementada aún");
            break;
        case "dados":
            let numeroDados: number | null = interaction.options.getInteger("dados",false);
            let numeroCaras: number = interaction.options.getInteger("caras",true);
            interaction.reply(`ha salido ${tirarDados(numeroDados ?? 1, numeroCaras)}`);
            break;
    }
}



function tirarDados(numeroDados: number, numeroCaras: number){
    let total: number = 0;
    for (let index = 0; index < numeroDados; index++) {
        total+= Math.random()+1*numeroCaras;
    }
    return total;
}