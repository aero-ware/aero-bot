import { Command } from "@aeroware/aeroclient/dist/types";
import { Guild, MessageEmbed } from "discord.js";

export default {
    name: "server",
    aliases: ["guild"],
    category: "Tools",
    description: "Shows information about this guild",
    guildOnly: true,
    callback({ message }) {
        const guild = message.guild!;
        message.channel.send(
            new MessageEmbed()
                .setTitle(guild.name)
                .addFields(
                    {
                        name: "Members",
                        value: guild.memberCount,
                        inline: true,
                    },
                    {
                        name: "People",
                        value: guild.members.cache.filter((m) => !m.user.bot)
                            .size,
                        inline: true,
                    },
                    {
                        name: "Bots",
                        value: guild.members.cache.filter((m) => m.user.bot)
                            .size,
                        inline: true,
                    },
                    {
                        name: "Owner",
                        value: guild.owner,
                    },
                    {
                        name: "Channels",
                        value: Object.keys(channelInfo(guild)).map((k) => {
                            // @ts-ignore
                            return channelInfo(guild)[k] > 0
                                ? // @ts-ignore
                                  `**${k}:** ${channelInfo(guild)[k]}`
                                : "";
                        }),
                        inline: true,
                    },
                    {
                        name: "Roles",
                        value: guild.roles.cache.size,
                        inline: true,
                    },
                    {
                        name: "Admins",
                        value: guild.members.cache.filter((m) =>
                            m.hasPermission("ADMINISTRATOR")
                        ).size,
                        inline: true,
                    },
                    {
                        name: "Server Boost Level",
                        value: guild.premiumTier,
                        inline: true,
                    },
                    {
                        name: "Server Boosts",
                        value: guild.premiumSubscriptionCount,
                        inline: true,
                    },
                    {
                        name: "Region",
                        value: guild.region,
                        inline: true,
                    }
                )
                .setThumbnail(guild.iconURL({ dynamic: true }) || "")
                .setColor("RANDOM")
                .setTimestamp()
        );
    },
} as Command;

function channelInfo(guild: Guild) {
    const channels = {
        text: 0,
        voice: 0,
        category: 0,
        news: 0,
        store: 0,
        unknown: 0,
    };
    guild.channels.cache.each((c) => channels[c.type]++);
    return channels;
}
