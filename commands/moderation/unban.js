const tempbanSchema = require("../../schemas/tempban-schema")

module.exports = {
    commands: 'unban',
    description: 'unbans a user (kina obvious from the name)',
    category: 'Moderation',
    minArgs: 1,
    permissions: 'BAN_MEMBERS',
    expectedArgs: '<user ID|*ping*>',
    guildOnly: true,
    run: async ({ message, args }) => {
        const targetId = message.mentions.users.first() ? message.mentions.users.first().id : args[0]
        const guildBans = await message.guild.fetchBans()
        const userIsBanned = guildBans.has(targetId)

        if (!userIsBanned) return message.reply('that user is not currently banned.')
        await message.guild.members.unban(targetId)
        await message.reply(`${await message.client.users.fetch(targetId)} has been unbanned`)
        // delete the tempban if it exists
        await tempbanSchema.findOneAndDelete({
            guildId: message.guild.id,
            userId: targetId,
        })
    }
}