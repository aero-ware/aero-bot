import { Command } from "@aeroware/aeroclient/dist/types";
import { BEG } from "../../economy.json";
import { addCoins } from "../../utils/economy";

export default {
    name: "beg",
    category: "Economy",
    description: "go beg in your local alley",
    guildOnly: true,
    cooldown: 300,
    async callback({ message }) {
        const seed = Math.random();
        if (
            !Number.isInteger(BEG.WIN.MAX) ||
            !Number.isInteger(BEG.WIN.MIN) ||
            !Number.isInteger(BEG.WIN_CHANCE)
        )
            throw new TypeError(
                "BEG.WIN.MAX, BEG.WIN.MIN, and BEG.WIN_CHANCE in economy.json must be integers"
            );

        if (!Number.isInteger(BEG.LOSS.MAX) || !Number.isInteger(BEG.LOSS.MIN))
            throw new TypeError(
                "BEG.LOSS.MAX, BEG.LOSS.MIN, and BEG.LOSS_CHANCE in economy.json must be integers"
            );

        if (BEG.WIN_CHANCE < 1 || BEG.WIN_CHANCE > 100)
            throw new TypeError(
                "BEG.WIN_CHANCE must be an integer percentage between 1 and 100 in economy.json"
            );

        if (seed < BEG.WIN_CHANCE / 100) {
            const winAmount =
                Math.floor(Math.random() * (BEG.WIN.MAX - BEG.WIN.MIN)) +
                BEG.WIN.MIN;
            await addCoins(message.guild!.id, message.author.id, winAmount);
            message.channel.send(
                `${winAmount} coins have been added to your account!`
            );
            return;
        }

        const loseAmount = -(
            Math.floor(Math.random() * (BEG.LOSS.MAX - BEG.LOSS.MIN)) +
            BEG.LOSS.MIN
        );
        await addCoins(message.guild!.id, message.author.id, loseAmount);
        message.channel.send(
            `For begging illegally, you have been fined ${-loseAmount} coins`
        );
    },
} as Command;
