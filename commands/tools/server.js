const { formatDistanceToNow } = require('date-fns')
const { MessageEmbed } = require('discord.js')

module.exports = {
    commands: ['server', 'serverinfo', 'guild'],
    category: 'Tools',
    description: 'Shows information about this server',
    expectedArgs: '[server id]',
    run: async ({ message, args }) => {
        let guild = message.guild
        let invalidId = false
        if (args.length > 0) guild = await message.client.guilds.fetch(args[0]).catch(() => {
            invalidId = true
            message.reply('invalid guild ID.')
        })
        if (invalidId) return

        const infoEmbed = new MessageEmbed()
            .setTitle(guild.name)
            .addFields(
                {
                    name: 'Server ID',
                    value: guild.ownerID,
                },
                {
                    name: 'Members',
                    value: guild.members.cache.size,
                    inline: true,
                },
                {
                    name: 'People',
                    value: guild.members.cache.filter(v => !v.user.bot).size,
                    inline: true,
                },
                {
                    name: 'Channels',
                    value: `${guild.channels.cache.filter(c => c.type === 'text').size} text\n
                        ${guild.channels.cache.filter(c => c.type === 'voice').size} voice\n
                        ${guild.channels.cache.filter(c => c.type === 'category').size} categories\n
                        ${guild.channels.cache.filter(c => c.type === 'news').size} announcements`
                },
                {
                    name: 'Region',
                    value: guild.region,
                    inline: true,
                },
                {
                    name: 'Created At',
                    value: `${formatDistanceToNow(guild.createdAt, { addSuffix: true, includeSeconds: true })} (${guild.createdAt.toUTCString().replace('GMT', 'UTC')})`
                },
                {
                    name: 'Roles',
                    value: guild.roles.cache.size - 1, // exclude @everyone cuz its not really a role.
                    inline: true,
                },
                {
                    name: 'Nitro Boosts',
                    value: guild.premiumSubscriptionCount || 0,
                    inline: true,
                },
                {
                    name: 'Boost Level',
                    value: guild.premiumTier,
                    inline: true,
                }
            )
            .setThumbnail(guild.iconURL({ dynamic: true }))

        message.channel.send(infoEmbed)
    }
}
