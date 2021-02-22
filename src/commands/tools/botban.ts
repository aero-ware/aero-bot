import { Command } from "@aeroware/aeroclient/dist/types";
import { addMilliseconds } from "date-fns";
import { MessageEmbed } from "discord.js";
import ms from "ms";
import botbans from "../../models/Botban";

export default {
    name: "botban",
    category: "Tools",
    description:
        "Disallow a user from using any command not in the 'fun' category",
    details: "Provide a user's ID.",
    usage: "<user id> [duration] [reason]",
    minArgs: 1,
    staffOnly: true,
    async callback({ message, args, client }) {
        const target =
            (await client.users.fetch(args[0]).catch()) ||
            message.mentions.users.first();
        if (!target) return;

        if ((await botbans.find({ userId: target.id })).length !== 0) {
            message.channel.send("This user is already botbannned.");
            return;
        }

        let reason: string;

        if (ms(args[1])) {
            // there is a duration
            reason = args.slice(2).join(" ");
            const duration = ms(args[1]);
            await botbans.create({
                userId: target.id,
                endTime: addMilliseconds(Date.now(), duration),
            });
        } else {
            // permanent ban
            reason = args.slice(1).join(" ");
            await botbans.create({
                userId: target.id,
                endTime: null,
            });
        }

        const dm = await target.createDM();
        dm.send(
            new MessageEmbed()
                .setTitle("You have been banned from using me")
                .addField(
                    "Duration",
                    ms(args[1]) ? ms(ms(args[1]), { long: true }) : "Forever"
                )
                .addField("Reason", reason || "No reason provided")
        );
    },
} as Command;
