const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
    commands: ['banmessagedeletedays', 'banpurgedays', 'messagedeleteonban'],
    category: 'Moderation',
    description: 'sets the number of days of messages from that user to delete when they are banned (max 7)',
    permissions: 'ADMINISTRATOR',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<days (<= 7)>',
    guildOnly: true,
    run: async ({ message, args }) => {
        if (isNaN(args[0]) || args[0] < 0 || args[0] > 7) return message.reply('please enter a valid number (less than 7)')
        const result = await guildSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                banPurgeDays: args[0],
            },
            {
                upsert: true,
                new: true,
            }
        )
        message.reply(`updated this server's banPurgeDays value to ${result.banPurgeDays}`)
    }
}