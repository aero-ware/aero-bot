import { Command } from "@aeroware/aeroclient/dist/types";
import { DAILY } from "../../../../economy.json";
import { addCoins } from "../../../utils/economy";

export default {
    name: "daily",
    category: "Economy",
    description: "Gives you your daily reward!",
    guildOnly: true,
    cooldown: 86400,
    async callback({ message }) {
        if (!Number.isInteger(DAILY))
            throw new TypeError("DAILY must be an integer in economy.json");

        await addCoins(message.guild!.id, message.member!.id, DAILY);
        message.channel.send(`${DAILY} coins have been added to your account!`);
    },
} as Command;
