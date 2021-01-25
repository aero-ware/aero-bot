const memberSchema = require('../../schemas/member-schema')
const tempbanSchema = require('../../schemas/tempban-schema')
const muteSchema = require('../../schemas/mute-schema')
const { MessageAttachment } = require('discord.js')

module.exports = {
    commands: 'userdata',
    category: 'Data',
    description: 'sends you all userdata stored about you',
    run: async ({ message }) => {
        let userData = {}
        userData.userID = message.author.id

        const memberInfo = await memberSchema.find({ userId: message.author.id })
        userData.guildMemberInfo = memberInfo

        const tempbanInfo = await tempbanSchema.find({ userId: message.author.id })
        userData.tempBans = tempbanInfo

        const tempmuteInfo = await muteSchema.find({ userId: message.author.id })
        userData.tempMutes = tempmuteInfo

        message.author.send('Your userdata', new MessageAttachment(Buffer.from(JSON.stringify(userData, (k, v) => (k === "__v" || k === "_id" || k === "userId") ? undefined : v, 4), 'utf-8'), `userdata-${message.author.tag}.json`))
            .catch(() => {
                message.channel.send('due to the possibly sensitive nature of userdata, please enable DMs so that I can send it to you privately, then run this command again.')
            })
    }
}