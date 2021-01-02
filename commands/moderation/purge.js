module.exports = {
    commands: ['purge', 'deletemessages'],
    description: 'deletes a certain number of messages (from a specific user if provided) in this channel',
    category: 'Moderation',
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: '<number> [user ping]',
    guildOnly: true,
    run: async ({ message, args }) => {
        const target = message.mentions.users.first() || null
        if (isNaN(args[0])) return message.reply('please provide a valid number of messages to delete (less than 100).')
        else if (args[0] > 100) return message.reply('more than 100 messages cannot be deleted at once.')

        if (!target) {
            return message.channel.bulkDelete(parseInt(args[0]) + 1).then(deletedMessages => {
                if (deletedMessages.array().length < args[0]) return message.reply(`only ${deletedMessages.array().length} messages were deleted, probably due to the fact that some messages were more than 2 weeks old.`)
            })
        } else {
            message.reply('this feature is a work in progess...')
        }
    }
}