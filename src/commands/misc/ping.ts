import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "ping",
    aliases: ["latency"],
    description: "Tells you the latency of bot and API ping",
    category: "Misc",
    callback({ message, client }) {
        message.channel.send("Calculating ping...").then(m => {
            const ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(`**Bot Latency:** ${ping}ms. **Discord API Latency:** ${client.ws.ping}ms.`);
        });
    }
} as Command;