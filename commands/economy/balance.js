const economy = require('../../economy')

module.exports = {
    commands: ['balance', 'bal', 'coins'],
    maxArgs: 1,
    expectedArgs: '[user ping]',
    description: 'shows your (or the pinged user\'s) balance',
    category: 'Economy',
    callback: async message => {
        const target = message.mentions.users.first() || message.author

        const coins = await economy.getCoins(message.guild.id, target.id)

        message.reply(`${target === message.author ? 'You have' : `${target.tag} has`} ${coins} coins`)
    }
}