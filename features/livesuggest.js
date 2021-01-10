const { MessageEmbed } = require("discord.js")
require('dotenv').config({ path: '../.env' })

module.exports = async (client, instance, isEnabled) => {
    client.on('message', async message => {
        if (message.channel.id !== process.env.suggestionChannel) return
        if (message.author.bot) return
        if (message.member.hasPermission('ADMINISTRATOR')) return
        message.delete()
        const suggestionEmbed = new MessageEmbed()
            .setTitle(message.content.split('\n')[0] || '')
            .setDescription(message.content.split('\n')[1] || message.content + '\n\n' + 
            '📊 Waiting for support. Use 👍 and 👎 to vote!')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(`suggested in ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setColor('#ffff00')
            .setTimestamp()

        message.channel.send(suggestionEmbed).then(async sentMessage => {
            await sentMessage.react('👍')
            await sentMessage.react('👎')
        })
    })
}

module.exports.config = {
    displayName: '#bot-suggestions',
    dbName: 'BOT-SUGGESTIONS',
}