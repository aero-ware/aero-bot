import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import members from "../../models/Member";

export default {
    name: "removedata",
    description: "Removes your data from the database",
    details: "THIS ACTION IS NOT REVERSIBLE",
    category: "Data",
    async callback({ message, client }) {
        const confirmation = await message.channel.send(
            new MessageEmbed()
                .setTitle("Remove User Data")
                .setDescription("Are you sure you want to remove ALL your data from the database?\n" +
                " **THIS IS NOT REVERSIBLE.**\n" +
                "Please note that your puishments will not be removed.")
                .addField(
                    "What data will be lost?",
                    "- your coins in all servers you are a part of\n" +
                    "- your levels and XP in all servers you are a part of"
                )
        );
        
        const yesOrNo = ["✅", "❌"];

        yesOrNo.forEach(async e => await confirmation.react(e));

        const choice = (
            await confirmation.awaitReactions(
                (r, u) => yesOrNo.includes(r.emoji.name) &&
                    u.id === message.author.id,
                {
                    max: 1,
                    time: 15000,
                }
            )
        ).first();

        confirmation.reactions.removeAll()

        if (!choice || choice.emoji.name === yesOrNo[1]) {
            message.channel.send("Not removing your data.");
            return;
        }

        if (client.clientOptions.staff?.includes(message.author.id)) {
            message.channel.send("You are a staff member. If you really want your data removed please contact the owner.");
            return;
        }

        message.channel.send("Deleting your data...")
        message.channel.startTyping();
        await members.updateMany(
            { userId: message.author.id },
            {
                coins: 0,
                xp: 0,
                level: 1,
                nextXPAdd: new Date()
            }
        );
        message.channel.stopTyping();
        message.channel.send("Deletion complete.");
    }
} as Command;