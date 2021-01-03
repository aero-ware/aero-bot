const { Message } = require('discord.js')
const memberSchema = require('../schemas/member-schema')

module.exports = (client, instance, isEnabled) => {
    client.on('message', message => {
        if (message.author.bot) return
        const { guild, member } = message
        addXP(guild.id, member.id, 23, message)
    })
}

/**
 * Finds the number of XP needed for a member of that level to level up
 * @param {number} level the current level of a member
 * @returns {number} the number of XP required to level up
 */
const getNeededXP = level => level * level * 100
module.exports.getNeededXP = getNeededXP

/**
 * 
 * @param {string} guildId the ID of the guild the member is in
 * @param {string} userId the ID of the user to add XP to
 * @param {number} xpToAdd the number of XP to add to the member
 * @param {Message} message the message object that triggered this function
 */
const addXP = async (guildId, userId, xpToAdd, message) => {
    const result = await memberSchema.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                xp: xpToAdd,
            },
        },
        {
            upsert: true,
            new: true,
        }
    )
    
    let { xp, level } = result
    const needed = getNeededXP(level)
    if (xp >= needed) {
        level++
        xp -= needed

        message.reply(`You just advanced to level ${level}!`)

        await memberSchema.updateOne(
            {
                guildId,
                userId,
            },
            {
                level,
                xp,
            }
        )
    }
}
module.exports.addXP = addXP

/**
 * @typedef LevelData
 * @type {object}
 * @property {number} level the level of the member
 * @property {xp} number the xp of the member
 * @property {neededXP} number the XP required for the member to level up
 * 
 */

/**
 * Returns an object with the details of the GuildMember's level
 * @param {string} guildId the ID of the guild the user is in
 * @param {string} userId the ID of the user
 * @returns {LevelData} information about that member's level
 */
const getXP = async (guildId, userId) => {
    const member = await memberSchema.findOne({
        guildId,
        userId,
    })
    return {
        level: member.level,
        xp: member.xp,
        neededXP: getNeededXP(member.level)
    }
}
module.exports.getXP = getXP

module.exports.config = {
    displayName: 'levels',
    dbName: 'LEVELS', // DO NOT CHANGE
    loadDBFirst: true,
}