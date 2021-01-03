const economy = require("../../util/economy")

module.exports = {
    commands: 'daily',
    description: 'Gives you your daily reward of money',
    expectedArgs: '',
    category: 'Economy',
    globalCooldown: '1d',
    guildOnly: true,
    run: async ({ message }) => {
        await economy.addCoins(message.guild.id, message.author.id, 2000)
        return message.reply('2000 coins have been added to your balance!')
    }
}