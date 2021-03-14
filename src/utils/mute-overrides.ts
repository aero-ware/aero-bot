import {
    GuildChannel,
    TextChannel,
    VoiceChannel,
    CategoryChannel,
    RoleResolvable,
} from "discord.js";

/**
 * Applies permission overrides to a channel so that a given role is muted.
 * Denies the following permissions:
 *
 * | Channel Type | Channel Permissions |
 * | --- | --- |
 * | VoiceChannel | CONNECT |
 * | TextChannel | SEND_MESSAGES |
 * | CategoryChannel | CONNECT, SEND_MESSAGES |
 *
 * @param channel The channel to apply muted role overrides to
 * @param role The role that is being muted
 */
export default function muteOverrides(
    channel: GuildChannel,
    role: RoleResolvable
) {
    if (channel instanceof VoiceChannel) {
        channel.updateOverwrite(role, {
            CONNECT: false,
        });
    } else if (channel instanceof TextChannel) {
        channel.updateOverwrite(role, {
            SEND_MESSAGES: false,
        });
    } else if (channel instanceof CategoryChannel) {
        channel.updateOverwrite(role, {
            CONNECT: false,
            SEND_MESSAGES: false,
        });
    }
}
