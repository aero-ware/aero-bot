const guildSchema = require('../../../schemas/guild-schema')
module.exports = {
    commands: ['settings'],
    description: 'setup the bot',
    callback: async ({message, args,text, prefix,client}) => {
        switch (args[0]){
            case 'mute':
                if (text === 'none') {
                    await guildSchema.findOneAndUpdate(
                        { _id: message.guild.id },
                        { mutedRoleId: null },
                    )
                    return message.reply('the muted role for this server has been successfully unset.')
                }
                const mutedRole = await message.mentions.roles.first() || await message.guild.roles.fetch(text)
                if (!mutedRole) return message.reply('invalid role ID, please try again with a valid id')
                const result = await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    { mutedRoleId: mutedRole.id },
                    {
                        upsert: true,
                        new: true,
                    }
                )
                message.reply(`role \`${mutedRole.name}\` has been set as this server's muted role.`)
                break;
            case 'logs':
                const logChannelId = message.mentions.channels.first() ? message.mentions.channels.first().id : null

                if (!logChannelId) {
                    if (args[1] === 'none') {
                        await guildSchema.findOneAndUpdate({ _id: message.guild.id }, { logChannelId: null })
                        return message.reply('the logging channel has been unset.')
                    }
                    const result = await guildSchema.findOne({ _id: message.guild.id })
                    if (!result.logChannelId) return message.reply(`the logging channel for this server is not set yet. Run this command with a channel to set it!`)
                    return message.reply(`the logging channel for this server is currently set to ${await message.guild.channels.cache.get(result.logChannelId)}`)
                }
        
                const result2 = await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    {
                        _id: message.guild.id,
                        logChannelId,
                    },
                    {
                        upsert: true,
                        new: true,
                    }
                )
                message.reply(`logging channel has been successfully set to ${await message.guild.channels.cache.get(result2.logChannelId)}`)
                break;

            case 'autorole':
                if (!args[1]) {
                    const { autoRole } = await guildSchema.findOne({ _id: message.guild.id }) || { autoRole: null }
                    return message.reply(
                        autoRole ?
                        `the autorole for this server is currently set to ${message.guild.roles.cache.get(autoRole)}`
                        : 'there is no autorole set for this server.',
                        {
                            allowedMentions: {
                                roles: [],
                            }
                        }
                    )
                }
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
                if (!role) return message.reply('invalid role ID.')
        
                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    {
                        _id: message.guild.id,
                        autoRole: role.id,
                    },
                    {
                        upsert: true,
                        setDefaultsOnInsert: true,
                    }
                )
        
                message.reply(`successfully set ${role} as the autorole for this server.`, {
                    allowedMentions: {
                        roles: [],
                    }
                })
                break;
            case 'ads':
                const channel = message.mentions.channels.first() || null
                if (!channel || channel.guild !== message.guild ) return message.reply('please provide a valid channel.')
                switch (args[1]) {
                    case 'add':
                        await changeAdChannels(true, channel.id, message.guild.id)
                        return message.reply(`${channel} is now allowed for advertising.`)
                    
                    case 'remove':
                        await changeAdChannels(false, channel.id, message.guild.id)
                        return message.reply(`${channel} is now disallowed for advertising.`)
        
                    default:
                         message.reply(`Incorrect usage. Please use ${prefix}settings ads <add|remove> <channel>`)
                         break;
                }
            case 'bans':
                if (isNaN(args[1]) || args[1] < 0 || args[1] > 7) return message.reply('please enter a valid number (less than 7)')
                    const bans = await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    {
                        _id: message.guild.id,
                        banPurgeDays: args[1],
                    },
                    {
                        upsert: true,
                        new: true,
                    }
                )
                message.reply(`updated this server's banPurgeDays value to ${bans.banPurgeDays}`)
                
            default: 
                    return message.channel.send('Your first argument should be `mute`, `logs`, `ads`, `bans`')
        }
    }
}
const changeAdChannels = async (add, channelId, guildId) => {
                    if (add) {
                        await guildSchema.findOneAndUpdate(
                            { _id: guildId },
                            {
                                _id: guildId,
                                $push: {
                                    adChannels: channelId,
                                },
                            },
                            {
                                upsert: true,
                                new: true,
                            }
                        )
                    } else {
                         await guildSchema.findOneAndUpdate(
                            { _id: guildId },
                            {
                                $pull: {
                                    adChannels: channelId,
                                },
                            },
                            { new: true }
                        )
                        } 
                    }