import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import members from "../../../models/Member";

export default {
    name: "unwarn",
    aliases: ["removewarn", "rw"],
    category: "Moderation",
    description:
        "Removes a warn from a user with the ID. get the ID by running `warns <user/id>",
    details: "Use the `warns` command to get the warnings.",
    permissions: ["MANAGE_MESSAGES"],
    guildOnly: true,
    args: true,
    minArgs: 2,
    usage: "<user/id> <warn number>",
    async callback({ message, args }): Promise<any> {
        const target =
            message.mentions.members?.first() ||
            (await message.guild!.members.fetch(args[0]));
        if (!target) return message.channel.send("Invalid user provided.");

        const member: any = await members.findOne({
            guildId: message.guild!.id,
            userId: target.id,
        });

        let warnIndex: number;
        try {
            warnIndex = parseInt(args[1]) - 1;
        } catch (e) {
            return message.channel.send("Please provide a valid number.");
        }

        member.warnings.splice(warnIndex, 1);
        await member.save();

        message.channel.send(
            new MessageEmbed()
                .setTitle(":white_check_mark: Removed Warning")
                .addField("Warning ID", warnIndex + 1)
                .setColor("RANDOM")
                .setTimestamp()
        );
    },
} as Command;
