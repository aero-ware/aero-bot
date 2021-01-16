const guildSchema = require('../schemas/guild-schema')
const muteSchema = require('../schemas/mute-schema')
const { Client } = require('discord.js')

const updateMutes = async (client) => {
    const mutes = await muteSchema.find({})
    for (const mute of mutes) {
        if (mute.endTime < Date.now()) unmuteMember(mute.guildId, mute.userId, client)
    }
}

/**
 * 
 * @param {string} guildId the ID of the guild the member is in
 * @param {string} userId the ID of the user to unmute
 * @param {Client} client the client
 */
const unmuteMember = async (guildId, userId, client) => {
    const guild = await client.guilds.fetch(guildId).catch()
    if (!guild) return

    const { mutedRoleId } = await guildSchema.findOne({ _id: guildId }).catch()
    if (!mutedRoleId) return

    const member = await guild.members.cache.get(userId)
    if (member) {
        member.roles.remove(mutedRoleId)
    }
    await muteSchema.findOneAndDelete({
        guildId,
        userId,
    })

}

module.exports = updateMutes