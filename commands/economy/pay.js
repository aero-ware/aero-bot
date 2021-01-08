const { MessageEmbed, GuildMember } = require("discord.js")
const economy = require("../../util/economy")
const getTarget = require("../../util/get-target")


module.exports = {
    commands: ['pay', 'give', 'donate'],
    description: 'gives the specified amount to the specified user',
    cooldown: '30s',
    expectedArgs: '<user> <amount>',
    minArgs: 2,
    maxArgs: 2,
    category: 'Economy',
    guildOnly: true,
    run: async ({ message, args, instance }) => {
        const userBal = await economy.getCoins(message.guild.id, message.author.id)
        let target = await getTarget.firstArgPingID(message, args, instance)
        target = target instanceof GuildMember ? target.user : target
        const amount = args[1]
        if (userBal < amount) return message.reply(`You don't have enough money for this transaction. You only have ${userBal} coins.`)
        const newUserBal = await economy.addCoins(message.guild.id, message.author.id, -amount)
        const targetBal = await economy.addCoins(message.guild.id, target.id, amount)
        const successEmbed = new MessageEmbed()
            .setTitle('Transaction Successful')
            .setDescription(`From: ${message.author}, To: ${target}, Amount: ${amount}`)
            .addFields(
                {
                    name: 'You have:',
                    value: `${newUserBal} coins`
                },
                {
                    name: `${target.username} has:`,
                    value: `${targetBal} coins`
                }
            )

            if(Math.random() > 0.875) successEmbed.setFooter('never gonna give you up', 'https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg')

        return message.channel.send(successEmbed)
    }
}