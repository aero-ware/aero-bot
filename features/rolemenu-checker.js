const guildSchema = require("../schemas/guild-schema")

module.exports = async (client, instance, isEnabled) => {
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return

        const { message } = reaction
        if (!message.guild) return

        const { roleMenus } = await guildSchema.findOne({ _id: message.guild.id }) || { roleMenus: null }
        if (roleMenus && !roleMenus.has(message.id)) return

        const member = await message.guild.members.cache.get(user.id)
        if (!member) return

        if (reaction.emoji in roleMenus.get(message.id)|| reaction.emoji.id in roleMenus.get(message.id)) {
            let role = await message.guild.roles.fetch(roleMenus.get(message.id)[reaction.emoji])
            if (reaction.emoji.guild) {
                role = await reaction.emoji.guild.roles.fetch(roleMenus.get(message.id)[reaction.emoji.id])
            }
            await member.roles.add(role)
        }
    })

    client.on('messageReactionRemove', async (reaction, user) => {
        if (user.bot) return

        const { message } = reaction
        if (!message.guild) return

        const { roleMenus } = await guildSchema.findOne({ _id: message.guild.id })
        if (!roleMenus.has(message.id)) return

        const member = await message.guild.members.cache.get(user.id)
        if (!member) return

        if (reaction.emoji in roleMenus.get(message.id)|| reaction.emoji.id in roleMenus.get(message.id)) {
            let role = await message.guild.roles.fetch(roleMenus.get(message.id)[reaction.emoji])
            if (reaction.emoji.guild) {
                role = await reaction.emoji.guild.roles.fetch(roleMenus.get(message.id)[reaction.emoji.id])
            }
            await member.roles.remove(role)
        }
    })
}

module.exports.config = {
    displayName: 'rolemenus',
    dbName: 'ROLEMENUS', // DO NOT CHANGE
    loadDBFirst: true,
}