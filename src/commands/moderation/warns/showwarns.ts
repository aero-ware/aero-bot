import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import members from "../../../models/Member";

export default {
    name: "showwarns",
    aliases: ["warns", "warnings", "listwarns"],
    category: "Moderation",
    description: "Shows your (or someone else's) warnings",
    details: "Ping someone or use their ID to see their warnings",
    usage: "[user/id]",
    guildOnly: true,
    async callback({ message, args }): Promise<any> {
        const target = args[0]
            ? (await message.guild!.members.fetch(args[0])) ||
              message.mentions.members?.first()
            : message.member;
        if (!target) return message.channel.send("Invalid member provided.");

        const memberInfo: any = await members.findOne({
            guildId: target.guild.id,
            userId: target.id,
        });

        const warnFields = memberInfo.warnings.map((w: any, i: number) => {
            return {
                name: `Warn #${i + 1}`,
                value:
                    `Warn by <@${w.author}>` +
                    `\n For reason \`${w.reason}\`` +
                    `\nAt: ${new Date(w.timeStamp)
                        .toUTCString()
                        .replace("GMT", "UTC")}`,
            };
        });

        const warnsEmbed = new MessageEmbed()
            .setTitle(`Warns for ${target.user.tag}`)
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setTimestamp();

        if (warnFields.length > 0) warnsEmbed.addFields(...warnFields);
        else warnsEmbed.addField("No Warns", "This user has not been warned.");

        message.channel.send(warnsEmbed);
    },
} as Command;
