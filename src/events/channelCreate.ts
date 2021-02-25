import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { DMChannel, GuildChannel, MessageEmbed } from "discord.js";
import logEmbed from "../utils/logging";

export default {
    name: "channelCreate",
    async callback(channel: GuildChannel | DMChannel) {
        if (channel instanceof DMChannel) return;
        const logEntry = (
            await channel.guild.fetchAuditLogs({
                type: "CHANNEL_CREATE",
                limit: 1,
            })
        ).entries.first();

        logEmbed(
            channel.guild,
            new MessageEmbed()
                .setTitle("Channel Created")
                .addField("Channel Name", channel.name)
                .addField("Created By", logEntry?.executor)
                .setColor("RANDOM")
                .setTimestamp()
        );
    },
} as EventHandler;
