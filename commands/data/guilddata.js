const guildSchema = require('../../schemas/guild-schema')
const tempbanSchema = require('../../schemas/tempban-schema')
const muteSchema = require('../../schemas/mute-schema')
const { MessageAttachment } = require('discord.js')

module.exports = {
    commands: ['guilddata', 'serverdata'],
    category: 'Data',
    description: 'server owner only command that sends the data stored about this server',
    guildOnly: true,
    run: async ({ message }) => {
        if (message.author.id !== message.guild.ownerID) return message.reply('you are not the owner of this server.')
        let guildData = { guildID: message.guild.id }

        const guildInfo = await guildSchema.findOne({ _id: message.guild.id })
        guildData.main = guildInfo

        const tempBanInfo = await tempbanSchema.find({ guildId: message.guild.id })
        guildData.tempBans = tempBanInfo

        const muteInfo = await muteSchema.find({ guildId: message.guild.id })
        guildData.tempMutes = muteInfo

        message.author.send(`Server data for ${message.guild.name}:`, new MessageAttachment(Buffer.from(JSON.stringify(guildData, (k, v) => (k === '__v' || k === '_id' || k === 'guildId') ? undefined : v, 4), 'utf-8'), `guildData-${message.guild.name}.json`))
            .catch(() => message.channel.send('due to the possibly sensitive nature of this data, please enable DMs so that I can send it to you privately, then run this command again.'))
    }
}