const guildSchema = require('../schemas/guild-schema')
const muteSchema = require('../schemas/mute-schema')

const updateMutes = async (client) => {
    const mutes = await muteSchema.find({})
    for (const mute of mutes) {
        if (mute.endTime < Date.now()) unmuteMember(mute.guildId, mute.userId, client)
    }
}

const unmuteMember = async (guildId, userId, client) => {
    const guild = await client.guilds.fetch(guildId)
    const member = await guild.members.fetch(userId)
    const { mutedRoleId } = await guildSchema.findOne({ _id: guildId })
    await member.roles.remove(mutedRoleId).then(async () => {
        await muteSchema.findOneAndDelete({
            guildId,
            userId,
        })
    })
}

module.exports = updateMutes