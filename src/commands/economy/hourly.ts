import { Command } from "@aeroware/aeroclient/dist/types";
import { HOURLY } from "../../../economy.json";
import { addCoins } from "../../utils/economy";

export default {
    name: "hourly",
    category: "Economy",
    description: "Gives you your daily reward!",
    guildOnly: true,
    cooldown: 3600,
    async callback({ message }) {
        if (!Number.isInteger(HOURLY))
            throw new TypeError("HOURLY must be an integer in economy.json");

        await addCoins(message.guild!.id, message.member!.id, HOURLY);
        message.channel.send(
            `${HOURLY} coins have been added to your account!`
        );
    },
} as Command;
