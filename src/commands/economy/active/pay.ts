import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed } from "discord.js";
import { addCoins, getCoins } from "../../../utils/economy";

export default {
    name: "pay",
    category: "Economy",
    description: "Pay a friend some money",
    details: "Ping a user to give them money",
    guildOnly: true,
    minArgs: 2,
    usage: "<user> <amount>",
    async callback({ message, args }) {
        const target = message.mentions.members?.first();
        if (!target) {
            message.channel.send("Please provide someone to pay.");
            return;
        }

        let amount: number;
        try {
            amount = parseInt(args[1]);
        } catch (e) {
            message.channel.send(
                "Please provide a valid number of coins to pay"
            );
            return;
        }

        if (amount > (await getCoins(message.guild!.id, message.author.id))) {
            message.channel.send("You cannot pay more coins than you have.");
            return;
        }

        await addCoins(message.guild!.id, message.author.id, -amount);
        await addCoins(message.guild!.id, target.id, amount);

        message.channel.send(
            new MessageEmbed()
                .setTitle("Transaction Successful")
                .addFields(
                    {
                        name: "From",
                        value: message.member,
                    },
                    {
                        name: "To",
                        value: target,
                    },
                    {
                        name: "Amount",
                        value: amount,
                    }
                )
                .setColor("RANDOM")
                .setTimestamp()
        );
    },
} as Command;
