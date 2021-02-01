import { Command } from "@aeroware/aeroclient/dist/types";
import { Message, MessageEmbed, Collection } from "discord.js";

const games = new Collection<string, number>();

const CONFIG = {
    MIN: 0,
    MAX: 50,
    TRIES: 5,
};

export default {
    name: "guess",
    category: "Fun",
    description: "Guess the number to win the game !",
    guildOnly: true,
    async callback({ message }): Promise<any> {
        if (games.has(message.channel.id))
            return message.channel.send(
                new MessageEmbed()
                    .setTitle("Error")
                    .setDescription("Only one game is allowed per channel.")
                    .setColor("RANDOM")
            );

        const random =
            Math.floor(Math.random() * (CONFIG.MAX - CONFIG.MIN)) + CONFIG.MIN;

        message.channel.send(
            new MessageEmbed()
                .setTitle("Guess the number")
                .setDescription(
                    `The number is between ${CONFIG.MIN} and ${CONFIG.MAX}\n You have **${CONFIG.TRIES}** tries to guess it.`
                )
                .setColor("RANDOM")
        );

        games.set(message.channel.id, 0);

        await play(message, random);

        games.delete(message.channel.id);
    },
} as Command;

async function play(message: Message, num: number): Promise<any> {
    const collected = await message.channel.awaitMessages(
        (m) => m.author.id === message.author.id,
        { max: 1, time: 30000 }
    );
    if (collected.size === 0)
        return message.channel.send(
            "Ending game, over 30 seconds of inactivity."
        );

    let argNum: number;
    try {
        argNum = parseInt(collected.first()!.content);
    } catch (e) {
        return play(message, num);
    }

    if (!argNum || isNaN(argNum)) return play(message, num);

    games.set(message.channel.id, games.get(message.channel.id)! + 1);

    if (games.get(message.channel.id)! > CONFIG.TRIES)
        return play(message, num);

    if (argNum === num)
        return message.channel.send(
            new MessageEmbed()
                .setTitle("The number has been found!")
                .setDescription(
                    `You found the number in **${games.get(
                        message.channel.id
                    )}** tries!\n It was **${num}**`
                )
                .setColor("RANDOM")
                .setTimestamp()
        );

    message.channel.send(
        new MessageEmbed()
            .setTitle(
                `${argNum} is ${
                    argNum > num ? "greater than" : "less than"
                } the secret number.`
            )
            .setDescription(
                `You have ${
                    CONFIG.TRIES - games.get(message.channel.id)!
                } tries left.`
            )
            .setColor("RANDOM")
    );

    return play(message, num);
}
