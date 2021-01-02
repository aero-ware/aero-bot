const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
    commands: ['setmutedrole', 'setmuterole', 'muterole'],
    description: 'sets the role to use when muting someone',
    category: 'Moderation',
    permissions: 'ADMINISTRATOR',
    expectedArgs: '<role ping|role id|\'none\'>',
    minArgs: 1,
    guildOnly: true,
    run: async ({ message, text }) => {
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
    }
}