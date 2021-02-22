import { Command } from "@aeroware/aeroclient/dist/types";
import ms from "ms";

export default {
    name: "uptime",
    category: "utility",
    description: "shows you the uptime of the bot",
    details: "...",
    callback({ message, client }) {
        message.channel.send(
            `My uptime is **${ms(client.uptime!, { long: true })}**`
        );
    },
} as Command;
