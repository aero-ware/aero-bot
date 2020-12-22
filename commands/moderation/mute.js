const ms = require("ms")
const guildSchema = require("../../schemas/guild-schema")
const muteSchema = require("../../schemas/mute-schema")
const niceDates = require('../../util/nice-dates')

module.exports = {
    commands: 'mute',
    description: 'mutes a user (gives them muted role)',
    category: 'Moderation',
    permissions: 'MANAGE_MESSAGES',
    expectedArgs: '<user ping|id>',
    minArgs: 1,
    run: async (message, args) => {
        const timeString = args[1] ? args[1] : null
        const { mutedRoleId } = await guildSchema.findOne({ _id: message.guild.id })
        const target = message.mentions.members.first() || message.guild.members.fetch(args[0])
        await target.roles.add(mutedRoleId, `muted by ${message.author.tag}`)
        await muteSchema.create(
            {
                guildId: message.guild.id,
                userId: target.id,
                endTime: Date.now() + ms(timeString)
            }
        )
        const formatDate = new Date(ms(timeString))
        const formatString = niceDates(formatDate.getTime())
        message.reply(`muted ${target.user.tag} for ${formatString}`)
    }
}