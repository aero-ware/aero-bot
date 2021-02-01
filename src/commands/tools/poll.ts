import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "poll",
    category: "Tools",
    description: "Adds a poll to the specified message.",
    details:
        "provide a message using its ID. **ONLY WORKS IN THE SAME CHANNEL AS THE MESSAGE**",
    minArgs: 1,
    usage: "<message ID>",
    async callback({ message, args }) {
        const pollMessage = await message.channel.messages.fetch(args[0]);
        if (!pollMessage) {
            message.channel.send(`Message with ID ${args[0]} not found.`);
            return;
        }

        if (message.deletable) message.delete();

        ["👍", "👎"].forEach(async (e) => await pollMessage.react(e));
    },
} as Command;
