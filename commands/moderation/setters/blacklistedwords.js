const guildSchema = require("../../../schemas/guild-schema")

module.exports = {
    commands: ['swearwords', 'blacklistedwords', 'wordblacklist', 'setblacklist'],
    description: 'adds, removes, or **shows** the current blacklisted words in this server.',
    category: 'Moderation',
    permissions: 'ADMINISTRATOR',
    expectedArgs: '<add|remove|list> [word]',
    minArgs: 1,
    guildOnly: true,
    run: async ({ message, args }) => {
        const [arg, ...words] = args
        const word = words.join(' ') || null
        const { blacklistedWords } = await guildSchema.findOne({ _id: message.guild.id }) || null
        switch (arg) {
            case 'add':
                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    {
                        _id: message.guild.id,
                        $push: {
                            blacklistedWords: word,
                        },
                    },
                    { upsert: true }
                )
                return message.reply(`added ${word} to the list of blacklisted words for this server.`)

            case 'remove':
                if (!blacklistedWords.includes(word)) return message.reply('that word is not in the blacklisted word database.')
                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    {
                        _id: message.guild.id,
                        $pull: {
                            blacklistedWords: word,
                        },
                    },
                    { upsert: true }
                )
                return message.reply(`removed ${word} from the list of blacklisted words for this server.`)

            case 'list':
                if (!blacklistedWords || !blacklistedWords.length) return message.reply('there are no blacklisted words set up for this server.')
                return message.reply(`the blacklisted words on this server are: ${blacklistedWords.join(', ')}`)

            default:
                return message.reply('The first argument should be either `add`, `remove`, or `list` and the second argument should be a string if it is not `list`')
        }
    }
}