import { Command } from "@aeroware/aeroclient/dist/types";
import members, { IMemberInfo } from "../../models/Member";
import bans, { IBanInfo } from "../../models/Tempban";
import mutes, { IMuteInfo } from "../../models/Mute";
import { MessageAttachment } from "discord.js";

export default {
    name: "userdata",
    description: "Sends you a JSON file with all data we have on you",
    details: "Should you want your data removed run `removedata`.",
    category: "Data",
    guarded: true,
    async callback({ message }) {
        const userdata = {
            userID: message.author.id,
            memberInfo: await members.find({ userId: message.author.id }) as IMemberInfo[],
            tempBans: await bans.find({ userId: message.author.id }) as IBanInfo[],
            tempMutes: await mutes.find({ userId: message.author.id }) as IMuteInfo[],
        };

        message.author.send(
            "Your userdata",
            new MessageAttachment(
                Buffer.from(
                        JSON.stringify(
                            userdata,
                            (k, v) => 
                                (k === "__v" || k === "_id" || k === "userId")
                                ? undefined
                                : v,
                            4,
                    ),
                    "utf-8"
                ),
                `userdata-${message.author.username}${message.author.discriminator}.json`
            )
        )
        .catch(
            () =>
                message.channel.send("Due to the possibly sensitive nature of userdata, I can only send it in DMs. Please enable DMs from me and try again")
        );
    }
} as Command;