import { Command } from "@aeroware/aeroclient/dist/types";
import { Message, MessageEmbed } from "discord.js";
import guilds, { IGuildConfig } from "../../models/Guild";
import muteOverrides from "../../utils/mute-overrides";

export default {
    name: "config",
    aliases: ["settings"],
    category: "Tools",
    description: "Shows or sets the configuration options for this server.",
    details:
        "Run `config help` to see all the things you can do in this command.",
    guarded: true,
    guildOnly: true,
    permissions: ["ADMINISTRATOR"],
    async callback({ message, args }): Promise<any> {
        const configItem = args[0];
        const guildInfo = (await guilds.findById(
            message.guild!.id
        )) as IGuildConfig;
        if (!configItem) {
            const configEmbed = new MessageEmbed()
                .setTitle(`Config for ${message.guild!.name}`)
                .addFields(
                    {
                        name: "Welcome Message Channel",
                        value: guildInfo.welcomeChannelId
                            ? `<#${guildInfo.welcomeChannelId}>`
                            : "none",
                    },
                    {
                        name: "Welcome Message",
                        value: guildInfo.welcomeText
                            ? guildInfo.welcomeText?.replace(
                                  /<@>/g,
                                  "<user ping>"
                              )
                            : "none",
                    },
                    {
                        name: "Mod Logs Channel",
                        value: guildInfo.logChannelId
                            ? `<#${guildInfo.logChannelId}>`
                            : "none",
                    },
                    {
                        name: "Muted Role",
                        value: guildInfo.mutedRoleId
                            ? `<@&${guildInfo.mutedRoleId}>`
                            : "none",
                    },
                    {
                        name: "Days of Messages to delete on ban",
                        value: guildInfo.banPurgeDays || 0,
                    },
                    {
                        name: "Advertising channels",
                        value:
                            guildInfo.adChannels.length > 0
                                ? guildInfo.adChannels
                                      ?.map((c: any) => `<#${c}>`)
                                      .join(",\n")
                                : "none",
                    },
                    {
                        name: "Blacklisted words",
                        value:
                            guildInfo.blacklistedWords.length > 0
                                ? guildInfo.blacklistedWords.join(", ")
                                : "none",
                    },
                    {
                        name: "Autorole",
                        value:
                            guildInfo.autoRole !== null
                                ? `<@&${guildInfo.autoRole}>`
                                : "none",
                    },
                    {
                        name: "Levels Enabled",
                        value: guildInfo.levelsEnabled ? "yes" : "no",
                    },
                    {
                        name: "Suggestions Channels",
                        value:
                            guildInfo.suggestionChannels.length > 0
                                ? guildInfo.suggestionChannels
                                      .map((v) => `<#${v}>`)
                                      .join(", ")
                                : "none",
                    }
                )
                .setColor("RANDOM")
                .setTimestamp();

            return message.channel.send(configEmbed);
        }
        switch (configItem.toLowerCase()) {
            case "welcomechannel":
                if (!args[1])
                    return message.channel.send(
                        `The welcome channel is: <#${
                            guildInfo.welcomeChannelId || "not set"
                        }>.`
                    );

                if (args[1] === "none") {
                    guildInfo.welcomeChannelId = null;
                    await guildInfo.save();
                    return message.channel.send(
                        "The welcome channel has been unset."
                    );
                }

                if (!message.guild!.channels.cache.has(args[1]))
                    return message.channel.send("Invalid Channel ID.");
                guildInfo.welcomeChannelId = args[1];
                await guildInfo.save();

                if (!guildInfo.welcomeText)
                    message.channel.send(
                        "The welcome message has not been set. Use `config welcomemessage <text>` to set it."
                    );
                return message.channel.send(
                    `The Welcome message channel is <#${args[1]}>`
                );

            case "welcomemessage":
                if (!args[1])
                    return message.channel.send(
                        `The welcome message is: \`${
                            guildInfo.welcomeText || "not set"
                        }\`.`
                    );

                if (args[1] === "none") {
                    guildInfo.welcomeText = null;
                    await guildInfo.save();
                    return message.channel.send(
                        "The welcome message has been unset."
                    );
                }

                guildInfo.welcomeText = args.slice(1).join(" ");
                await guildInfo.save();

                if (!guildInfo.welcomeChannelId)
                    message.channel.send(
                        "The welcome message channel has not been set. Use `config welcomechannel <channel id>` to set it."
                    );
                return message.channel.send(
                    `The welcome message has been set to ${args
                        .slice(1)
                        .join(" ")
                        .replace(/<@>/g, "<user ping>")}`
                );

            case "logchannel":
                if (!args[1])
                    return message.channel.send(
                        `The logging channel is: <#${guildInfo.logChannelId}>`
                    );

                if (args[1] === "none") {
                    guildInfo.logChannelId = null;
                    await guildInfo.save();
                    return message.channel.send(
                        "The logging channel has been unset."
                    );
                }

                if (!message.guild!.channels.cache.has(args[1]))
                    return message.channel.send("Invalid Channel ID.");
                guildInfo.logChannelId = args[1];
                await guildInfo.save();

                return message.channel.send(
                    `The logging chanel has been set to <#${args[1]}>.`
                );

            case "mutedrole":
                if (!args[1])
                    return message.channel.send(
                        `The muted role is: <@&${guildInfo.mutedRoleId}>.`,
                        {
                            allowedMentions: {
                                roles: [],
                            },
                        }
                    );

                if (args[1] === "none") {
                    guildInfo.mutedRoleId = null;
                    await guildInfo.save();
                    return message.channel.send(
                        "The muted role has been unset."
                    );
                }

                if (!message.guild!.roles.cache.has(args[1]))
                    return message.channel.send("Invalid Role ID.");
                guildInfo.mutedRoleId = args[1];
                await guildInfo.save();

                // set channel overrides to not let muted role talk or connect.
                message.guild!.channels.cache.each((c) =>
                    muteOverrides(c, args[1])
                );
                return message.channel.send(
                    `The muted role has been set to <@&${args[1]}>.`,
                    {
                        allowedMentions: {
                            roles: [],
                        },
                    }
                );

            case "bandelete":
                if (!args[1])
                    return message.channel.send(
                        `${guildInfo.banPurgeDays} days of messages will be deleted when a user is banned.`
                    );

                let argAsNum: number;
                try {
                    argAsNum = parseInt(args[1]);
                } catch (e) {
                    return message.channel.send("Please enter a valid number.");
                }

                if (argAsNum > 7)
                    return message.channel.send(
                        "Cannot delete more than 7 days of messages."
                    );
                else if (argAsNum < 0)
                    return message.channel.send(
                        "Please enter a positive number."
                    );

                guildInfo.banPurgeDays = argAsNum;
                await guildInfo.save();

                return message.channel.send(
                    `${args[1]} days of messages will be deleted when a user is banned.`
                );

            case "adchannels":
                if (!args[1])
                    return message.channel.send(
                        `The advertising channels are: ${guildInfo.adChannels
                            .map((c: any) => `<#${c}>`)
                            .join(" ")}`
                    );

                if (args[1] !== "add" && args[1] !== "remove")
                    return message.channel.send(
                        "For your second argument, you must either provide `add` or `remove` and provide channel ID next"
                    );

                await changeAdChannels(args[1], args[2], message);

                return message.channel.send(
                    `<#${args[2]}> has been ${
                        args[1] === "add" ? "added to" : "removed from"
                    } the list of advertising channels.`
                );

            case "blacklistedwords":
                if (!args[1])
                    return message.channel.send(
                        `The blacklisted words are: \`${guildInfo.blacklistedWords.join(
                            ", "
                        )}\`.`,
                        {
                            split: true,
                            allowedMentions: {
                                users: [],
                                roles: [],
                            },
                        }
                    );

                if (args[1] !== "add" && args[1] !== "remove")
                    return message.channel.send(
                        "For your second argument, you must either provide `add` or `remove` and provide the string next"
                    );
                await changeBlacklistedWords(
                    args[1],
                    args.slice(2).join(" "),
                    message
                );

                return message.channel.send(
                    `${args.slice(2).join(" ")} has been ${
                        args[1] === "add"
                            ? "added to"
                            : "removed from (if it was there)"
                    } the list of blacklisted strings.`
                );

            case "autorole":
                if (!args[1])
                    return message.channel.send(
                        `The autorole is: <@&${guildInfo.autoRole}>.`,
                        {
                            allowedMentions: {
                                roles: [],
                            },
                        }
                    );

                if (!message.guild!.roles.cache.has(args[1]))
                    return message.channel.send("Invalid Role ID.");
                guildInfo.autoRole = args[1];
                await guildInfo.save();

                return message.channel.send(
                    `<@&${args[1]}> has been set as the autorole.`,
                    {
                        allowedMentions: {
                            roles: [],
                        },
                    }
                );

            case "leveling":
                if (!args[1])
                    return message.channel.send(
                        `Leveling is currently ${
                            guildInfo.levelsEnabled ? "enabled" : "disabled"
                        }.`
                    );

                if (/(enabled?)|(on)|(true)|(y(es)?)/.test(args[1])) {
                    (guildInfo.levelsEnabled = true), await guildInfo.save();
                    return message.channel.send("Leveling is now enabled.");
                } else if (/(disabled?)|(off)|(false)|(no?)/.test(args[1])) {
                    guildInfo.levelsEnabled = false;
                    await guildInfo.save();
                    return message.channel.send("Leveling is now disabled.");
                } else
                    return message.channel.send(
                        "Please provide `on` or `off` as an argument."
                    );

            case "suggestions":
                if (!args[1])
                    return message.channel.send(
                        `The suggestions channels are: ${guildInfo.suggestionChannels
                            .map((v) => `<#${v}>`)
                            .join(", ")}`
                    );
                const [_, add, ...channels] = args;
                if (add === "add") {
                    guildInfo.suggestionChannels.push(...channels);
                } else if (add === "remove") {
                    guildInfo.suggestionChannels = guildInfo.suggestionChannels.filter(
                        (v) => !channels.includes(v)
                    );
                }
                await guildInfo.save();

                return message.channel.send(
                    `${channels.map((v) => `<#${v}>`).join(", ")} were ${
                        add === "add" ? "added to" : "removed from"
                    } the list of suggestions channels.`
                );

            case "help":
                return message.channel.send(
                    new MessageEmbed()
                        .setTitle("Config command help")
                        .addFields(
                            {
                                name: "See the Configuration",
                                value:
                                    "Run `config` or `config <itemName>` to see the config",
                            },
                            {
                                name: "Set the Welcome Message Channel",
                                value:
                                    "Run `config welcomechannel <channel ID>` to set it",
                            },
                            {
                                name: "Set the Welcome Message",
                                value:
                                    "Run `config welcomemessage <text>` to set it",
                            },
                            {
                                name: "Set the Logging Channel",
                                value:
                                    "Run `config logchannel <channel ID>` to set it",
                            },
                            {
                                name: "Set the Muted Role",
                                value:
                                    "Run `config mutedrole <role ID>` to set it",
                            },
                            {
                                name:
                                    "Set the number of days of messages to delete from a banned user",
                                value:
                                    "Run `config bandelete <number>` to set it",
                            },
                            {
                                name: "Set the Blacklsted words",
                                value:
                                    "Run `config blacklistedword <add/remove> <word(s)>\n**Note:** The whole string will be added to provide more flexibility.",
                            },
                            {
                                name: "Set the autorole",
                                value:
                                    "Run `config autorole <role ID>` to set it.",
                            },
                            {
                                name: "Enable/Disable Leveling",
                                value: "Run `config leveling <on/off>`",
                            },
                            {
                                name: "Add suggestion channels",
                                value:
                                    "Run `config suggestions <add/remove> <channelID(s)>`",
                            }
                        )
                        .setTimestamp()
                        .setColor("RANDOM")
                );

            default:
                return message.channel.send(
                    "Unrecognized config item. Run `config help` to see them all."
                );
        }
    },
} as Command;

async function changeAdChannels(
    op: "add" | "remove",
    id: string,
    message: Message
) {
    if (op === "add") {
        await guilds.findByIdAndUpdate(
            message.guild!.id,
            {
                _id: message.guild!.id,
                $push: {
                    addChannels: id,
                },
            },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
    } else if (op === "remove") {
        await guilds.findByIdAndUpdate(
            message.guild!.id,
            {
                _id: message.guild!.id,
                $pull: {
                    addChannels: id,
                },
            },
            {
                setDefaultsOnInsert: true,
                upsert: true,
            }
        );
    }
}

async function changeBlacklistedWords(
    op: "add" | "remove",
    word: string,
    message: Message
) {
    if (op === "add") {
        await guilds.findByIdAndUpdate(
            message.guild!.id,
            {
                _id: message.guild!.id,
                $push: {
                    blacklistedWords: word,
                },
            },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );
    } else {
        await guilds.findByIdAndUpdate(message.guild!.id, {
            _id: message.guild!.id,
            $pull: {
                blacklistedWords: word,
            },
        });
    }
}
