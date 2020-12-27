const guildSchema = require("../schemas/guild-schema")

module.exports = async client => {
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
    })
}