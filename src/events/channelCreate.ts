import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { DMChannel, GuildChannel, MessageEmbed } from "discord.js";
import guilds from "../models/Guild";
import logEmbed from "../utils/logging";
import muteOverrides from "../utils/mute-overrides";

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

        handleMuteOverrides(channel);
    },
} as EventHandler;

async function handleMuteOverrides(channel: GuildChannel) {
    const mutedRoleId = (await guilds.findById(channel.guild.id))?.mutedRoleId;
    if (!mutedRoleId) return;

    muteOverrides(channel, mutedRoleId);
}
