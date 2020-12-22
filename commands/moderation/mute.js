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
    expectedArgs: '<user ping|id> [reason]',
    minArgs: 1,
    run: async (message, args) => {
        const timeString = args[1] ? args[1] : null
        const { mutedRoleId } = await guildSchema.findOne({ _id: message.guild.id })
        const target = message.mentions.members.first() || message.guild.members.fetch(args[0])

        if (target === message.member) return message.reply('why are you muting yourself?')
        else if (target.user.bot) return message.reply('why are you muting a bot?')

        let muteSuccess = true

        const reason = args[1]
        await target.roles.add(mutedRoleId, `muted by ${message.author.tag} - ${reason}`).then(async () => {
            await muteSchema.create(
                {
                    guildId: message.guild.id,
                    userId: target.id,
                    endTime: Date.now() + ms(timeString)
                }
            )
        }).catch(() => {
            muteSuccess = false
            message.reply('I cannot mute that member, they probably have higher permissions than me')
        })
        
        const formatDate = new Date(ms(timeString))
        const formatString = niceDates(formatDate.getTime())
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
                    value: `\`${reason}\``,
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