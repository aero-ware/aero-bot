import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "invites",
    category: "Tools",
    description: "Shows you the number of people you have (or someone has) invited",
    maxArgs: 1,
    usage: "[user]",
    guildOnly: true,
    async callback({ message }) {
        const target = message.mentions.members?.first() || message.member!;
        const invites = await message.guild!.fetchInvites();
        const userInvites = invites.filter(v => v.inviter?.id === target.id);
        let uses = 0;
        userInvites.each(v => uses += v.uses || 0);

        message.channel.send(`You have invited ${uses} people to this server${uses === 0 ? " so far..." : "."}`);
    }
} as Command;