const { MessageEmbed, GuildMember } = require("discord.js")
const getTarget = require("../../util/get-target")

module.exports = {
    commands: ['avatar', 'pfp', 'showavatar', 'showpfp'],
    category: 'Fun',
    description: 'Shows your (or someone else\'s) avatar',
    expectedArgs: '[user ping|id]',
    run: async ({ message, args, instance }) => {
        const target = await getTarget.firstArgOrSelf(message, args, instance)
        if (!target) return

        const targetAvatar = target && target instanceof GuildMember ? target.user.displayAvatarURL({ dynamic: true, size: 512 }) : target.displayAvatarURL({ dynamic: true, size: 512})

        return message.channel.send(targetAvatar)
    }
}