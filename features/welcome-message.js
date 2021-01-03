const { GuildMember } = require('discord.js')
const guildSchema = require('../schemas/guild-schema')

module.exports = (client, instance, isEnabled) => {
    /**
     * Manages sending the welcome message when someone joins a guild
     * @param {GuildMember} member the member that has joined the server
     */
    const onJoin = async member => {
        let data = []

        const result = await guildSchema.findOne({ _id: member.guild.id })
        if (!result) return

        data = [result.welcomeChannelId, result.welcomeText]

        if (!data) return
        const [channelId, text] = data
        const channel = await member.guild.channels.cache.find(channel => channel.id === channelId)
        if (!channel) return
        channel.send(text.replace(/<@>/g, `${member}`))
    }

    client.on('guildMemberAdd', member => {
        onJoin(member)
    })
}

module.exports.config = {
    displayName: 'welcomeMessage',
    dbName: 'WELCOME-MESSAGE', // DO NOT CHANGE
    loadDBfirst: true,
}