const memberSchema = require('../../../schemas/member-schema')
const {MessageEmbed} = require('discord.js')
module.exports = {
    commands: 'warn',
    description: 'Adds to the number of warnings stored in the database and DMs the user.',
    category: 'Moderation',
    expectedArgs: '<user ping> [reason]',
    minArgs: 1,
    requiredPermissions: ['MANAGE_MESSAGES'],
    guildOnly: true,
    run: async ({ message, args }) => {
        const target = message.mentions.users.first()
        if (!target) return message.reply('please mention someone to warn.')
        if (target === message.author) return message.reply('why are you warning yourself?')
        if (target.bot) return message.reply('why are you warning a bot?')

        args.shift()
        
        const guildId = message.guild.id
        const userId = target.id
        const reason = args.join(' ')

        const warning = {
            author: message.author,
            timeStamp: new Date().getTime(),
            reason,
        }

        await memberSchema.findOneAndUpdate(
            {
                guildId,
                userId,
            },
            {
                guildId,
                userId,
                $push: {
                    warnings: warning,
                },
            },
            {
                upsert: true,
            }
        )
        const { guild } = message
        message.mentions.users.first()
            .send(`You have been warned in ${guild.name} for: ${reason}`)
        return message.channel.send(new MessageEmbed()
            .setTitle(':white_check_mark: Successfully Warned')
            .addFields({
                name: 'Member Targeted:',
                value: target.tag,
                inline: true
            }, {
                name: 'Moderator:',
                value: message.author.tag,
                inline: true,
            }, {
                name: 'Reason:',
                value: reason ? reason : 'no reason provided'
            })
            .setColor('d50df0')
            .setTimestamp(new Date()))
            
        
    }
}