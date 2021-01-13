const guildSchema = require('../schemas/guild-schema')

module.exports = (client, instance, isEnabled) => {
    client.on('guildMemberAdd', async member => {
        const { autoRole } = await guildSchema.findOne({ _id: member.guild.id }) || { autoRole: null }
        console.log(autoRole)
        if (!autoRole) return
        if (member.user.bot) return

        await member.roles.add(autoRole)
    })
}

module.exports.config = {
    displayName: 'autorole',
    dbName: 'AUTOROLE',
    loadDBFirst: true,
}
