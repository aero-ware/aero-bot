import { Command } from "@aeroware/aeroclient/dist/types";
import axios from "axios";

export default {
    name: "unmorse",
    aliases: ["morsedecode"],
    category: "Fun",
    description: "Converts text into morse code",
    minArgs: 1,
    usage: "<text>",
    async callback({ message, args }) {
        const text = args.join(" ");

        try {
            const { data: morse } = (await axios.get("https://api.snowflakedev.xyz/api/morse/decode", {
                headers: {
                    Authorization: process.env.snowflakeToken,
                },
                params: {
                    text,
                },
            })).data;

            message.channel.send(morse);
        } catch (e) {
            message.channel.send("There was an API error or your entered text was not valid morse code.");
        }
    }
} as Command;