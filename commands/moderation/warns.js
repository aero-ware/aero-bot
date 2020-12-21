const mongo = require('../../mongo')
const profileSchema = require('../../schemas/profile-schema')

module.exports = {
    commands: ['warns', 'mywarns'],
    description: 'Tells you the number of times you (or someone else) have been warned in this server.',
    category: 'Moderation',
    expectedArgs: '[user ping]',
    maxArgs: 1,
    run: async (message) => {
        const target = message.mentions.users.first() || message.author

        await mongo().then(async () => {
            const profile = await profileSchema.findOne(
                {
                    guildId: message.guild.id,
                    userId: target.id,
                }
            )
            message.reply(`you have ${profile.warns} warns in this server.`)
        })
    }
}