import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import guilds, { IGuildConfig } from "../../models/Guild";
import mutes from "../../models/Mute";

export default {
    name: "unmute",
    category: "Moderation",
    description: "Ping a user to unmute them",
    details: "Works on both permanent and temporary mutes",
    guildOnly: true,
    args: true,
    minArgs: 1,
    usage: "<user/id>",
    permissions: ["MANAGE_MESSAGES"],
    async callback({ message, args }): Promise<any> {
        const target =
            (await message.mentions.members?.first()) ||
            (await message.guild!.members.fetch(args[0]));

        const { mutedRoleId } = (await guilds.findById(
            message.guild!.id
        )) as IGuildConfig;
        if (!mutedRoleId)
            return message.channel.send(
                "There is no muted role set up. Run `config mutedrole <role id>` to set it up"
            );
        if (!target.roles.cache.has(mutedRoleId))
            return message.channel.send("That member is not currently muted.");

        await target.roles.remove(mutedRoleId);

        // if it was a timed mute, delete it
        await mutes.findOneAndDelete({
            guildId: message.guild!.id,
            userId: target.id,
        });

        message.channel.send(
            new MessageEmbed()
                .setTitle(":white_check_mark: Unmuted Member")
                .addField("Member", target)
                .setColor("RANDOM")
                .setTimestamp()
        );

        target.user
            .send(
                new MessageEmbed()
                    .setTitle(`Unmuted in ${message.guild!.name}`)
                    .setDescription(
                        "You have been unmuted. Remember to follow the rules next time."
                    )
                    .setColor("RANDOM")
                    .setTimestamp()
            )
            .catch();
    },
} as Command;
