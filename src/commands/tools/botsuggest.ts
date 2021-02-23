import { Command } from "@aeroware/aeroclient/dist/types";
import { MessageEmbed, TextChannel } from "discord.js";
import CONFIG from "../../../config.json";

export default {
    name: "botsuggest",
    aliases: ["suggestfeature", "bugreport"],
    category: "Tools",
    description: "Sends a message to the bot devs",
    details:
        "Found a bug? Want a feature added? Send us a message with this command!",
    minArgs: 1,
    usage: "[message]",
    callback({ message, args, client }) {
        const text = args.join(" ");
        const channel = client.channels.cache.get(CONFIG.SUGGESTION_CHANNEL);
        if (!(channel instanceof TextChannel))
            throw new TypeError(
                "suggestionChannel in .env is not a TextChannel"
            );
        const embed = channel.send(
            new MessageEmbed()
                .setDescription(
                    `${text}\n` +
                        "📊 Vote on this suggestion for it to be implemented!"
                )
                .setColor("YELLOW")
                .setTimestamp()
                .setAuthor(
                    message.author,
                    message.author.displayAvatarURL({ dynamic: true })
                )
        );

        ["👍", "👎"].forEach(async (e) => {
            await (await embed).react(e);
        });
    },
} as Command;
