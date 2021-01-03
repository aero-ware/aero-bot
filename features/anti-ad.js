const guildSchema = require("../schemas/guild-schema")

module.exports = (client, instance, isEnabled) => {
    const isInvite = async (guild, code) => {
        return await new Promise(async resolve => {
            await guild.fetchInvites().then(invites => {
                for (const invite of invites) {
                    // invite[0] is the code
                    // example discord.gg/{code}
                    if (code === invite[0]) return resolve(true)
                }
                return resolve(false)
            })
        })
    }

    client.on('message', async message => {
        if (!message.guild) return // no dms
        const { member, content, channel, guild, webhookID } = message
        if (!message.member) return
        if (webhookID) return
        if (member.hasPermission('ADMINISTRATOR')) return
        const { adChannels } = await guildSchema.findOne({ _id: guild.id })
        if (adChannels.includes(channel.id)) return
        const code = content.split('discord.gg/')[1]
        if (content.includes('discord.gg/')) {
            const isOurInvite = await isInvite(message.guild, code.split(' ')[0])
            if (!isOurInvite) {
                // we know this is advertising.
                message.delete()
                message.reply('No invites from other servers.')
            }
        }
    })
}

module.exports.config = {
    displayName: 'antiAd',
    dbName: 'ANTI-AD', // DO NOT CHANGE
}