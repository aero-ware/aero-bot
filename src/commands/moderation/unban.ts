import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import bans from "../../models/Tempban";

export default {
    name: "unban",
    category: "Moderation",
    description: "Unbans a banned user",
    details: "Works on both temporary and permanent bans",
    guildOnly: true,
    permissions: ["BAN_MEMBERS"],
    args: true,
    minArgs: 1,
    usage: "<user id>",
    async callback({ message, args }): Promise<any> {
        if (!(await message.guild!.fetchBans()).has(args[0]))
            return message.channel.send("This user is not currently banned.");

        await message.guild!.members.unban(args[0]);
        message.channel.send(
            new MessageEmbed()
                .setTitle("✅ User unbanned")
                .addField("User", (await (await message.client.users.fetch(args[0])).tag))
                .setColor("RANDOM")
                .setTimestamp()
        );

        // delete tempban if it exists
        await bans.findOneAndDelete({
            guildId: message.guild!.id,
            userId: args[0],
        });

        (await message.client.users.fetch(args[0])).send(
            new MessageEmbed()
                .setTitle(`Unbanned from ${message.guild!.name}`)
                .setDescription("You have been unbanned. Remember to follow the rules")
                .setColor("RANDOM")
                .setTimestamp()
        );
    }
} as Command;