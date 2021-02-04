import members, { IMemberInfo } from "../models/Member";

/**
 * This file contains utilities to help with the economy portion of the bot.
 */

/**
 * Returns the number of coins this member has.
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the member to get coins
 */
export async function getCoins(guildId: string, userId: string) {
    return (
        ((await members.findOne({
            guildId,
            userId,
        })) as IMemberInfo).coins || 0
    );
}

/**
 * Sets and returns
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the member to set coins of
 * @param coins the number of coins to set
 */
export async function setCoins(guildId: string, userId: string, coins: number) {
    return ((await members.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            coins,
        },
        {
            upsert: true,
            new: true,
        }
    )) as IMemberInfo).coins;
}

/**
 * Adds the given number of coins and returns their new balance.
 * Convenience function that calls `setCoins` and `getCoins`
 * @param guildId the ID of the guild the member is in
 * @param userId the ID of the member to add coins to
 * @param coins the number of coins to add
 */
export async function addCoins(guildId: string, userId: string, coins: number) {
    return await setCoins(
        guildId,
        userId,
        (await getCoins(guildId, userId)) + coins
    );
}
