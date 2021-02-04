import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "simjoin",
    guildOnly: true,
    minArgs: 1,
    hidden: true,
    category: "Tools",
    guarded: true,
    usage: "<member/id>",
    staffOnly: true,
    callback({ client, message, args }) {
        const mem =
            message.mentions.members?.first() ||
            message.guild!.members.cache.get(args[0]);
        if (mem) client.emit("guildMemberAdd", mem);
        else message.channel.send("Invalid GuildMember");
    },
} as Command;
