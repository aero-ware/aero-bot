import { Command } from "@aeroware/aeroclient/dist/types";
import { Message } from "discord.js";

export default {
    name: "poll",
    category: "Tools",
    description: "Adds a poll to the specified message.",
    details:
        "provide a message using its ID. **ONLY WORKS IN THE SAME CHANNEL AS THE MESSAGE**",
    minArgs: 1,
    usage: "<message ID>",
    async callback({ message, args }) {
        let pollMessage: Message;
        try {
            pollMessage = await message.channel.messages.fetch(args[0]);
        } catch (e) {
            message.channel.send("Invalid Message ID provided.");
            return;
        }

        if (!pollMessage) {
            message.channel.send(`Message with ID ${args[0]} not found.`);
            return;
        }

        if (message.deletable) message.delete();

        ["👍", "👎"].forEach(async (e) => await pollMessage.react(e));
    },
} as Command;
