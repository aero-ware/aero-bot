import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "avatar",
    aliases: ["icon", "pfp"],
    category: "Fun",
    description: "Sends your (or someone else's) avatar.",
    details: "Ping a user to see their avatar. If it sends your own avatar, that means the bot has no servers in common with the user you pinged.",
    maxArgs: 1,
    usage: "[user]",
    callback({ message }) {
        const target = message.mentions.users?.first() || message.author;
        message.channel.send(target.displayAvatarURL({ dynamic: true, size: 512 }));
    }
} as Command;