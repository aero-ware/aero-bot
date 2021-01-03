const memberSchema = require('../../../schemas/member-schema')

module.exports = {
    commands: 'warn',
    description: 'Adds to the number of warnings stored in the database and DMs the user.',
    category: 'Moderation',
    expectedArgs: '<user ping> [reason]',
    minArgs: 1,
    permissions: 'MANAGE_MESSAGES',
    guildOnly: true,
    run: async ({ message, args }) => {
        const target = message.mentions.users.first()
        if (!target) return message.reply('please mention someone to warn.')
        if (target === message.author) return message.reply('why are you warning yourself?')
        if (target.bot) return message.reply('why are you warning a bot?')

        args.shift()
        
        const guildId = message.guild.id
        const userId = target.id
        const reason = args.join(' ')

        const warning = {
            author: message.author,
            timeStamp: new Date().getTime(),
            reason,
        }

        await memberSchema.findOneAndUpdate(
            {
                guildId,
                userId,
            },
            {
                guildId,
                userId,
                $push: {
                    warnings: warning,
                },
            },
            {
                upsert: true,
            }
        )

        return message.reply(`${target} has been warned for the reason \`${reason}\``)
    }
}