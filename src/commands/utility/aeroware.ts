import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import { AERO, DND, KALI, TWITTER } from "../../utils/emojis";

export default {
    name: "aeroware",
    description: "View AeroWare products.",
    details: "Spice up your server with AeroWare!",
    category: "utility",
    cooldown: 10,
    async callback({ message }) {
        await message.guild?.members.fetch();

        return message.channel.send(
            new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("AeroWare Products")
                .setDescription(
                    "Discord bots by AeroWare; quality in every command."
                )
                .addField(
                    `AeroBot ${AERO}`,
                    `General purpose bot for your server.
Easily configurable and simple to use. 
Lots of features and utilities.


${
    message.guild?.member("787460489427812363")
        ? "Already installed :white_check_mark:"
        : "[Install](https://discord.com/oauth2/authorize?client_id=787460489427812363&permissions=8&scope=bot)"
}`,
                    true
                )
                .addField("\u200b", "\u200b", true)
                .addField(
                    `Kali ${KALI}`,
                    `Moderation at its finest. 
Zero config, zero problems. 
Linux style.


${
    message.guild?.member("808056326881280041")
        ? "Already installed :white_check_mark:"
        : "[Install](https://discord.com/oauth2/authorize?client_id=808056326881280041&scope=bot&permissions=8)"
}`,
                    true
                )
                .addField("\u200b", "\u200b")
                .addField(
                    `Dungeons & Dragons [BETA] ${DND}`,
                    `The new role-playing game bot.
Play Dungeons & Dragons on Discord, effortlessly.
Many items, skills, and details.

${
    message.guild?.member("802978299289534485")
        ? "Already installed :white_check_mark:"
        : "[Install](https://discord.com/oauth2/authorize?client_id=802978299289534485&scope=bot&permissions=8)"
}`,
                    true
                )
                .addField("\u200b", "\u200b", true)
                .addField(
                    `Twitter [BETA] ${TWITTER}`,
                    `Bring Twitter to Discord!
Tweet, follow, and like posts.
Simple and elegant, like the real thing.


${
    message.guild?.member("808348133162745877")
        ? "Already installed :white_check_mark:"
        : "[Install](https://discord.com/oauth2/authorize?client_id=808348133162745877&scope=bot&permissions=8)"
}`,
                    true
                )
                .setURL("https://aero-ware.github.io/")
        );
    },
} as Command;
