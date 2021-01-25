
const economy = require("../../util/economy")

module.exports = {
    commands: 'hourly',
    description: 'Gives you your hourly reward of money',
    expectedArgs: '',
    category: 'Economy',
    globalCooldown: '1h',
    guildOnly: true,
    run: async ({ message }) => {
        await economy.addCoins(message.guild.id, message.author.id, 100)
        return message.reply('100 coins have been added to your balance!')
    }
}
