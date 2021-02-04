import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { Message, MessageEmbed } from "discord.js";
import guilds, { IGuildConfig } from "../models/Guild";
import log from "../utils/logging";

export default {
    name: "messageDelete",
    async callback(message: Message) {
        const guildInfo = message.guild
            ? ((await guilds.findById(message.guild.id)) as IGuildConfig)
            : null;
        if (guildInfo) {
            log(
                message.guild!,
                new MessageEmbed()
                    .setTitle("Message Deleted")
                    .setColor("RANDOM")
                    .addFields(
                        {
                            name: "Author",
                            value: message.author,
                        },
                        {
                            name: "Content",
                            value:
                                message.content ||
                                (message.embeds.length > 0
                                    ? "<embed>"
                                    : "<attachment>"),
                        }
                    )
                    .setTimestamp()
            );
        }
    },
} as EventHandler;
