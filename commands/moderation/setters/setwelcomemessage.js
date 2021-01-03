const guildSchema = require("../../../schemas/guild-schema")

module.exports = {
    commands: ['setwelcome', 'welcome', 'joinmessage', 'welcomemessage'],
    description: 'sets or shows the welcome message for this server, use <@> to ping the new member, set it to \'none\' to remove',
    expectedArgs: '[channel] [message]',
    permissions: 'ADMINISTRATOR',
    category: 'Moderation',
    guildOnly: true,
    run: async ({ message, args, text }) => {
        if (!text) {
            const { welcomeText, welcomeChannelId } = await guildSchema.findOne({ _id: message.guild.id }) || { welcomeText: null }
            if (!welcomeText) return message.reply('The welcome message for this server has not been set. Run this command again and provide the message.')
            return message.reply(`The welcome message for this server is set to "${welcomeText.replace(/<@>/g, '<user ping>')}" in channel <#${welcomeChannelId}>.`)
        }
        if (text === 'none') {
            await guildSchema.findOneAndDelete({ _id: message.guild.id })
            return message.reply('The welcome message for this server was disabled.')
        }
        let textNoChannel = ''
        let welcomeChannel = message.guild.channels.cache.get(args[0].substring(2, args[0].length - 1))
        if (welcomeChannel) {
            args.shift()
            textNoChannel = args.join(' ')
        } else {
            welcomeChannel = message.channel
            textNoChannel = text
        }

        const newInfo = await guildSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                welcomeChannelId: welcomeChannel.id,
                welcomeText: textNoChannel,
            },
            { upsert: true, new: true }
        )
        return message.reply(`The welcome message for this server has been set to "${newInfo.welcomeText.replace(/<@>/g, '<user ping>')}" in channel ${welcomeChannel}.`)
    }
}