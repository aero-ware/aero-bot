const guildSchema = require("../../../schemas/guild-schema")

module.exports = {
    commands: ['setadchannels', 'adchannels', 'allowads'],
    description: 'sets or removes a channel to allow invites from other servers in',
    category: 'Moderation',
    minArgs: 2,
    expectedArgs: '<add|remove> <channel>',
    guildOnly: true,
    run: async ({ message, args, prefix }) => {
        const channel = message.mentions.channels.first() || null
        if (!channel || channel.guild !== message.guild ) return message.reply('please provide a valid channel.')
        switch (args[0]) {
            case 'add':
                await changeAdChannels(true, channel.id, message.guild.id)
                return message.reply(`${channel} is now allowed for advertising.`)
            
            case 'remove':
                await changeAdChannels(false, channel.id, message.guild.id)
                return message.reply(`${channel} is now disallowed for advertising.`)

            default:
                return message.reply(`Incorrect usage. Please use ${prefix}setadchannels <add|remove> <channel>`)
        }
    }
}

/**
 * 
 * @param {boolean} add add or remove a channel
 * @param {string} channelId the ID of the channel to add or remove
 * @param {string} guildId the ID of the guild where these changes are stored
 * @returns {Promise<Document<any>} the guild config document for that guild
 */
const changeAdChannels = async (add, channelId, guildId) => {
    if (add) {
        return await guildSchema.findOneAndUpdate(
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
        return await guildSchema.findOneAndUpdate(
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