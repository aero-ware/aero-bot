const { MessageEmbed } = require("discord.js")
const banPurgeSchema = require('../../schemas/ban-purge-schema')

module.exports = {
    commands: 'ban',
    expectedArgs: '<user ping> [reason]',
    minArgs: 1,
    permissions: ['BAN_MEMBERS'],
    description: 'Bans the targeted user',
    category: 'Moderation',
    callback: (message, args) => {
        args.shift()
        const reason = args.join(' ')

        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.reply('I don\'t have permission to ban members.')
        if (!message.mentions.members.first()) return message.reply('Please `@mention` someone to ban')
        if (message.mentions.members.first() === message.member) return message.reply('Why are you trying to ban yourself?')
        if (!message.mentions.members.first().bannable) return message.reply('This member is not bannable by me (usually because of permission level)')

        
        const result = banPurgeSchema.findOne({ _id: message.guild.id })
        const { days } = result
        message.mentions.members.first().ban({ reason, days })
        message.reply(`${message.mentions.users.first().tag} has been banned for the reason \`${reason}\``)

        const dmEmbed = new MessageEmbed()
            .setTitle(`Banned from ${message.guild}`)
            .addFields(
                {
                    name: 'Action by',
                    value: message.author.tag,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: reason,
                    inline: true,
                }
            )

        message.mentions.users.first()
            .send(dmEmbed)
            .catch(() => message.channel.send('DM confirmation could not be sent.'))
    }
}