import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import guilds, { IGuildConfig } from "../../models/Guild";

export default {
    name: "snipe",
    category: "Fun",
    description:
        "Shows you the most recent delete message in this (or another) channel",
    usage: "[channel]",
    maxArgs: 1,
    guildOnly: true,
    async callback({ message }): Promise<any> {
        const target = message.mentions.channels.first() || message.channel;
        const { snipes } = (await guilds.findById(
            message.guild!.id
        )) as IGuildConfig;
        if (!snipes) return message.channel.send("There's nothing to snipe!");

        if (!(target.id in snipes))
            return message.channel.send("There's nothing to snipe!");

        const sniped = snipes[target.id];

        const author = message.guild!.members.cache.get(sniped.author);

        message.channel.send(
            new MessageEmbed()
                .setTitle("Sniped Message")
                .setAuthor(
                    author?.user.tag || "unknown",
                    author?.user.displayAvatarURL({ dynamic: true })
                )
                .setDescription(sniped.content)
                .setTimestamp(sniped.timestamp)
                .setFooter("haha get sniped")
        );
    },
} as Command;
