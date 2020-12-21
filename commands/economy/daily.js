const economy = require("../../economy")

module.exports = {
    commands: 'daily',
    description: 'Gives you your daily reward of money',
    expectedArgs: '',
    category: 'Economy',
    globalCooldown: '1d',
    run: async message => {
        await economy.addCoins(message.guild.id, message.author.id, 2000)
        return message.reply('2000 coins have been added to your balance!')
    }
}