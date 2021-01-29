import { Guild, MessageEmbed, TextChannel } from "discord.js";
import guilds from "../models/Guild";

/**
 * Logs an embed to the specified guild's logging channel (if it exists).
 * @param guild the guild whose channel to log to
 * @param embed the embed to log
 * @returns the message that results from sending, or null if the channel doesn't exist.
 * @throws TypeError if the logging channel was set to something other than a TextChannel.
 */
export default async function logEmbed(guild: Guild, embed: MessageEmbed) {
    const { logChannelId } = await guilds.findById(guild.id) as any;
    if (!logChannelId) return null;

    const logChannel = guild.channels.cache.get(logChannelId);
    if (logChannel instanceof TextChannel) {
        return await logChannel.send(embed);
    } else {
        throw new TypeError(`Log channel for ${guild.id} is not of type TextChannel`);
    }
}