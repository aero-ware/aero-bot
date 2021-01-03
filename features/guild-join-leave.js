const guildSchema = require("../schemas/guild-schema")
const muteSchema = require('../schemas/mute-schema')
const tempbanSchema = require('../schemas/tempban-schema')
const memberSchema = require('../schemas/member-schema')

module.exports = async (client, instance, isEnabled) => {
    client.on('guildCreate', async guild => {
        // create a db entry for the guild as it joins.
        await guildSchema.findOneAndUpdate(
            { _id: guild.id },
            { _id: guild.id },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        )
    })

    client.on('guildDelete', async guild => {
        // delete the db entry if it got kicked from a guild.
        await guildSchema.findOneAndDelete({ _id: guild.id })
        // also delete all the economy, mutes, tempbans etc from the db
        await muteSchema.deleteMany({ guildId: guild.id })
        await tempbanSchema.deleteMany({ guildId: guild.id })
        await memberSchema.deleteMany({ guildId: guild.id })
    })
}

module.exports.config = {
    displayName: 'INTERNAL-NO-DISABLING',
    dbName: 'JOIN_AND_LEAVE', // DO NOT CHANGE
    loadDBFirst: true,
}