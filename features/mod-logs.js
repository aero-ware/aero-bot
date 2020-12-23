const { MessageEmbed } = require("discord.js")
const guildSchema = require('../schemas/guild-schema')

const getLogChannel = async guild => {
    const result = await guildSchema.findOne({ _id: guild.id })
    return result ? guild.channels.cache.get(result.logChannelId) : null
}

module.exports = async client => {
    client.on('guildMemberAdd', async member => {
        const channel = await getLogChannel(member.guild)
        const newMemberEmbed = new MessageEmbed()
            .setTitle('Member Joined')
            .addFields(
                {
                    name: 'User',
                    value: member
                }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#FFFF00')
            .setTimestamp()
        
        if(channel) channel.send(newMemberEmbed)
    })

    client.on('guildMemberRemove', async member => {
        const channel = await getLogChannel(member.guild)
        const leaveEmbed = new MessageEmbed()
            .setTitle('Member left')
            .addFields(
                {
                    name: 'Member',
                    value: member.user
                }
            )
            .setColor('#f0870e')
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()

        if (channel) channel.send(leaveEmbed)
    })

    client.on('guildBanAdd', async (guild, user) => {
        const channel = await getLogChannel(guild)
        const banInfo = await guild.fetchBans()
        const { reason } = banInfo.get(user.id)
        const banEmbed = new MessageEmbed()
            .setTitle('Member banned')
            .addFields(
                {
                    name: 'User',
                    value: user,
                },
                {
                    name: 'Reason',
                    value: reason || 'no reason provided'
                }
            )
            .setThumbnail(user.displayAvatarURL())
            .setColor('#FF0000')
            .setTimestamp()
        
        if (channel) channel.send(banEmbed)
    })

    client.on('guildBanRemove', async (guild, user) => {
        const channel = await getLogChannel(guild)
        const unbanEmbed = new MessageEmbed()
            .setTitle('User banned')
            .addFields(
                {
                    name: 'User',
                    value: user,
                }
            )
            .setThumbnail(user.displayAvatarURL())
            .setColor('#32a852')
            .setTimestamp()

        if (channel) channel.send(unbanEmbed)
    })
}

module.exports.config = {
    displayName: 'mod-logs',
    dbName: 'mod-logs', // DO NOT CHANGE
    loadDBFirst: true,
}