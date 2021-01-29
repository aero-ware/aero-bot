import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import members from "../../../models/Member";

export default {
    name: "warn",
    category: "Moderation",
    description: "Warns a member with a ping or ID",
    details: "Your standard warning command",
    args: true,
    minArgs: 2,
    usage: "<user/id> <reason>",
    guildOnly: true,
    permissions: ["MANAGE_MESSAGES"],
    async callback({ message, args }): Promise<any> {
        const target = message.guild!.members.cache.get(args[0]) || message.mentions.members?.first();
        if (!target) return message.channel.send("Please mention (or give the ID of) someone to warn");
        if (target === message.member) return message.channel.send("Why are you warning yourself?");
        if (target.user.bot) return message.reply("Why are you warning a bot?");
        if (message.member!.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
            return message.reply("You cannot warn someone that has a higher or equal role to you");
        }

        args.shift();

        const guildId = message.guild!.id;
        const userId = target.id;
        const reason = args.join(" ");

        const warning = {
            author: message.author,
            timeStamp: new Date().getTime(),
            reason,
            kind: "warning",
        };

        await members.findOneAndUpdate(
            {
                guildId,
                userId,
            },
            {
                guildId,
                userId,
                $push: {
                    warnings: warning,
                },
            },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        target.user.send(`You have been warned in ${message.guild!.name} for: ${reason}`);

        return message.channel.send(
            new MessageEmbed()
                .setTitle(":white_check_mark: Successfully Warned")
                .addFields(
                    {
                        name: "Warned:",
                        value: target.toString(),
                        inline: true,
                    },
                    {
                        name: "Warned By:",
                        value: message.member,
                        inline: true,
                    },
                    {
                        name: "Reason",
                        value: reason,
                    }
                )
                .setColor("RANDOM")
                .setTimestamp()
        );
    }
} as Command;