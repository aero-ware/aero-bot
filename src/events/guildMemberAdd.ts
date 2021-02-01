import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import guilds, { IGuildConfig } from "../models/Guild";
import members from "../models/Member";
import log from "../utils/logging";

export default {
    name: "guildMemberAdd",
    async callback(member: GuildMember) {
        autoRoleGiver(member);
        sendWelcomeMessage(member);
        log(
            member.guild,
            new MessageEmbed()
                .setTitle("Member Joined")
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Member:** ${member}`)
                .setTimestamp()
        );
        members.create({
            guildId: member.guild.id,
            userId: member.id,
        });
    },
} as EventHandler;

async function autoRoleGiver(member: GuildMember) {
    const { autoRole } = (await guilds.findById(
        member.guild.id
    )) as IGuildConfig;
    if (!autoRole) return;
    if (member.user.bot) return;
    member.roles.add(autoRole);
}

async function sendWelcomeMessage(member: GuildMember) {
    const { welcomeChannelId, welcomeText } = (await guilds.findById(
        member.guild.id
    )) as IGuildConfig;
    if (!welcomeChannelId || !welcomeText) return;
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (channel instanceof TextChannel)
        channel.send(welcomeText.replace(/<@>/g, member.toString()));
    else
        throw new TypeError(
            `Welcome message channel of guild ${member.guild.id} is not a TextChanel.`
        );
}
