const memberSchema = require('../schemas/member-schema')

module.exports = client => {

}

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

module.exports.setCoins = async (guildId, userId, coins) => {
    const bal = await module.exports.getCoins(guildId, userId)
    await module.exports.addCoins(guildId, userId, -bal)
    const newBal = await module.exports.addCoins(guildId, userId, coins)
    return newBal
}