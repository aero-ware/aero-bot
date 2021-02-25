import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { GuildMember, MessageEmbed } from "discord.js";
import logEmbed from "../utils/logging";

export default {
    name: "guildMemberRemove",
    callback(member: GuildMember) {
        logEmbed(
            member.guild,
            new MessageEmbed()
                .setTitle("Member Left")
                .addField("Member", member.user.tag)
                .setColor("RANDOM")
                .setThumbnail(
                    member.user.displayAvatarURL({
                        dynamic: true,
                        format: "png",
                    })
                )
                .setTimestamp()
        );
    },
} as EventHandler;
