import AeroClient from "@aeroware/aeroclient";
import guildSchema from "../schemas/guild-schema";

export default async (client: AeroClient, isEnabled: boolean) => {
    client.on("messageDelete", async (message) => {
        if (message.partial) message = await message.fetch();
        if (!message.guild) return;

        //@ts-ignore
        let { snipes } = guildSchema.findOne({ _id: message.guild.id });
        if (!snipes) snipes = {};

        snipes[message.channel.id] = {
            id: message.id,
            content: message.content,
            author: message.author.id,
            timestamp: message.createdTimestamp,
        };

        await guildSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                snipes,
            },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        console.log("updated snipe message for channel " + message.channel.id);
    });
};

export const config = {
    displayName: "snipe",
    dbName: "SNIPE",
};
