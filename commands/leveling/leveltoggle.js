const guildSchema = require("../../schemas/guild-schema")

module.exports = {
    commands: ['leveltoggle', 'enablelevel'],
    category: 'Leveling',
    description: 'Enables or disables leveling for this server.',
    requiredPermissions: ['ADMINISTRATOR'],
    minArgs: 1,
    expectedArgs: '<enabled|disabled>',
    guildOnly: true,
    run: async ({ message, args }) => {
        const arg = args[0]
        switch (arg) {
            case 'enabled':
                await guildSchema.findByIdAndUpdate(message.guild.id, {
                    levelsEnabled: true,
                }, {
                    upsert: true,
                    setDefaultsOnInsert: true,
                })
                return message.reply('leveling is enabled on this server.')

            case 'disabled':
                await guildSchema.findByIdAndUpdate(message.guild.id, {
                    levelsEnabled: false,
                }, {
                    upsert: true,
                    setDefaultsOnInsert: true,
                })
                return message.reply('leveling is now disabled on this server.')

            default:
                return message.reply('the argument must be either `enabled` or `disabled`.')
        }
    }
}