const guildSchema = require("../schemas/guild-schema")
const muteSchema = require('../schemas/mute-schema')
const tempbanSchema = require('../schemas/tempban-schema')
const memberSchema = require('../schemas/member-schema')
const { MessageEmbed } = require("discord.js")

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

        if (!guild.me.hasPermission('ADMINISTRATOR')) {
            const permsEmbed = new MessageEmbed()
                .setTitle('Insufficient Permissions')
                .setDescription('I need the Administrator permission to function properly.\nMany of my commands will not work without it.\nI promise there is no malicious intent, you can review my [source code](https://github.com/dheerajpv/aero-bot) if you wish.\n\n [Invite me properly](https://discord.com/api/oauth2/authorize?client_id=787460489427812363&permissions=8&scope=bot)')
                .setColor('#ff0000')
                .setTimestamp()

            const channel = await guild.systemChannel || await guild.channels.cache.random()
            await channel.send(permsEmbed)
            guild.leave()
        }
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