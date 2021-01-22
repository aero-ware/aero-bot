const canvacord = require('canvacord')
const { MessageAttachment } = require('discord.js')
const levels = require('../../features/levels')
const memberSchema = require('../../schemas/member-schema')

module.exports = {
    commands: ['rank', 'level'],
    description: 'shows your level in the server.',
    category: 'Leveling',
    expectedArgs: '[user ping|id]',
    guildOnly: true,
    run: async ({ message, text }) => {
        let target = message.author
        if (message.mentions.users.first()) target = message.mentions.users.first()
        else if (text) {
            let invalidID = false
            const user = await client.users.fetch(text).catch(() => invalidID = true)
            if (!invalidID) target = user
            else return message.reply('invalid user ID.')            
        }

        if (target.bot) return message.reply('cannot get level of a bot.')

        const {xp, level, neededXP} = await levels.getXP(message.guild.id, target.id)

        const membersInGuild = await memberSchema.find({ guildId: message.guild.id})

        // sorting members in descending order of level, and if level is the same: xp
        const sortedMembers = membersInGuild.sort((a, b) => {
            if (a.level > b.level) return -1
            if (a.level < b.level) return 1
            else {
                if (a.xp > b.xp) return -1
                if (a.xp < b.xp) return 1
                else return 0
            }
        })

        const rank = new canvacord.Rank()
            .setAvatar(target.displayAvatarURL({ format: 'png' }))
            .setCurrentXP(xp)
            .setLevel(level)
            .setRank(sortedMembers.indexOf(sortedMembers.find(e => e.userId === target.id)) + 1, 'RANK') // rank is the index of the element whose userId is the same as the target, and added 1 because array indices start at 0
            .setRequiredXP(neededXP)
            .setProgressBar('#FFFFFF', 'COLOR', true)
            .setUsername(target.username)
            .setDiscriminator(target.discriminator)
            .setBackground('COLOR', '#36393F')
            .setOverlay('#36393F', 0, false)
            .setProgressBar('#e8064d', 'COLOR', true)

        rank.build().then(async buffer => {
            const attachment = new MessageAttachment(buffer, 'level.png')
            message.channel.send(attachment)
        })
    }    
}