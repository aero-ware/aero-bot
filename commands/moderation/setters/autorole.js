const guildSchema = require('../../../schemas/guild-schema')

module.exports = {
    commands: ["autorole"],
    category: "Moderation",
    description: "role to set when someone joins",
    expectedArgs: "[role ping|id]",
    requiredPermissions: ['ADMINISTRATOR'],
    guildOnly: true,
    run: async ({ message, args }) => {
        if (!args[0]) {
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
    }
}