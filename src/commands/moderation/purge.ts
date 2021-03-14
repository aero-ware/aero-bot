import { Arguments } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { GuildMember, TextChannel, Collection } from "discord.js";
import escapeStringRegexp from "escape-string-regexp";

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
    metasyntax: Arguments.compile("<number> [string|member]"),
    minArgs: 1,
    maxArgs: 2,
    guildOnly: true,
    permissions: ["MANAGE_MESSAGES"],
    async callback({ message, args, parsed }) {
        // const target = message.mentions.members?.first();
        // let numDelete: number;
        // try {
        //     numDelete = parseInt(args[0]);
        // } catch (e) {
        //     return message.channel.send(
        //         "Please provide a number of messages to delete."
        //     );
        // }
        // if (message.channel instanceof TextChannel) {
        //     if (!target) {
        //         return message.channel.bulkDelete(numDelete);
        //     } else {
        //         return message.channel.bulkDelete(
        //             message.channel.messages.cache.filter(
        //                 (m) => m.author.id === target.id
        //             )
        //         );
        //     }
        // } else throw new TypeError("Channel used in purge not TextChannel");

        const [num, filter] = parsed;
        if (!(message.channel instanceof TextChannel)) return;

        let deleted: number = 0;
        if (!filter) {
            message.channel.bulkDelete((num as number) + 1);
        } else if (filter instanceof GuildMember) {
            const messsgesFromMember = (await message.channel.messages.fetch())
                .filter((m) => m.author.id === filter.id)
                .array()
                .slice(0, (num as number) + 1);

            deleted = (await message.channel.bulkDelete(messsgesFromMember))
                .size;
        } else if (typeof filter === "string") {
            const filterRegex = new RegExp(escapeStringRegexp(filter));
            const matchingMessages = (await message.channel.messages.fetch())
                .filter((m) => filterRegex.test(m.content))
                .array()
                .slice(0, (num as number) + 1);

            deleted = (await message.channel.bulkDelete(matchingMessages)).size;
        }

        const confirmation = await message.channel.send(
            `Deleted ${deleted - 1} messages.`
        );
        setTimeout(async () => confirmation.delete(), 5000);
    },
} as Command;
