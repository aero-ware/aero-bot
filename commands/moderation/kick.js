const { MessageEmbed } = require("discord.js")

module.exports = {
    commands: 'kick',
    expectedArgs: '<user ping> [reason]',
    minArgs: 1,
    permissions: 'KICK_MEMBERS',
    description: 'Kicks the targeted user',
    category: 'Moderation',
    guildOnly: true,
    callback: ({ message, args }) => {
        args.shift()
        const reason = args.join(' ')

        if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.reply('I don\'t have permission to kick members.')
        if (!message.mentions.members.first()) return message.reply('Please `@mention` someone to kick')
        if (message.mentions.members.first() === message.member) return message.reply('Why are you trying to kick yourself?')
        if (!message.mentions.members.first().kickable) return message.reply('This member is not kickable by me (usually because of permission level)')

        message.mentions.members.first().kick(reason)
        message.reply(`${message.mentions.users.first().tag} has been kicked for the reason \`${reason}\``)

        const dmEmbed = new MessageEmbed()
            .setTitle(`Kicked from ${message.guild.name}`)
            .addFields(
                {
                    name: 'Action By',
                    value: message.author.tag,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: reason ? reason : 'no reason provided',
                    inline: true,
                }
            )

        message.mentions.users.first()
            .send(dmEmbed)
            .catch(() => message.channel.send('DM confirmation could not be sent.'))
    }
}