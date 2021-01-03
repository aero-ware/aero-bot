const { MessageEmbed } = require("discord.js")
const ms = require("ms")
const guildSchema = require('../../schemas/guild-schema')
const tempbanSchema = require("../../schemas/tempban-schema")
const niceDates = require('../../util/nice-dates')

module.exports = {
    commands: 'ban',
    expectedArgs: '<user ping|id> <duration|\'forever\'> [reason]',
    minArgs: 2,
    permissions: ['BAN_MEMBERS'],
    description: 'Bans the targeted user',
    category: 'Moderation',
    guildOnly: true,
    callback: async ({ message, args }) => {
        const [user, timeString, ...reason] = args
        const target = await message.mentions.users.first() || await message.client.users.fetch(args[0])
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.reply('I don\'t have permission to ban members.')
        if (!target) return message.reply('no reference to a user is provided to ban.')
        if (target === message.author) return message.reply('Why are you trying to ban yourself?')
        if (target.bannable === false) return message.reply('This member is not bannable by me (usually because of permission level)')

        const duration = timeString === 'forever' ? null : ms(timeString)
        
        const result = guildSchema.findOne({ _id: message.guild.id })
        const { banDeleteDays } = result
        message.guild.members.ban(target.id, { reason: reason.join(' '), days: banDeleteDays })

        if(duration) await tempbanSchema.create({
            guildId: message.guild.id,
            userId: target.id,
            endTime: Date.now() + duration,
        })

        message.reply(`${target} has been banned for the reason \`${reason.length > 0 ? reason.join(' ') : 'no given reason'}\` for ${niceDates(duration) === null ? 'forever' : niceDates(duration)}`)

        const dmEmbed = new MessageEmbed()
            .setTitle(`Banned from ${message.guild}`)
            .addFields(
                {
                    name: 'Action by',
                    value: message.author,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: reason.join(' '),
                    inline: true,
                },
                {
                    name: 'Duration',
                    value: niceDates(duration) === null ? 'Forever' : niceDates(duration),
                    inline: true,
                }
            )
            .setTimestamp()

        target.send(dmEmbed)
            .catch(() => message.channel.send('DM confirmation could not be sent.'))
    }
}