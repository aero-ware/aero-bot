const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
    commands: ['setlogchannel', 'setmodlog', 'logchannel'],
    description: 'sets or gets the channel for logging important actions.',
    category: 'Moderation',
    expectedArgs: '[channel|none]',
    permissinons: 'ADMINISTRATOR',
    guildOnly: true,
    run: async ({ message, args }) => {
        const logChannelId = message.mentions.channels.first() ? message.mentions.channels.first().id : null

        if (!logChannelId) {
            if (args[0] === 'none') {
                await guildSchema.findOneAndUpdate({ _id: message.guild.id }, { logChannelId: null })
                return message.reply('the logging channel has been unset.')
            }
            const result = await guildSchema.findOne({ _id: message.guild.id })
            if (!result.logChannelId) return message.reply(`the logging channel for this server is not set yet. Run this command with a channel to set it!`)
            return message.reply(`the logging channel for this server is currently set to ${await message.guild.channels.cache.get(result.logChannelId)}`)
        }

        const result = await guildSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                logChannelId,
            },
            {
                upsert: true,
                new: true,
            }
        )
        message.reply(`logging channel has been successfully set to ${await message.guild.channels.cache.get(result.logChannelId)}`)
    }
}