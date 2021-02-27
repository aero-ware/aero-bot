import { GuildEmoji, MessageReaction, User } from "discord.js";
import guilds, { IGuildConfig } from "../models/Guild";

export default async function handleRoleMenu(
    reaction: MessageReaction,
    user: User,
    add: boolean
) {
    if (reaction.partial) reaction = await reaction.fetch().catch();
    if (user.bot) return;

    const { message } = reaction;
    if (!message.guild) return;

    const { roleMenus } = (await guilds.findOne({
        _id: message.guild.id,
    })) as IGuildConfig;

    if (roleMenus && !roleMenus.has(message.id)) return;

    const member = message.guild.members.cache.get(user.id);
    if (!member) return;

    const eName =
        reaction.emoji instanceof GuildEmoji
            ? reaction.emoji.id
            : reaction.emoji.name;

    if (eName in roleMenus.get(message.id)!) {
        let role = await message.guild.roles.fetch(
            // @ts-ignore
            roleMenus.get(message.id)![eName]
        );
        if (reaction.emoji instanceof GuildEmoji) {
            role = await reaction.emoji.guild.roles.fetch(
                // @ts-ignore
                roleMenus.get(message.id)![eName]
            );
        }
        if (add) member.roles.add(role!);
        else member.roles.remove(role!);
        user.send(
            `**${message.guild.name}**: ${
                add ? "gave you the" : "removed"
            } the role **${role!.name}**!`
        ).catch(() => {});
    }
}
