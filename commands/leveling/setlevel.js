const { GuildMember } = require('discord.js')
const levels = require('../../features/levels')
const guildSchema = require('../../schemas/guild-schema')
const getTarget = require('../../util/get-target')

module.exports = {
    commands: 'setlevel',
    category: 'Leveling',
    description: 'sets the level of a user',
    minArgs: 2,
    expectedArgs: '<user ping|id> <level>',
    guildOnly: true,
    requiredPermissions: ['ADMINISTRATOR'],
    run: async ({ message, args, instance }) => {
        const { levelsEnabled } = await guildSchema.findById(message.guild.id) || { levelsEnabled: true }
        if (!levelsEnabled) return message.reply('leveling is disabled on this server.')

        let target = await getTarget.firstArgPingID(message, args, instance)
        target = target instanceof GuildMember ? target.user : target
        if (!target) return

        const levelToSet = args[1]

        const newInfo = await levels.setLevel(message.guild.id, target.id, levelToSet)

        message.reply(instance.messageHandler.get(message.guild, 'SET_LEVEL_CONFIRMATION', {
            TARGET: target,
            LEVEL: newInfo.level,
        }))
    }
}