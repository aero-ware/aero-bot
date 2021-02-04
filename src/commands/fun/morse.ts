import { Command } from "@aeroware/aeroclient/dist/types";
import axios from "axios";
import { toMorse } from "../../utils/morse";

export default {
    name: "morse",
    aliases: ["morsecode"],
    category: "Fun",
    description: "Converts text into morse code",
    minArgs: 1,
    usage: "<text>",
    async callback({ message, args }) {
        const text = args.join(" ");

        message.channel.send(toMorse(text));
    },
} as Command;
