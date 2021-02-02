import { Client } from "discord.js";
import tempMutes from "../models/Mute";
import guilds from "../models/Guild";
import bans from "../models/Tempban";
import botbans, { IBotBanInfo } from "../models/Botban";
import { isPast } from "date-fns";

export async function checkMutes(client: Client) {
    const mutes: any = await tempMutes.find({});
    for (const mute of mutes) {
        if (mute.endTime < Date.now())
            unmuteMember(mute.guildId, mute.userId, client);
    }
}

async function unmuteMember(guildId: string, userId: string, client: Client) {
    const guild = await client.guilds.fetch(guildId).catch();
    if (!guild) return;

    const { mutedRoleId } = (await guilds
        .findOne({ _id: guildId })
        .catch()) as any;
    if (!mutedRoleId) return;

    const member = await guild.members.cache.get(userId);
    if (member) {
        member.roles.remove(mutedRoleId);
    }
    await tempMutes.findOneAndDelete({
        guildId,
        userId,
    });
}

export async function checkBans(client: Client) {
    const tempbans = (await bans.find()) as any[];
    for (const tempban of tempbans) {
        if (tempban.endTime < Date.now()) {
            unbanMember(tempban.guildId, tempban.userId, client);
        }
    }
}

async function unbanMember(guildId: string, userId: string, client: Client) {
    const guild = await client.guilds.fetch(guildId);
    const user = await client.users.fetch(userId);
    const guildBans = await guild.fetchBans();
    if (guildBans.has(userId)) {
        await guild.members.unban(user);
    }
    await bans.findOneAndDelete({ guildId, userId });
}

export async function checkBotBans() {
    const bbans = (await botbans.find()) as IBotBanInfo[];
    for (const ban of bbans) {
        if (!ban.endTime) continue;
        if (isPast(ban.endTime)) unBotBanUser(ban.userId);
    }
}

async function unBotBanUser(userId: string) {
    await botbans.findOneAndDelete({
        userId,
    });
}
