import { Arguments } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { GuildMember } from "discord.js";

export default {
    name: "simjoin",
    guildOnly: true,
    hidden: true,
    category: "Tools",
    guarded: true,
    usage: "[member/id]",
    metasyntax: Arguments.compile("[member]"),
    staffOnly: true,
    callback({ client, message, parsed }) {
        const mem = parsed[0] || message.member!;
        if (!(mem instanceof GuildMember)) return;
        if (mem) client.emit("guildMemberAdd", mem);
        else message.channel.send("Invalid GuildMember");
    },
} as Command;
