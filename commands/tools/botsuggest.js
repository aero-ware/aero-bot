const { MessageEmbed } = require('discord.js')

require('dotenv').config({ path: '../../.env' })

module.exports = {
    commands: ['botsuggest', 'suggest-bot'],
    category: 'Tools',
    description: 'Suggest a feature to the bot devs! Use >botsuggest title(newline, shift+enter) body OR >botsuggest body',
    minArgs: 1,
    expectedArgs: '<suggestion>',
    run: async ({ message, text, prefix }) => {
        const suggestionChannel = message.client.channels.cache.get(process.env.suggestionChannel)

        let title = ''
        let body = ''
        if (text.split('\n').length > 1) {
            title = text.split('\n')[0]
            body = text.split('\n')[1]
        } else body = text

        const suggestionEmbed = new MessageEmbed()
            .setTitle(title)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('#ffff00')
            .setDescription(body + '\n\n' +
            '📊 Waiting for support. Use 👍 and 👎 to vote!')
            .setFooter(`suggested in ${message.guild.name}`, message.guild.iconURL())
            .setTimestamp()

        const sentEmbed = await suggestionChannel.send(suggestionEmbed)
        await sentEmbed.react('👍')
        await sentEmbed.react('👎')

        message.reply('sent your suggestion to the bot devs!')
        message.channel.send(message.guild.id !== suggestionChannel.guild.id ? ` Join the support server to see your suggestion and more! run ${prefix}support for more info.` : '')
    }
}