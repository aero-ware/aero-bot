const { getMongoConnection } = require('wokcommands/mongo')
const mongo = require('../mongo')
const profileSchema = require('../schemas/profile-schema')

module.exports = client => {
    client.on('message', message => {
        if (message.author.bot) return
        const { guild, member } = message
        addXP(guild.id, member.id, 23, message)
    })
}

const getNeededXP = level => level * level * 100

const addXP = async (guildId, userId, xpToAdd, message) => {
    const result = await profileSchema.findOneAndUpdate(
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
        },
        {
            upsert: true,
            new: true,
        }
    )
    
    let { xp, level } = result
    const needed = getNeededXP(level)
    if (xp >= needed) {
        level++
        xp -= needed

        message.reply(`You just advanced to level ${level}!`)

        await profileSchema.updateOne(
            {
                guildId,
                userId,
            },
            {
                level,
                xp,
            }
        )
    }
}

module.exports.addXP = addXP

module.exports.config = {
    displayName: 'levels',
    dbName: 'levels', // DO NOT CHANGE
    loadDBFirst: true,
}