const guildSchema = require("../schemas/guild-schema")

module.exports = async (client, instance, isEnabled) => {
    client.on('messageDelete', async message => {
        if (!message.guild) return

        let { snipes } = guildSchema.findOne({ _id: message.guild.id })
        if (!snipes) snipes = {}

        if (!message.content || !message.author.id || !message.createdTimestamp) {
            message = message.channel.messages.fetch(message.id)
        }
        snipes[message.channel.id] = {
            id: message.id,
            content: message.content,
            author: message.author.id,
            timestamp: message.createdTimestamp,
        }

        await guildSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                snipes,
            },
            {
                upsert: true,
                setDefaultsOnInsert: true,
            }
        )

        console.log('updated snipe message for channel ' + message.channel.id)
    })
}

module.exports.config = {
    displayName: 'snipe',
    dbName: 'SNIPE',
}