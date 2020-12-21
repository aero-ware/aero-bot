const mongo = require('./mongo')
const profileSchema = require('./schemas/profile-schema')

module.exports = client => {

}

module.exports.getCoins = async (guildId, userId) => {
    return await mongo().then(async mongoose => {
        const result = await profileSchema.findOne({
            guildId,
            userId,
        })

        let coins = 0
        if (result) coins = result.coins
        else {
            await new profileSchema({
                guildId,
                userId,
                coins,
            }).save()
        }

        return coins
    })
}

module.exports.addCoins = async (guildId, userId, coins) => {
    return await mongo().then(async mongoose => {
        const result = await profileSchema.findOneAndUpdate(
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
    })
}

module.exports.setCoins = async (guildId, userId, coins) => {
    const bal = await module.exports.getCoins(guildId, userId)
    await module.exports.addCoins(guildId, userId, -bal)
    const newBal = await module.exports.addCoins(guildId, userId, coins)
    return newBal
}