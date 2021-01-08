const canvacord = require('canvacord')
const { MessageAttachment } = require('discord.js')
const fs = require('fs')
const levels = require('../../features/levels')

module.exports = {
    commands: ['rank', 'level'],
    description: 'shows your level in the server.',
    category: 'Leveling',
    expectedArgs: '[user ping|id]',
    run: async ({ message, text }) => {
        let target = message.author
        if (message.mentions.users.first()) target = message.mentions.users.first()
        else if (text) {
            let invalidID = false
            const user = await client.users.fetch(text).catch(() => invalidID = true)
            if (!invalidID) target = user
            else return message.reply('invalid user ID.')            
        }

        const {xp, level, neededXP} = await levels.getXP(message.guild.id, target.id)

        const rank = new canvacord.Rank()
            .setAvatar(target.displayAvatarURL({ format: 'png' }))
            .setCurrentXP(xp)
            .setLevel(level)
            .setRank(1, 'RANK', false) // doesn't display rank, convienent cuz I don't want to calculate it. If any cloner (or aspiring dev) wants to implement it, please don't hesitate to send a PR!
            .setRequiredXP(neededXP)
            .setProgressBar('#FFFFFF', 'COLOR', true)
            .setUsername(target.username)
            .setDiscriminator(target.discriminator)

        rank.build().then(async buffer => {
            const attachment = new MessageAttachment(buffer, 'level.png')
            message.channel.send(attachment)
        })
    }    
}