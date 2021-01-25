const { add, isPast } = require('date-fns')
const { Message } = require('discord.js')
const memberSchema = require('../schemas/member-schema')
const guildSchema = require('../schemas/guild-schema')

module.exports = async (client, instance, isEnabled) => {
    client.on('message', async message => {
        if (message.author.bot) return
        if (!message.guild) return

        const { levelsEnabled } = await guildSchema.findById(message.guild.id) || { levelsEnabled: true }
        if (!levelsEnabled) return

        const { guild, member } = message
        const { nextXPAdd } = await memberSchema.findOne({
            guildId: guild.id,
            userId: member.id,
        }) || { nextXPAdd: null }
        if (nextXPAdd && !isPast(nextXPAdd)) return
        addXP(guild.id, member.id, 23, message)
    })
}

/**
 * @typedef LevelData
 * @type {object}
 * @property {number} level the level of the member
 * @property {number} xp the xp of the member
 * @property {number} neededXP the XP required for the member to level up
 */

/**
 * Finds the number of XP needed for a member of that level to level up
 * @param {number} level the current level of a member
 * @returns {number} the number of XP required to level up
 */
const getNeededXP = level => level * level * 100
module.exports.getNeededXP = getNeededXP

/**
 * Adds some XP to the member
 * @param {string} guildId the ID of the guild the member is in
 * @param {string} userId the ID of the user to add XP to
 * @param {number} xpToAdd the number of XP to add to the member
 * @param {Message} message the message object that triggered this function
 * @returns {Promise<LevelData>} information about the level and XP of the member
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
            nextXPAdd: add(Date.now(), { minutes: 1 })
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

        const newInfo = await memberSchema.updateOne(
            {
                guildId,
                userId,
            },
            {
                level,
                xp,
            }
        )

        return {
            level: newInfo.level,
            xp: newInfo.xp,
            neededXP: getNeededXP(newInfo.level)
        }
    }
}
module.exports.addXP = addXP

/**
 * Returns an object with the details of the GuildMember's level
 * @param {string} guildId the ID of the guild the user is in
 * @param {string} userId the ID of the user
 * @returns {Promise<LevelData>} information about that member's level
 */
const getLevelData = async (guildId, userId) => {
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
module.exports.getXP = getLevelData

/**
 * Sets the level of the member to the level parameter
 * @param {string} guildId the ID of the guild the member is in
 * @param {string} userId the ID of the user whose level to set
 * @param {number} level the level the member should have
 * @returns {Promise<LevelData>} information about the member's new level
 */
const setLevel = async (guildId, userId, level) => {
    const newInfo = await memberSchema.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            level,
            xp: 0,
        },
        {
            upsert: true,
            new: true,
        }
    )

    return {
        level: newInfo.level,
        xp: newInfo.xp,
        neededXP: getNeededXP(newInfo.level)
    }
}
module.exports.setLevel = setLevel

module.exports.config = {
    displayName: 'levels',
    dbName: 'LEVELS', // DO NOT CHANGE
    loadDBFirst: true,
}