const { Message, GuildMember, User } = require("discord.js")
const WOKCommands = require('wokcommands')

module.exports = {
    /**
     * Returns the target GuildMember or User that was mentioned or their ID was given as the first argument
     * @param {Message} message the message to get the target from
     * @param {Array<string>} args the arguments of the message
     * @param {WOKCommands} instance the instance of WOKCommands
     * @returns {Promise<GuildMember|User|null>} prefers to return a member
     */
    firstArgPingID: async (message, args, instance) => {
        let target = null
        let invalidId = false
        if (!message.mentions.users || !message.mentions.members || !args.length > 0) return target
        if (!message.guild) {
            target = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => { invalidId = true })        
        } else {
            target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => { invalidId = true })
            if (!target) target = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => { invalidID = true })
        }

        if (invalidId) {
            message.reply(instance.messageHandler.get(message.guild, 'INVALID_USER_ID'))
            return null
        } else return target
    },

    /**
     * Returns the GuildMember or User who was mentioned or their ID was given as the first argument, or returns the author, or null if an invalid target was given
     * @param {Message} message the message to get the target from
     * @param {Array<string>} args the arguments of the message
     * @param {WOKCommands} instance the instance of WOKCommands
     * @returns {Promise<GuildMember|User|null>} the member or user that was the target of the command (prefers member)
     */
    firstArgOrSelf: async (message, args, instance) => {
        let target = message.member || message.author
        let invalidId = false
        if (!message.mentions.users || !message.mentions.members || !args.length > 0) return target
        if (!message.guild) {
            target = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => { invalidId = true })        
        } else {
            target = message.mentions.members.first() || await message.guild.members.fetch(args[0]).catch(() => { invalidId = true })
            if (!target) target = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => { invalidID = true })
        }

        if (invalidId) {
            message.reply(instance.messageHandler.get(message.guild, 'INVALID_USER_ID'))
            return null
        } else return target
    }
}