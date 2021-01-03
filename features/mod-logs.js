const { MessageEmbed, Guild, GuildChannel, Message } = require("discord.js")
const guildSchema = require('../schemas/guild-schema')

/**
 * Returns the log channel for the guild or null
 * @param {Guild} guild the guild to check the log channel for
 * @returns {Promise<GuildChannel>|null} the specified logging channel for the guild or null
 */
const getLogChannel = async guild => {
    const result = await guildSchema.findOne({ _id: guild.id })
    return result ? guild.channels.cache.get(result.logChannelId) : null
}

module.exports = async (client, instance, isEnabled) => {
    client.on('guildMemberAdd', async member => {
        const channel = await getLogChannel(member.guild)
        const newMemberEmbed = new MessageEmbed()
            .setTitle('Member Joined')
            .addFields(
                {
                    name: 'User',
                    value: member
                }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#FFFF00')
            .setTimestamp()
        
        if(channel) channel.send(newMemberEmbed)
    })

    client.on('guildMemberRemove', async member => {
        const channel = await getLogChannel(member.guild)
        const leaveEmbed = new MessageEmbed()
            .setTitle('Member left')
            .addFields(
                {
                    name: 'Member',
                    value: member.user
                }
            )
            .setColor('#f0870e')
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()

        if (channel) channel.send(leaveEmbed)
    })

    client.on('guildBanAdd', async (guild, user) => {
        const channel = await getLogChannel(guild)
        const banInfo = await guild.fetchBans()
        const { reason } = banInfo.get(user.id)
        const banEmbed = new MessageEmbed()
            .setTitle('Member banned')
            .addFields(
                {
                    name: 'User',
                    value: user,
                },
                {
                    name: 'Reason',
                    value: reason || 'no reason provided'
                }
            )
            .setThumbnail(user.displayAvatarURL())
            .setColor('#FF0000')
            .setTimestamp()
        
        if (channel) channel.send(banEmbed)
    })

    client.on('guildBanRemove', async (guild, user) => {
        const channel = await getLogChannel(guild)
        const unbanEmbed = new MessageEmbed()
            .setTitle('User banned')
            .addFields(
                {
                    name: 'User',
                    value: user,
                }
            )
            .setThumbnail(user.displayAvatarURL())
            .setColor('#32a852')
            .setTimestamp()

        if (channel) channel.send(unbanEmbed)
    })

    client.on('channelCreate', async channel => {
        const logChannel = channel.guild ? await getLogChannel(channel.guild) : null
        if (!channel || !logChannel) return
        const channelAuditLog = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE', limit: 1 })
        const channelCreator = channelAuditLog.entries.array()[0].executor

        const channelEmbed = new MessageEmbed()
            .setTitle('Channel Created')
            .addFields(
                {
                    name: 'Channel',
                    value: channel,
                },
                {
                    name: 'Channel ID',
                    value: channel.id
                },
                {
                    name: 'Created By',
                    value: channelCreator
                }
            )
            .setColor('#4287f5')
            .setTimestamp()

        logChannel.send(channelEmbed)
    })

    client.on('channelDelete', async channel => {
        const logChannel = channel.guild ? await getLogChannel(channel.guild) : null
        if (!channel || !logChannel) return
        const channelAuditLog = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE', limit: 1 })
        const channelDeleter = channelAuditLog.entries.array()[0].executor

        const channelEmbed = new MessageEmbed()
            .setTitle('Channel Deleted')
            .addFields(
                {
                    name: 'Channel Name',
                    value: channel.name,
                },
                {
                    name: 'Channel ID',
                    value: channel.id
                },
                {
                    name: 'Deleted By',
                    value: channelDeleter
                }
            )
            .setColor('#4287f5')
            .setTimestamp()

        logChannel.send(channelEmbed)
    })

    client.on('inviteCreate', async invite => {
        const channel = invite.guild ? await getLogChannel(invite.guild) : null
        if (!invite || !channel) return

        const inviteEmbed = new MessageEmbed()
            .setTitle('Invite Created')
            .addFields(
                {
                    name: 'Invite By',
                    value: invite.inviter,
                },
                {
                    name: 'Invite Code',
                    value: invite.code,
                },
                {
                    name: 'Invite Channel',
                    value: invite.channel,
                },
                {
                    name: 'Expires At',
                    value: invite.expiresAt ? invite.expiresAt.toUTCString().replace(/GMT/, 'UTC') : 'Never',
                },
                {
                    name: 'Max Uses',
                    value: invite.maxUses ? invite.maxUses : 'No Limit',
                }
            )
            .setColor('#fcba03')
            .setTimestamp()

        channel.send(inviteEmbed)
    })

    client.on('inviteDelete', async invite => {
        const channel = invite.guild ? await getLogChannel(invite.guild) : null
        if (!invite || !channel) return

        const inviteEmbed = new MessageEmbed()
            .setTitle('Invite Deleted')
            .addFields(
                {
                    name: 'Invite By',
                    value: invite.inviter,
                },
                {
                    name: 'Invite Code',
                    value: invite.code,
                },
                {
                    name: 'Invite Channel',
                    value: invite.channel,
                },
            )
            .setColor('#eb4034')
            .setTimestamp()

        channel.send(inviteEmbed)
    })
}

/**
 * Sends an embed in the guild's logging channel
 * @param {Guild} guild the guild whose logging channel to log in (if it has one)
 * @param {MessageEmbed} embed the embed to send in the logging channel
 * @returns {Message} the message object that was sent
 */
module.exports.log = async (guild, embed) => {
    if (!guild || !guild.id) throw new TypeError('parameter \'guild\' is not a valid Guild object.')
    if (!embed || !embed instanceof MessageEmbed) throw new TypeError('parameter \'embed\' is not a MessageEmbed.')
    const logChannel = await getLogChannel(guild)
    if (!logChannel) return
    logChannel.send(embed)
}

module.exports.config = {
    displayName: 'mod-logs',
    dbName: 'MOD-LOGS', // DO NOT CHANGE
    loadDBFirst: true,
}