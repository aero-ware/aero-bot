import { Command } from "@aeroware/aeroclient/dist/types";
import { addMilliseconds } from "date-fns";
import { GuildMember, MessageEmbed, User } from "discord.js";
import ms from "ms";
import guilds from "../../models/Guild";
import bans from "../../models/Tempban";
import log from "../../utils/logging";

export default {
    name: "ban",
    category: "Moderation",
    description: "Kicks the provided member",
    details: "Kick someone by ping or user ID",
    guildOnly: true,
    permissions: ["BAN_MEMBERS"],
    args: true,
    minArgs: 1,
    usage: "<user/id> [reason]",
    async callback({ message, args }): Promise<any> {
        const [member, str, ...reason] = args;

        let target: GuildMember | User | undefined =
            message.mentions.members?.first() ||
            (await message.guild!.members.cache.get(member));
        if (!target) {
            target =
                message.mentions.users?.first() ||
                (await message.client.users.fetch(member));
        }
        if (!target) return message.reply("Invalid User ID.");

        if (!message.guild!.me?.hasPermission("BAN_MEMBERS"))
            return message.channel.send(
                "I don't have permissions to ban members. Please re-invite me by runninng `support`."
            );
        if (target === message.author)
            return message.channel.send("Why are you banning yourself?");
        if (
            target instanceof GuildMember &&
            message.member!.roles.highest.comparePositionTo(
                target.roles.highest
            ) <= 0
        )
            return message.channel.send(
                "The member you are trying to ban has a higher or equal role to you."
            );
        if (target instanceof GuildMember && !target.bannable)
            return message.channel.send(
                "This member is not bannable by me (probably due to higher roles)."
            );

        const duration = ms(str);
        if (!duration) reason.splice(0, 0, str);

        if (target instanceof GuildMember)
            target.ban({
                reason: `by ${message.author.tag} - ${reason.join(" ")}`,
                days: ((await guilds.findById(message.guild!.id)) as any)
                    .banPurgeDays,
            });
        else
            message.guild!.members.ban(member, {
                days: ((await guilds.findById(message.guild!.id)) as any)
                    .banPurgeDays,
                reason: `by ${message.author.tag} - ${reason.join(" ")}`,
            });

        const confirmation = new MessageEmbed()
            .setTitle(":white_check_mark: Banned Member")
            .addField(
                "Member",
                target instanceof GuildMember ? target.user.tag : target.tag
            )
            .addField("Banned By", message.author.tag)
            .addField("Reason", reason.join(" "))
            .addField(
                "Duration",
                duration ? ms(duration, { long: true }) : "forever"
            )
            .setColor("RANDOM")
            .setTimestamp();

        if (duration) {
            await bans.create({
                guildId: message.guild!.id,
                userId: target.id,
                endTime: addMilliseconds(Date.now(), duration),
            });

            message.channel.send(
                confirmation.addField("Duration", ms(duration, { long: true }))
            );
        } else message.channel.send(confirmation);

        const dmConfirm = new MessageEmbed()
            .setTitle(`Banned from ${message.guild!.name}`)
            .addFields(
                {
                    name: "Banned By",
                    value: message.author,
                },
                {
                    name: "Reason",
                    value: reason.join(" "),
                },
                {
                    name: "Duration",
                    value: duration ? ms(duration, { long: true }) : "forever",
                }
            )
            .setThumbnail(message.guild!.iconURL({ dynamic: true }) || "")
            .setTimestamp()
            .setColor("RANDOM");

        (target instanceof GuildMember ? target.user : target)
            .send(dmConfirm)
            .catch(() =>
                message.channel.send("DM confirmation could not be sent.")
            );

        log(
            message.guild!,
            new MessageEmbed()
                .setTitle("Member banned")
                .setThumbnail(
                    target instanceof GuildMember
                        ? target.user.displayAvatarURL({ dynamic: true })
                        : target.displayAvatarURL({ dynamic: true })
                )
                .addField(
                    "Banned Member",
                    target instanceof GuildMember ? target.user : target
                )
                .addField("Banned By", message.author)
                .addField("Reason", reason.join(" "))
                .addField(
                    "Duration",
                    duration ? ms(duration, { long: true }) : "forever"
                )
        );
    },
} as Command;
