import { Command } from "@aeroware/aeroclient/dist/types";
// @ts-ignore lmao add types snowflake
import { Rank } from "canvacord";
import members, { IMemberInfo } from "../../models/Member";
import guilds, { IGuildConfig } from "../../models/Guild";
import { getLevelData } from "../../utils/leveling";
import { MessageAttachment } from "discord.js";

export default {
    name: "level",
    aliases: ["rank"],
    category: "Leveling",
    usage: "[user]",
    description: "Shows you the level card of you or the specified member",
    guildOnly: true,
    async callback({ message }): Promise<any> {
        const { levelsEnabled } = await guilds.findById(message.guild!.id) as IGuildConfig;
        if (!levelsEnabled) return message.channel.send("Leveling has been disabled here.");

        const target = message.mentions.users?.first() || message.author;
        if (target.bot) return message.channel.send("Cannot get level of a bot");

        const { xp, level, neededXP } = await getLevelData(message.guild!.id, target.id);
        
        const membersInGuild = await members.find({ guildId: message.guild!.id }) as IMemberInfo[];

        const sortedMembers = membersInGuild.sort((a, b) => {
            if (a.level > b.level) return -1;
            else if (a.level < b.level) return 1;
            else {
                if (a.xp > b.xp) return -1;
                else if (a.xp < b.xp) return 1;
                else return 0;
            }
        });

        const rank = new Rank()
            .setAvatar(target.displayAvatarURL({ format: "png"}))
            .setCurrentXP(xp)
            .setLevel(level)
            .setRank(
                sortedMembers.indexOf(
                    // @ts-ignore
                    sortedMembers.find((m) => m.userId === target.id)
                ) + 1
            )
            .setRequiredXP(neededXP)
            .setProgressBar("#ffffff", "COLOR", true)
            .setUsername(target.username)
            .setDiscriminator(target.discriminator)
            .setBackground("COLOR", "#00000000")
            .setOverlay("#00000000", 0, false)
            .setProgressBar("#e8064d", "COLOR", true);

        rank.build().then(async (buffer: Buffer) => {
            const att = new MessageAttachment(buffer, "level.png");
            message.channel.send(att);
        });
    }
} as Command;