import { Command } from "@aeroware/aeroclient/dist/types";
import { addCoins } from "../../utils/economy";

export default {
    name: "addbal",
    aliases: ["addbalance"],
    minArgs: 1,
    maxArgs: 2,
    staffOnly: true,
    guildOnly: true,
    usage: "<user/id> <amount>",
    description: "Adds the specified amount to the user's balance",
    category: "Economy",
    async callback({ message, args }) {
        const target =
            message.mentions.members?.first() ||
            (await message.guild!.members.fetch(args[0])) ||
            message.member;

        let coins: number;
        try {
            coins = parseInt(args[1]);
        } catch (e) {
            message.channel.send("Please provide a valid number of coins.");
            return;
        }

        const userCoins = await addCoins(message.guild!.id, target.id, coins);
        message.channel.send(
            `You have given ${target} ${coins} coins. They now have ${userCoins} coins.`,
            {
                allowedMentions: {
                    users: [],
                },
            }
        );
    },
} as Command;
