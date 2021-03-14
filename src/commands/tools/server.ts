import { Command } from "@aeroware/aeroclient/dist/types";
import { Guild, MessageEmbed } from "discord.js";
import {
    REGION_AU,
    REGION_BR,
    REGION_EU,
    REGION_HK,
    REGION_IN,
    REGION_JP,
    REGION_RU,
    REGION_SA,
    REGION_SG,
    REGION_US,
} from "../../utils/emojis";

export default {
    name: "server",
    aliases: ["guild"],
    category: "Tools",
    description: "Shows information about this guild",
    guildOnly: true,
    callback({ message }) {
        const guild = message.guild!;

        let region: string;
        switch (guild.region.toLowerCase()) {
            case "singapore":
                region = `${REGION_SG} Singapore`;
                break;

            case "southafrica":
                region = `${REGION_SA} South Africa`;
                break;

            case "russia":
                region = `${REGION_RU} Russia`;
                break;

            case "japan":
                region = `${REGION_JP} Japan`;
                break;

            case "india":
                region = `${REGION_IN} India`;
                break;

            case "honkkong":
                region = `${REGION_HK} Hong Kong`;
                break;

            case "europe":
                region = `${REGION_EU} Europe`;
                break;

            case "brazil":
                region = `${REGION_BR} Brazil`;
                break;

            case "sydney":
                region = `${REGION_AU} Sydney`;
                break;

            default:
                region = `${REGION_US} US ${
                    guild.region.split("-")[1]?.charAt(0).toUpperCase() +
                    guild.region.split("-")[1]?.substr(1).toLowerCase()
                }`;
                break;
        }

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
                        value: guild.members.cache.filter(
                            (m) =>
                                m.hasPermission("ADMINISTRATOR") && !m.user.bot
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
                        value: region,
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
