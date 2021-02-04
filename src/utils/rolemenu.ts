import { GuildEmoji, MessageReaction, User } from "discord.js";
import guilds, { IGuildConfig } from "../models/Guild";

export default async function handleRoleMenu(
    reaction: MessageReaction,
    user: User,
    add: boolean
) {
    if (user.bot) return;
    const { message } = reaction;
    if (!message.guild) return;

    const { roleMenus } = (await guilds.findById(
        message.guild.id
    )) as IGuildConfig;
    if (!roleMenus.has(message.id)) return;

    const member = message.guild.members.cache.get(user.id);
    if (!member) return;

    if (
        (reaction.emoji.id || reaction.emoji.name) in roleMenus.get(message.id)!
    ) {
        let role = message.guild.roles.cache.get(
            // @ts-ignore
            roleMenus.get(message.id)![reaction.emoji]
        );
        if (reaction.emoji instanceof GuildEmoji && reaction.emoji.guild) {
            role = message.guild.roles.cache.get(
                // @ts-ignore
                roleMenus.get(message.id)![reaction.emoji.id]
            );
        }
        if (!role) throw new Error("Role in rolemenu not a valid role ID");
        if (add) member.roles.add(role);
        else member.roles.remove(role);

        user.send(
            `**${message.guild.name}**: ${
                add ? "Gave you the" : "Removed"
            } role **${role.name}**`
        ).catch();
    }
}
