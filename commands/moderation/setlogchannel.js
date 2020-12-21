const logSchema = require('../../schemas/logchannel-schema')

module.exports = {
    commands: ['setlogchannel', 'setmodlog', 'logchannel'],
    description: 'sets or gets the channel for logging important actions.',
    category: 'Moderation',
    expectedArgs: '[channel|none]',
    permissinons: 'ADMINISTRATOR',
    run: async (message, args) => {
        const channelId = message.mentions.channels.first() ? message.mentions.channels.first().id : null

        if (!channelId) {
            if (args[0] === 'none') {
                await logSchema.findOneAndDelete({ _id: message.guild.id })
                return message.reply('the logging channel has been unset.')
            }
            const result = await logSchema.findOne({ _id: message.guild.id })
            if (!result) return message.reply(`the logging channel for this server is not set yet. Run this command with a channel to set it!`)
            return message.reply(`the logging channel for this server is currently set to ${await message.guild.channels.cache.get(result.channelId)}`)
        }

        const result = await logSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                channelId,
            },
            {
                upsert: true,
                new: true,
            }
        )
        message.reply(`logging channel has been successfully set to ${await message.guild.channels.cache.get(result.channelId)}`)
    }
}