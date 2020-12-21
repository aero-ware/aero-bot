const mongo = require('../mongo')
const welcomeSchema = require('../schemas/welcome-schema')

module.exports = (client) => {
    const onJoin = async member => {
        let data = []

        const result = await welcomeSchema.findOne({ _id: member.guild.id })
        if (!result) return

        data = [result.channelId, result.text]

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
    dbName: 'welcome', // DO NOT CHANGE
    loadDBfirst: true,
}