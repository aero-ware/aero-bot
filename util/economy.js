const memberSchema = require('../schemas/member-schema')

module.exports = client => {

}

/**
 * returns the coins a specific GuildMember has given the guild and user IDs
 * @param {string} guildId the ID of the guild the user is in
 * @param {string} userId the ID of the user to get coins of
 * @returns {Promise<number>} the number of coins the member has
 */
module.exports.getCoins = async (guildId, userId) => {
    const result = await memberSchema.findOne({
        guildId,
        userId,
    })

    let coins = 0
    if (result) coins = result.coins
    else {
        await new memberSchema({
            guildId,
            userId,
            coins,
        }).save()
    }

    return coins
}

/**
 * Adds a certain number of coins to a GuildMember
 * @param {string} guildId the ID of the guild the user is in
 * @param {string} userId the ID of the user to add coins to
 * @param {number} coins the number of coins to add to the member
 * @returns {Promise<number>} the new balance of the member
 */
module.exports.addCoins = async (guildId, userId, coins) => {
    const result = await memberSchema.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                coins
            },
        },
        {
            upsert: true,
            new: true,
            useFindAndModify: false,
        }
    )
    return result.coins
}

/**
 * Sets a GuildMember's balance.
 * @param {string} guildId the ID of the guild the user is in
 * @param {string} userId the ID of the user to set coins to
 * @param {number} coins the number of coins they should have
 * @returns {Promise<number>} the new balance of the user (should be identical to coins)
 */
module.exports.setCoins = async (guildId, userId, coins) => {
    const bal = await module.exports.getCoins(guildId, userId)
    await module.exports.addCoins(guildId, userId, -bal)
    const newBal = await module.exports.addCoins(guildId, userId, coins)
    return newBal
}