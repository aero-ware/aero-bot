import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { Guild, MessageEmbed, TextChannel } from "discord.js";
import guilds from "../models/Guild";
import members from "../models/Member";

export default {
    name: "guildCreate",
    async callback(guild: Guild) {
        if (!guild.me?.hasPermission("ADMINISTRATOR")) {
            const channel =
                guild.systemChannel ||
                (guild.channels.cache.find(
                    (c) => c.type === "text"
                ) as TextChannel);
            channel.send(
                new MessageEmbed()
                    .setTitle("Missing Permissions")
                    .setDescription(
                        "AeroBot requires the `ADMINISTRATOR` permission to work properly. Without it many functions will not work.\n" +
                            "Please re-invite me from the [right link.](https://top.gg/bot/787460489427812363)"
                    )
                    .setColor("RED")
            );
            return;
        }

        guilds.create({
            _id: guild.id,
        });

        (await guild.members.fetch()).each((member) => {
            members.create({
                guildId: guild.id,
                userId: member.id,
            });
        });
    },
} as EventHandler;
