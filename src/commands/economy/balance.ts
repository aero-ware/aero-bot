import { Command } from "@aeroware/aeroclient/dist/types";
import { GuildMember, MessageEmbed } from "discord.js";
import { getCoins } from "../../utils/economy";

export default {
    name: "balance",
    aliases: ["coins", "bal", "money"],
    category: "Economy",
    description: "See your (or someone's) balance",
    details: "Ping or use someone's ID to see their balance",
    usage: "[user/id]",
    cooldown: 30,
    guildOnly: true,
    async callback({ message, args }) {
        let target: GuildMember;

        if (message.mentions.members?.first())
            target = message.mentions.members.first()!;
        else if (args[0]) target = await message.guild!.members.fetch(args[0]);
        else target = message.member!;

        message.channel.send(
            new MessageEmbed()
                .setTitle(`${target.user.tag}'s balance`)
                .setDescription(
                    `**Balance:** ${await getCoins(
                        message.guild!.id,
                        target.id
                    )}\n`
                )
                .setColor("RANDOM")
                .setTimestamp()
                .setFooter("more economy things will be added soon!")
        );
    },
} as Command;
