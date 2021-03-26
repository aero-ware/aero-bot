import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { DMChannel, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import guilds, { IGuildConfig } from "../models/Guild";
import members from "../models/Member";
import log from "../utils/logging";
import message from "./message";

export default {
    name: "guildMemberAdd",
    async callback(member: GuildMember) {
        const guildConfig = ((await guilds.findById(member.guild.id)) ||
            (await guilds.create({ _id: member.guild.id }))) as IGuildConfig;

        if (guildConfig) {
            autoRoleGiver(member, guildConfig);
            sendWelcomeMessage(member, guildConfig);
            log(
                member.guild,
                new MessageEmbed()
                    .setTitle("Member Joined")
                    .setThumbnail(
                        member.user.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(`**Member:** ${member}`)
                    .setTimestamp()
            );
            ageConfirmation(member, guildConfig);
        }

        members.create({
            guildId: member.guild.id,
            userId: member.id,
        });
    },
} as EventHandler;

async function autoRoleGiver(member: GuildMember, guildConfig: IGuildConfig) {
    const { autoRole } = guildConfig;
    if (!autoRole) return;
    if (member.user.bot) return;
    member.roles.add(autoRole);
}

async function sendWelcomeMessage(
    member: GuildMember,
    guildConfig: IGuildConfig
) {
    const { welcomeChannelId, welcomeText } = guildConfig;
    if (!welcomeChannelId || !welcomeText) return;
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (channel instanceof TextChannel)
        channel.send(welcomeText.replace(/<@>/g, member.toString()));
    else
        throw new TypeError(
            `Welcome message channel of guild ${member.guild.id} is not a TextChanel.`
        );
}

async function ageConfirmation(member: GuildMember, guildConfig: IGuildConfig) {
    if (!guildConfig.ageConfirmation) return;

    await member.user.createDM();
    await member.user.send(
        `${member.guild.name} has required new members' age to be confirmed to comply with Discord's TOS. Please enter your age here.`
    );

    const collector = member.user.dmChannel!.createMessageCollector(
        (m) => m.author.id === member.id,
        { time: 900000 }
    );

    collector.on("collect", (m) => {
        if (!parseInt(m.content))
            member.user.send("Invalid number recieved. Please try again");
        else if (parseInt(m.content) >= 13) collector.stop("success");
        else collector.stop("young");
        collector.checkEnd();
    });

    collector.on("end", (collected, reason) => {
        switch (reason) {
            case "success":
                member.user.send(`Enjoy your stay at ${member.guild.name}!`);
                break;

            case "young":
                member.user.send("You are too young to use Discord.");
                member.ban({ reason: "Underage" });
                break;

            default:
                if (collected.size > 0)
                    throw new Error(`Invalid collector end reason '${reason}'`);
                member.user.send("You did not respond in time.");
                member.kick("Did not respond to age prompt");
        }
    });
}
