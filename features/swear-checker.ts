import AeroClient from "@aeroware/aeroclient";
import guildSchema from "../schemas/guild-schema";

export default async (client: AeroClient, isEnabled: boolean) => {
    client.on("message", async (message) => {
        if (!message.guild || message.webhookID || message.author.bot) return;
        //@ts-ignore
        const { blacklistedWords } = (await guildSchema.findOne({ _id: message.guild.id })) || { blacklistedWords: null };
        //@ts-ignore
        if (!blacklistedWords || !blacklistedWords.length > 0) return;
        let offendingMessage = false;
        for (const word of blacklistedWords) {
            if (message.content.toLowerCase().includes(word.toLowerCase())) offendingMessage = true;
        }
        if (offendingMessage && !message.member?.hasPermission("ADMINISTRATOR")) {
            message.delete();
            message.author.send("that word is not allowed here!").catch(() => message.reply("that word is not allowed here!"));
        }
    });
};

export const config = {
    displayName: "blacklisted-words",
    dbName: "BLACKLISTED-WORDS",
    loadDBFirst: true,
};
