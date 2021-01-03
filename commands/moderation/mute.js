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
    guildOnly: true,
    run: async ({ message, args }) => {
        if (!message.guild) return
        const [user, timeString, ...reason] = args
        let { mutedRoleId } = await guildSchema.findOne({ _id: message.guild.id }) || null
        let add = false, end = false
        const target = message.mentions.members.first() || message.guild.members.fetch(args[0])

        if (!mutedRoleId) {
            const sentMessage = await message.reply('this server does not have a muted role set up. Do you want me to create one? (react for yes)')
                sentMessage.react('✔')
                const collected = await sentMessage.awaitReactions((reaction, user) => reaction.emoji.name === '✔' && user.id === message.author.id, { max: 1, time: 5000 })
                if (collected.size > 0) add = true
                else return message.reply(`not adding a muted role or muting ${target}.`)

            if (end) return
            if (add) {
                const mutedRole = await message.guild.roles.create({
                    data: {
                        name: 'Muted',
                        permissions: 1115136,
                        hoist: false,
                        mentionable: false,
                    },
                    reason: `adding muted role, requested by ${message.author.tag}`
                })

                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    {
                        _id: message.guild.id,
                        mutedRoleId: mutedRole.id,
                    },
                    { upsert: true }
                )
                message.reply(`${mutedRole} is now the muted role for this server.`)
                mutedRoleId = mutedRole.id
            }
        }
        
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
        }).catch((err) => {
            muteSuccess = false
            message.reply('I cannot mute that member, they probably have higher permissions than me')
            if (err) console.log(err)
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