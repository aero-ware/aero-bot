const { MessageEmbed } = require('discord.js')
const mongo = require('../../mongo')
const profileSchema = require('../../schemas/profile-schema')

module.exports = {
    commands: 'warn',
    description: 'Adds to the number of warnings stored in the database and DMs the user.',
    category: 'Moderation',
    expectedArgs: '[reason]',
    permissions: 'MANAGE_MESSAGES',
    run: async (message, args) => {
        await mongo().then(async () => {
            if (message.mentions.users.first() === message.author) return message.reply('Why would you want to warn yourself?')
            const warns = await profileSchema.findOneAndUpdate(
                {
                    guildId: message.guild.id,
                    userId: message.mentions.users.first().id
                },
                {
                    $inc: {
                        warns: 1,
                    },
                },
                {
                    upsert: true,
                    new: true,
                }
            )
            args.shift()
            const reason = args.join(' ')
            message.reply(`${message.mentions.users.first()} has been warned for the reason \`${reason}\`. They now have ${warns.warns} warns in this server.`)
            const warnEmbed = new MessageEmbed()
                .setTitle(`Warned in ${message.guild.name}`)
                .addFields(
                    {
                        name: 'Warned by',
                        value: `${message.author}`,
                        inline: true,
                    },
                    {
                        name: 'Reason',
                        value: reason,
                        inline: true,
                    }
                )
                .setTimestamp()
            
            message.mentions.users.first().send(warnEmbed).catch(() => {
                message.reply(`I could not send ${message.mentions.users.first()} a DM confirming the warn. They probably have DMs disabled.`)
            })
        })
    }
}