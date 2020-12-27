const ban = require('../commands/moderation/ban')
const guildSchema = require('../schemas/guild-schema')
const { Client } = require('discord.js')
const tempbanSchema = require('../schemas/tempban-schema')

const updatetempBans = async (client) => {
    const tempbans = await tempbanSchema.find({})
    for (const tempban of tempbans) {
        if (tempban.endTime < Date.now()) {
            unbanMember(tempban.guildId, tempban.userId, client)
        }
    }
}

/**
 * 
 * @param {string} guildId the ID of the guild
 * @param {string} userId the ID of the banned user
 * @param {Client} client the client
 */
const unbanMember = async (guildId, userId, client) => {
    const guild = await client.guilds.fetch(guildId)
    const user = await client.users.fetch(userId)
    const guildBans = await guild.fetchBans()
    const userIsBanned = guildBans.has(userId)
    if (userIsBanned) {
        await guild.members.unban(user)
    } 
    await tempbanSchema.findOneAndDelete({ guildId, userId })
}

module.exports = updatetempBans