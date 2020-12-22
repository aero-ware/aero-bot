const banPurgeSchema = require("../../schemas/ban-purge-schema")

module.exports = {
    commands: ['banmessagedeletedays', 'banpurgedays', 'messagedeleteonban'],
    category: 'Moderation',
    description: 'sets the number of days of messages from that user to delete when they are banned (max 7)',
    permissions: 'ADMINISTRATOR',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<days (<= 7)>',
    run: async (message, args) => {
        if (isNaN(args[0]) || args[0] < 0) return message.reply('please enter a valid number (less than 7)')
        const result = await banPurgeSchema.findOneAndUpdate(
            { _id: message.guild.id },
            {
                _id: message.guild.id,
                days: args[0],
            },
            {
                upsert: true,
                new: true,
            }
        )
        message.reply(`updated this server's deleteDays value to ${result.days}`)
    }
}