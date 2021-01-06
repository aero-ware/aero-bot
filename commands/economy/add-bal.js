const { GuildMember } = require("discord.js")
const economy = require("../../util/economy")
const getTarget = require("../../util/get-target")

module.exports = {
    commands: ['addbalance', 'addbal'],
    minArgs: 1,
    maxArgs: 2,
    ownerOnly: true,
    expectedArgs:'<targer user ping|id> <amount>',
    description: 'adds money to the target user\'s bank',
    category: 'Economy',
    callback: async ({ message, args, instance }) => {
        const target = await getTarget.firstArgPingID(message, args, instance)
        if (!target) return

        const coins = args[1]
        if (isNaN(coins)) return message.reply('Please provide a valid number of coins.')
        const newCoins = await economy.addCoins(message.guild.id, target.id, coins)
        message.reply(`You have given ${target} ${coins} ${coins == 1 ? 'coin' : 'coins'}. They now have ${newCoins} ${newCoins == 1 ? 'coin' : 'coins'}.`)
    }
}