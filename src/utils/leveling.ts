import { add, isPast } from "date-fns";
import { Message } from "discord.js";
import { IGuildConfig } from "../models/Guild";
import members, { IMemberInfo } from "../models/Member";

/**
 * This file contains several utilities that relate to the leveling and XP feature of the bot.
 */

/**
 * Information about the level and XP of a member
 */
export type LevelData = {
    /**
     * The level of the member.
     */
    level: number;
    /**
     * The XP of the member.
     */
    xp: number;
    /**
     * The number of XP needed to advance to the next level.
     * Calculated using `getNeededXP(level)`.
     */
    neededXP: number;
};

/**
 * Handles the leveling component of the message event.
 * @param message the message that triggered this function
 * @param info the configuration for the guild the message is from
 */
export async function handler(message: Message, info: IGuildConfig) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const { levelsEnabled } = info;
    if (!levelsEnabled) return;

    const { nextXPAdd } = (await members.findOne({
        guildId: message.guild.id,
        userId: message.member!.id,
    })) as IMemberInfo;
    if (nextXPAdd && !isPast(nextXPAdd)) return;
    addXP(
        message.guild.id,
        message.author.id,
        Math.floor(Math.random() * (25 - 15)) + 15,
        message
    );
}

/**
 * Returns the amount of XP needed to advance to the next level.
 * @param level the level the member has
 */
export function getNeededXP(level: number) {
    return level * level * 100;
}

/**
 * Adds the specified amount of XP to the member.
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the member to add XP to
 * @param xpToAdd the number of XP to add
 * @param message the message that triggered this
 */
export async function addXP(
    guildId: string,
    userId: string,
    xpToAdd: number,
    message: Message
) {
    const result = (await members.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                xp: xpToAdd,
            },
            nextXPAdd: add(Date.now(), { minutes: 1 }),
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    )) as IMemberInfo;

    let needed = getNeededXP(result.level);
    while (result.xp >= needed) {
        result.level++;
        result.xp -= needed;

        await result.save();

        message.channel.send(
            `${message.member} has just advanced to level ${result.level}`
        );

        needed = getNeededXP(result.level);
    }

    return {
        level: result.level,
        xp: result.xp,
        neededXP: getNeededXP(result.level),
    } as LevelData;
}

/**
 * Returns a `LevelData` object with the member's level and XP information.
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the member to get info for
 */
export async function getLevelData(
    guildId: string,
    userId: string
): Promise<LevelData> {
    const member = (await members.findOne({
        guildId,
        userId,
    })) as IMemberInfo;

    return {
        level: member.level,
        xp: member.xp,
        neededXP: getNeededXP(member.level),
    };
}

/**
 * Sets the level and xp for a member.
 *
 * **Note:** This method does not convert extra XP to levels. This is done on the next `message` event emitted by this member.
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the member to set info for
 * @param level the level that should be set.
 * @param xp the xp that should be set
 */
export async function setLevelData(
    guildId: string,
    userId: string,
    level: number,
    xp: number
) {
    const member = (await members.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            level,
            xp,
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        },
        (err, doc) =>
            console.log(
                `Error: ${err ? err.stack || err.message : "none"}\ndoc: ${doc}`
            )
    )) as IMemberInfo;

    return {
        level: member.level,
        xp: member.xp,
        neededXP: getNeededXP(member.level),
    } as LevelData;
}

/**
 * Sets the level of the member.
 * A convenience function that calls `setLevelData`.
 * Keeps the Member's XP the same as before.
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the user to set level to
 * @param level the level to set
 */
export async function setLevel(guildId: string, userId: string, level: number) {
    return await setLevelData(
        guildId,
        userId,
        level,
        (await getLevelData(guildId, userId)).xp
    );
}

/**
 * Sets the XP of the member.
 * A convenience function that calls `setLevelData`.
 * Keeps the Member's level the same as before.
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the member to set XP for
 * @param xp the number of XP to set
 */
export async function setXP(guildId: string, userId: string, xp: number) {
    return await setLevelData(
        guildId,
        userId,
        (await getLevelData(guildId, userId)).level,
        xp
    );
}
