import AeroClient from "@aeroware/aeroclient";
import { GuildMember, TextChannel } from "discord.js";
import guildSchema from "../schemas/guild-schema";

export default (client: AeroClient, isEnabled: boolean) => {
    const onJoin = async (member: GuildMember) => {
        let data = [];

        const result = await guildSchema.findOne({ _id: member.guild.id });
        if (!result) return;

        //@ts-ignore
        data = [result.welcomeChannelId, result.welcomeText];

        if (!data) return;
        const [channelId, text] = data;
        const channel = member.guild.channels.cache.find((channel) => channel.id === channelId) as TextChannel;

        if (!channel) return;
        channel.send(text.replace(/<@>/g, `${member}`));
    };

    client.on("guildMemberAdd", async (member) => {
        await onJoin(member);
    });
};

export const config = {
    displayName: "welcomeMessage",
    dbName: "WELCOME-MESSAGE", // DO NOT CHANGE
    loadDBfirst: true,
};
