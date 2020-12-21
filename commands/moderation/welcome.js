const mongo = require("../../mongo")
const welcomeSchema = require("../../schemas/welcome-schema")

module.exports = {
    commands: ['setwelcome', 'welcome', 'joinmessage', 'welcomemessage'],
    description: 'sets or shows the welcome message for this server, use <@> to ping the new member, set it to \'none\' to remove',
    expectedArgs: '[channel] [message]',
    permissions: 'ADMINISTRATOR',
    category: 'Moderation',
    run: async (message, args, text, client, prefix, instance) => {
        if (!text) {
            const guildWelcome = await welcomeSchema.findOne({ _id: message.guild.id })
            if (guildWelcome === null) return message.reply('The welcome message for this server has not been set. Run this command again and provide the message.')
            return message.reply(`The welcome message for this server is set to "${guildWelcome.text}" in channel <#${guildWelcome.channelId}>.`)
        }
        if (text === 'none') {
            await welcomeSchema.findOneAndDelete({ _id: message.guild.id })
            return message.reply('The welcome message for this server was disabled.')
        }
        let textNoChannel = ''
        if (message.mentions.channels.first()) {
            args.shift()
            textNoChannel = args.join(' ')
        } else textNoChannel = text

        const newInfo = await welcomeSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                channelId: message.mentions.channels.first() ? message.mentions.channels.first() : message.channel.id,
                text: textNoChannel,
            },
            { upsert: true, new: true }
        )
        const channel = message.guild.channels.cache.find(channel => channel.id === newInfo.channelId)
        return message.reply(`The welcome message for this server has been set to "${newInfo.text.replace(/<@>/g, '<user ping>')}" in channel ${channel}.`)
    }
}