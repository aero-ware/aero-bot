import { Command } from "@aeroware/aeroclient/dist/types";
import { TextChannel } from "discord.js";

export default {
    name: "purge",
    aliases: ["clearchannel", "cc", "bulkdelete"],
    category: "Moderation",
    description:
        "Deletes the specified number of messages, from a user if specified.",
    details:
        "Ping a user for the second argument to delete messages only from that user",
    args: true,
    usage: "<number> [user]",
    minArgs: 1,
    maxArgs: 2,
    guildOnly: true,
    permissions: ["MANAGE_MESSAGES"],
    async callback({ message, args }) {
        const target = message.mentions.members?.first();
        let numDelete: number;
        try {
            numDelete = parseInt(args[0]);
        } catch (e) {
            return message.channel.send(
                "Please provide a number of messages to delete."
            );
        }
        if (message.channel instanceof TextChannel) {
            if (!target) {
                return message.channel.bulkDelete(numDelete);
            } else {
                return message.channel.bulkDelete(
                    message.channel.messages.cache.filter(
                        (m) => m.author.id === target.id
                    )
                );
            }
        } else throw new TypeError("Channel used in purge not TextChannel");
    },
} as Command;
