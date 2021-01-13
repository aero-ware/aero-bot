import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/types";
import * as economy from "../../util/economy";

export default {
    name: "addbal",
    aliases: ["addbalance"],
    minArgs: 1,
    maxArgs: 2,
    staffOnly: true,
    usage: "<targer user ping|id> <amount>",
    description: "adds money to the target user's bank",
    category: "economy",
    callback: async ({ message, args, client }) => {
        const target = utils.parseUsers(args, message)[0];
        if (!target) return;

        const coins = args[1];
        if (!parseInt(coins)) return message.reply("Please provide a valid number of coins.");
        const newCoins = await economy.addCoins(message.guild?.id!, target.id, parseInt(coins));
        return message.reply(
            `You have given ${target} ${coins} ${parseInt(coins) === 1 ? "coin" : "coins"}. They now have ${newCoins} ${newCoins === 1 ? "coin" : "coins"}.`
        );
    },
} as Command;
