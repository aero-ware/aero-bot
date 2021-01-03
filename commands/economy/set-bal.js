const economy = require("../../util/economy")

module.exports = {
    commands: ['set-bal', 'setbal'],
    description: 'Bot Admin only command that sets a user\'s balance in a guild',
    ownerOnly: true,
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: '[user] <value>',
    category: 'Economy',
    guildOnly: true,
    run: async ({ message, args }) => {
        let target = message.mentions.users.first()
        let noTarget = false
        if (!target) {
            noTarget = true
            target = message.author
        }
        const coins = noTarget ? args[0] : args[1]
        if (isNaN(coins)) return message.reply('Please provide a valid number of coins.')
        await economy.setCoins(message.guild.id, target.id, coins)
        return message.reply(`Set ${target}'s balance to ${coins}`)
    }
}