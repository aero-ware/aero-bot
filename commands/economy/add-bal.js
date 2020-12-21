const economy = require("../../economy")

module.exports = {
    commands: ['addbalance', 'addbal'],
    minArgs: 1,
    maxArgs: 2,
    ownerOnly: true,
    expectedArgs:'[targer user ping] <amount>',
    description: 'adds money to the target user\'s bank',
    category: 'Economy',
    callback: async (message, args) => {
        let target = message.mentions.users.first()
        let noTarget = false
        if (!target) {
            noTarget = true
            target = message.author
        }
        const coins = noTarget ? args[0] : args[1]
        if (isNaN(coins)) return message.reply('Please provide a valid number of coins.')
        const newCoins = await economy.addCoins(message.guild.id, target.id, coins)
        message.reply(`You have given ${target} ${coins} ${coins == 1 ? 'coin' : 'coins'}. They now have ${newCoins} ${newCoins == 1 ? 'coin' : 'coins'}.`)
    }
}