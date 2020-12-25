const { MessageEmbed } = require("discord.js")
const guildSchema = require("../../schemas/guild-schema")

module.exports = {
    commands: ['rolemenu', 'reactionroles', 'reaction-roles'],
    category: 'Tools',
    descriprion: 'create, update, and remove reaction role menus. Run `rolemenu help` to see the instructions',
    expectedArgs: '<add|remove|update|help> [message ID] [emoji] [role ID]',
    minArgs: 1,
    maxArgs: 4,
    permissions: 'ADMINISTRATOR',
    run: async (message, args) => {
        const [arg, messageID, emoji, roleID] = args
        let { roleMenus } = await guildSchema.findOne({ _id: message.guild.id })
        switch (arg) {
            case 'add':
                
                if (!roleMenus) roleMenus = new Map()
                roleMenus.set(messageID, new Map())
                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    {
                        _id: message.guild.id,
                        roleMenus,
                    },
                    { upsert: true }
                )
                return message.reply(`new rolemenu created in message ${messageID}. Use \`rolemenu update ${messageID} <emoji> <role ID>\` to add roles to it.`)

            case 'remove':
                // not done yet
                return

            case 'update':
                if (!roleMenus || !roleMenus.has(messageID)) return message.reply(`message ${messageID} does not have a rolemenu attached to it. Use \`rolemenu add <message ID>\` to create one.`)
                let emote = getEmote(emoji, message.client)
                emote = emote.emoteName || emote.emoteID
                if (!emote) return message.reply('you did not give me an emote to add.')
                if (!await message.guild.roles.cache.get(roleID)) return message.reply('invalid role ID.')
                roleMenus.get(messageID)[emote] = roleID
                const roleMenuMessage = await message.channel.messages.fetch(messageID)
                roleMenuMessage.react(emote)
                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    { roleMenus }
                )
                return message.reply(`role <@&${roleID}> added to message ${messageID} in emoji ${emote}`)

            case 'help':
                const helpEmbed = new MessageEmbed()
                    .setTitle('Usage for the rolemenu command')
                    .setDescription('This embed describes how to create, update, or remove role menus.')
                    .addFields(
                        {
                            name: 'Creating a rolemenu',
                            value: '1. Send a message to have the rolemenu attached to.'
                        }
                    )

                return message.channel.send(helpEmbed)

            default:
                return message.reply('invalid usage, the first argument should be `add`, `remove`, `update` or `help`')
        }
    }
}

const getEmote = (str, client) => {
    let emoteName, emoteID, e, n

    // If the emote is an animated emote:
    if (str.startsWith('<a:')) {
        e = str.slice(3)
        n = e.search(':')
        emoteName = e.slice(0, n)
        emoteID = e.slice(n + 1, -1)
    // If the emote is a non-animated custom emote
    } else if (str.startsWith('<:')) {
        e = str.slice(2)
        n = e.search(':')
        emoteName = e.slice(0, n)
        emoteID = e.slice(n + 1, -1)
    // If its neither, then it has to be a normal discord emote
    } else {
        // Check if it a default emote
        if (!containsOnlyEmojis(str)) return
        emoteName = str
    }

    // emoteID = undefined => then its a default emote
    if (emoteID) {
        e = client.emojis.cache.get(emoteID)
        if (!e) return
        else return { emoteID: emoteID }
    } else if (emoteName) {
        return { emoteName: emoteName }
    } else return
}

const containsOnlyEmojis = (text) => {
    const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
    const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
    return onlyEmojis.length === visibleChars.length
}