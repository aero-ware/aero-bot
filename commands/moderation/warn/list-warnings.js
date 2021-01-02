const { MessageEmbed } = require("discord.js")
const memberSchema = require('../../../schemas/member-schema')

module.exports = {
    commands: ['warns', 'warnings', 'listwarns'],
    description: 'Lists your (or someone else\'s) warnings in this server.',
    category: 'Moderation',
    expectedArgs: '[user ping]',
    guildOnly: true,
    callback: async ({ message }) => {
        const target = message.mentions.users.first() || message.author
        const guildId = message.guild.id
        const userId = target.id

        if (target.bot) return message.reply('bots don\'t have warns.')

        const results = await memberSchema.findOne({
                guildId,
                userId,
        })
        
        const warnsEmbed = new MessageEmbed()
            .setTitle(`Warns for ${target.tag}`)
        
        if (results.warnings.length === 0) warnsEmbed.setDescription('This member has no warns in this server.')
        let embedDescription = ''
        for (const warning of results.warnings) {
            const { author, timeStamp, reason } = warning
            embedDescription += `Warn by ${await message.guild.members.fetch(author)} at ${new Date(timeStamp).toLocaleString()} for \`${reason}\`\n`
        }
        warnsEmbed.setDescription(embedDescription)
        warnsEmbed.setTimestamp()

        message.channel.send(warnsEmbed)
    }
}