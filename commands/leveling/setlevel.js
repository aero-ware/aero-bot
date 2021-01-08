const { GuildMember } = require('discord.js')
const levels = require('../../features/levels')
const memberSchema = require('../../schemas/member-schema')
const getTarget = require('../../util/get-target')

module.exports = {
    commands: 'setlevel',
    category: 'Leveling',
    description: 'Owner only command that sets the level of a user',
    ownerOnly: true,
    minArgs: 2,
    expectedArgs: '<user ping|id> <level>',
    run: async ({ message, args, instance }) => {
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