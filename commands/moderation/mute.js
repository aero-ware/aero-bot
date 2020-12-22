const { MessageEmbed } = require("discord.js")
const ms = require("ms")
const guildSchema = require("../../schemas/guild-schema")
const muteSchema = require("../../schemas/mute-schema")
const niceDates = require('../../util/nice-dates')

module.exports = {
    commands: 'mute',
    description: 'mutes a user (gives them muted role)',
    category: 'Moderation',
    permissions: 'MANAGE_MESSAGES',
    expectedArgs: '<user ping|id> <time|\'forever\'> [reason]',
    minArgs: 2,
    run: async (message, args) => {
        const [user, timeString, ...reason] = args
        const { mutedRoleId } = await guildSchema.findOne({ _id: message.guild.id })
        const target = message.mentions.members.first() || message.guild.members.fetch(args[0])

        const duration = timeString === 'forever' ? null : ms(timeString)

        if (target === message.member) return message.reply('why are you muting yourself?')
        else if (target.user.bot) return message.reply('why are you muting a bot?')

        let muteSuccess = true
        await target.roles.add(mutedRoleId, `muted by ${message.author.tag} - ${reason}`).then(async () => {
            if (timeString) {
                await muteSchema.create(
                    {
                        guildId: message.guild.id,
                        userId: target.id,
                        endTime: Date.now() + duration
                    }
                )
            }
        }).catch(() => {
            muteSuccess = false
            message.reply('I cannot mute that member, they probably have higher permissions than me')
        })
        
        const formatDate = new Date(ms(timeString))
        const formatString = timeString === 'forever' ? 'Forever' : niceDates(formatDate.getTime())
        if (muteSuccess) message.reply(`muted ${target.user.tag} for ${formatString}`)
        
        const muteEmbed = new MessageEmbed()
            .setTitle(`Muted in ${message.guild.name}`)
            .addFields(
                {
                    name: 'Muted by',
                    value: message.author,
                },
                {
                    name: 'Reason',
                    value: `\`${reason.join(' ')}\``,
                },
                {
                    name: 'Duration',
                    value: formatString,
                }
            )
            .setTimestamp()
        
        if (muteSuccess) target.user.send(muteEmbed).catch(() => {})
    }
}