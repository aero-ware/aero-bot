const { MessageEmbed } = require("discord.js")

module.exports = {
    commands: ['avatar', 'pfp', 'showavatar', 'showpfp'],
    category: 'Fun',
    description: 'Shows your (or someone else\'s) avatar',
    expectedArgs: '[user ping|id]',
    run: async ({ message, text, client }) => {
        let target = message.author
        if (message.mentions.users.first()) target = message.mentions.users.first()
        else if (text) {
            let invalidID = false
            const user = await client.users.fetch(text).catch(() => invalidID = true)
            if (!invalidID) target = user
            else return message.reply('invalid user ID.')            
        }

        return message.channel.send(target.displayAvatarURL({ dynamic: true, size: 512 }))
    }
}