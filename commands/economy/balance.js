const economy = require('../../util/economy')
const getTarget = require('../../util/get-target')
const { GuildMember } = require('discord.js')

module.exports = {
    commands: ['balance', 'bal', 'coins'],
    maxArgs: 1,
    expectedArgs: '[user ping]',
    description: 'shows your (or the pinged user\'s) balance',
    category: 'Economy',
    guildOnly: true,
    callback: async ({ message, args, instance }) => {
        let target = await getTarget.firstArgOrSelf(message, args, instance)
        target = target instanceof GuildMember ? target.user : target

        const coins = await economy.getCoins(message.guild.id, target.id)

        message.reply(`${target === message.author ? 'you have' : `${target} has`} ${coins} coins`, {
            allowedMentions: {
                users: [message.author.id]
            }
        })
    }
}