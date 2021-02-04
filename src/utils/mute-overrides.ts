import {
    GuildChannel,
    TextChannel,
    VoiceChannel,
    CategoryChannel,
    RoleResolvable,
} from "discord.js";

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
