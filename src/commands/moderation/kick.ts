import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import log from "../../utils/logging";

export default {
    name: "kick",
    category: "Moderation",
    description: "Kicks the provided member",
    details: "Kick someone by ping or user ID",
    guildOnly: true,
    permissions: ["KICK_MEMBERS"],
    args: true,
    minArgs: 1,
    usage: "<user/id> [reason]",
    async callback({ message, args }): Promise<any> {
        const reason = args.slice(1).join(" ");

        const target = await message.guild!.members.fetch(args[0]) || message.mentions.members?.first();
        if (!target) return message.reply("Invalid User ID.");

        if (!message.guild!.me?.hasPermission("KICK_MEMBERS")) return message.channel.send("I don't have permissions to kick members. Please re-invite me by runninng `support`.");
        if (target === message.member) return message.channel.send("Why are you kicking yourself?");
        if (message.member!.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.channel.send("The member you are trying to kick has a higher or equal role to you.");
        if (!target.kickable) return message.channel.send("This member is not kickable by me (probably due to higher roles).");

        target.kick(`by ${message.author.tag} - ${reason}`);

        const confirmation = new MessageEmbed()
            .setTitle(":white_check_mark: Kicked Member")
            .addField("Member", target.user.tag)
            .addField("Kicked By", message.author.tag)
            .setColor("RANDOM")
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true}))
            .setTimestamp();

        message.channel.send(confirmation);

        const dmConfirm = new MessageEmbed()
            .setTitle(`Kicked from ${message.guild!.name}`)
            .addFields(
                {
                    name: "Kicked By",
                    value: message.author,
                },
                {
                    name: "Reason",
                    value: reason,
                }
            )
            .setThumbnail(message.guild!.iconURL({ dynamic: true }) || "")
            .setTimestamp()
            .setColor("RANDOM");

        target.user.send(dmConfirm)
            .catch(() => message.channel.send("DM confirmation could not be sent."));

        log(
            message.guild!,
            new MessageEmbed()
                .setTitle("Member Kicked")
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                .addField("Kicked Member", target.user)
                .addField("Kicked By", message.author)
                .addField("Reason", reason)
        );
    }
} as Command;