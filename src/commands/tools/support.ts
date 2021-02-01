import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";

export default {
    name: "support",
    aliases: ["link", "invite", "docs"],
    category: "Tools",
    description: "Gives you useful links about the bot",
    callback({ message }) {
        message.channel.send(
            new MessageEmbed()
                .setTitle("Useful links")
                .addFields(
                    {
                        name: "Support server",
                        value:
                            "Need help with the bot? found a bug? need help cloning the source? Join the [support server](https://discord.gg/Vs4rfsfd4q)!",
                    },
                    {
                        name: "Inviting AeroBot",
                        value:
                            "Want to invite AeroBot to your own server? check out the [top.gg page](https://top.gg/bot/787460489427812363)!",
                    },
                    {
                        name: "Docs",
                        value:
                            "Check out the docs, a glorified version of the help command via [the website](https://aero-ware.github.io/aero-bot/)!\n" +
                            "**Keep in mind that it is not yet complete.**",
                    },
                    {
                        name: "Source Code",
                        value:
                            "Look at the [source code](https://github.com/aero-ware/aero-bot).",
                    }
                )
                .setColor("RANDOM")
                .setTimestamp()
        );
    },
} as Command;
