import { Command } from "@aeroware/aeroclient/dist/types";
import guilds, { IGuildConfig } from "../../models/Guild";
import bans, { IBanInfo } from "../../models/Tempban";
import mutes, { IMuteInfo } from "../../models/Mute";
import { MessageAttachment } from "discord.js";

export default {
    name: "guilddata",
    aliases: ["serverdata"],
    description:
        "Server owner only command that sends data stored about this server.",
    details: "Sends it in a JSON file in DMs",
    guildOnly: true,
    guarded: true,
    async callback({ message }) {
        if (message.author.id !== message.guild!.ownerID) {
            message.channel.send("You are not the owner of this server.");
            return;
        }

        const guildInfo = {
            guildID: message.guild!.id,
            config: (await guilds.findById(message.guild!.id)) as IGuildConfig,
            tempMutes: (await mutes.find({
                guildId: message.guild!.id,
            })) as IMuteInfo[],
            tempBans: (await bans.find({
                guildId: message.guild!.id,
            })) as IBanInfo[],
        };

        message.author
            .send(
                `server data for ${message.guild!.name}`,
                new MessageAttachment(
                    Buffer.from(
                        JSON.stringify(
                            guildInfo,
                            (k, v) =>
                                k === "__v" || k === "_id" || k === "guildId"
                                    ? undefined
                                    : v,
                            4
                        ),
                        "utf-8"
                    ),
                    `guilddata-${message.guild!.name}.json`
                )
            )
            .catch(() =>
                message.channel.send(
                    "Due to the possibly sensitive nature of this data, I can only send it to you in DMs. Please enable DMs from me and try again"
                )
            );
    },
} as Command;
