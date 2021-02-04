import { Command } from "@aeroware/aeroclient/dist/types";
import axios from "axios";
import { fromMorse } from "../../utils/morse";

export default {
    name: "unmorse",
    aliases: ["morsedecode"],
    category: "Fun",
    description: "Converts text into morse code",
    minArgs: 1,
    usage: "<text>",
    async callback({ message, args }) {
        const text = args.join(" ");

        message.channel.send(
            fromMorse(text) || "that text is not valid morse code"
        );
    },
} as Command;
