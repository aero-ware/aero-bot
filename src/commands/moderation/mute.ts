import { Command } from "@aeroware/aeroclient/dist/types";
import { addMilliseconds } from "date-fns";
import { MessageEmbed } from "discord.js";
import ms from "ms";
import guilds, { IGuildConfig } from "../../models/Guild";
import mutes, { IMuteInfo } from "../../models/Mute";
import muteOverrides from "../../utils/mute-overrides";

export default {
    name: "mute",
    category: "Moderation",
    description: "Mutes a user (gives them muted role)",
    details: "Remember to give new channels permission overrides to disallow sending/connecting.",
    minArgs: 1,
    usage: "<user ping|id> [time] [reason]",
    guildOnly: true,
    permissions: ["MANAGE_MESSAGES"],
    async callback({ message, args }): Promise<any> {
        const [member, str, ...reason] = args;
        const target = message.mentions.members?.first() || await message.guild!.members.fetch(member);
        let guild = await guilds.findById(message.guild!.id) as IGuildConfig;
        
        // handle creating a muted role if it doesn't exist
        if (!guild.mutedRoleId) {
            const createPrompt = await message.channel.send("There is no muted role set up. Should I create one?");
            await createPrompt.react("✅");
            
            const collected = await createPrompt.awaitReactions((r, u) => r.emoji.name === "✅" && u.id === message.author.id, {
                time: 15000,
                max: 1,
            });

            if (collected.size > 0) {
                const mutedRole = await message.guild!.roles.create({
                    data: {
                        name: "Muted",
                        permissions: 1115136,
                        hoist: false,
                        mentionable: false,
                    },
                    reason: "Creating a muted role",
                });

                guild.mutedRoleId = mutedRole.id;
                await guild.save();
                message.channel.send(`${mutedRole} is now the muted role.`, {
                    allowedMentions: {
                        roles: [],
                    }
                });

                // set channel overwrites to disallow muted people to send mesages
                message.guild!.channels.cache.each(c => {
                    muteOverrides(c, mutedRole);
                });
            } else return message.channel.send("Not creating a muted role.");
        }

        
        
        const duration = ms(str);
        if (!duration) reason.splice(0, 0, str);
        
        const confirmation = new MessageEmbed()
            .setTitle(":white_check_mark: Muted User")
            .addFields(
                {
                    name: "Member",
                    value: "target",
                },
                {
                    name: "Reason",
                    value: reason.join(" "),
                }
            )
            .setTimestamp()
            .setColor("RANDOM");

        await target.roles.add(guild.mutedRoleId, `muted by ${message.author.tag} for ${reason.join(" ")}`);
        if (duration) {
            await mutes.create({
                guildId: message.guild!.id,
                userId: target.id,
                endTime: addMilliseconds(Date.now(), duration),
            }) as IMuteInfo;

            message.channel.send(
                confirmation.addField("Duration", ms(duration, { long: true }))
            );
        } else message.channel.send(confirmation);

        target.user.send(
            new MessageEmbed()
                .setTitle(`Muted in ${message.guild!.name}`)
                .addFields(
                    {
                        name: "Muted By",
                        value: message.author,
                    },
                    {
                        name: "Reason",
                        value: reason.length > 0 ? reason.join(" ") : "no reason given",
                    },
                    {
                        name: "Duration",
                        value: duration ? ms(duration, { long: true }) : "forever",
                    }
                )
                .setColor("RANDOM")
                .setTimestamp()
        ).catch(() => message.channel.send("DM confirmation cannot be sent."));
    }
} as Command;