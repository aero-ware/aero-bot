const { MessageEmbed, Client } = require("discord.js")
const guildSchema = require("../../schemas/guild-schema")

module.exports = {
    commands: ['rolemenu', 'reactionroles', 'reaction-roles'],
    category: 'Tools',
    description: 'create, update, and remove reaction role menus. Run `rolemenu help` to see the instructions',
    expectedArgs: '<add|remove|update|help> [message ID] [emoji] [role ID|\'none\']',
    minArgs: 1,
    maxArgs: 4,
    permissions: 'ADMINISTRATOR',
    guildOnly: true,
    run: async ({ message, args, prefix }) => {
        const [arg, messageID, emoji, roleID] = args
        let { roleMenus } = await guildSchema.findOne({ _id: message.guild.id }) || null
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
                if (!(roleMenus && roleMenus.has(messageID))) return message.reply('that message is not set up as a rolemenu.')
                roleMenus.delete(messageID)
                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    { roleMenus }
                )
                return message.reply(`message ${messageID} has been removed from this servers rolemenus.`)

            case 'update':
                if (!roleMenus || !roleMenus.has(messageID)) return message.reply(`message ${messageID} does not have a rolemenu attached to it. Use \`rolemenu add <message ID>\` to create one.`)
                const emote = getEmote(emoji, message.client)
                let e = emote.emoteName || emote.emoteID
                console.log(emote)
                if (!emote) return message.reply('you did not give me an emote to add.')

                if (roleID === 'none') { // removing a reactionrole if 'none' is provided
                    delete roleMenus.get(messageID)[e]
                    await guildSchema.findOneAndUpdate(
                        { _id: message.guild.id },
                        { roleMenus }
                    )
                    return message.reply(`emoji ${emoji}'s role in rolemenu of message ${messageID} has been removed.`)
                } else if (!await message.guild.roles.cache.get(roleID)) return message.reply('invalid role ID.')

                roleMenus.get(messageID)[e] = roleID
                const roleMenuMessage = await message.channel.messages.fetch(messageID)
                roleMenuMessage.react(e)
                await guildSchema.findOneAndUpdate(
                    { _id: message.guild.id },
                    { roleMenus }
                )
                return message.reply(`role ${roleID} added to message ${messageID} in emoji ${emote.emoteID ? `<:${message.guild.emojis.cache.get(emote.emoteID).name}:${emote.emoteID}>` : emote.emoteName}`)

            case 'help':
                const helpEmbed = new MessageEmbed()
                    .setTitle('Usage for the rolemenu command')
                    .setDescription('This embed describes how to create, update, or remove role menus.')
                    .addFields(
                        {
                            name: 'Creating a rolemenu',
                            value: '**1.** Send a message to have the rolemenu attached to.\n' + 
                                `**2.** Run \`${prefix}rolemenu add <message ID>\` to initialize the rolemenu for that message **in the same channel as the message**`,
                        },
                        {
                            name: 'Adding roles to a rolemenu',
                            value: `Run \`${prefix}rolemenu update <message ID> <emoji> <role ID>\` **in the same channel as the message**.\n` +
                                '*The emoji will be automatically added as a reaction to the message.*',
                        },
                        {
                            name: 'Removing a role from a rolemenu',
                            value: `Run \`${prefix}rolemenu update <message ID> <emoji> none\` **in the same channel as the message**.\n` + 
                                '*The emoji will be deregistered for adding roles.*'
                        },
                        {
                            name: 'Deleting a rolemenu',
                            value: `Run \`${prefix}rolemenu remove <message ID>\` **in the same channel as the message**`,
                        }
                    )
                    .setColor('#32a852')

                return message.channel.send(helpEmbed)

            default:
                return message.reply('invalid usage, the first argument should be `add`, `remove`, `update` or `help`')
        }
    }
}

/**
 * Searches the given string for an emoji
 * @param {string} str the string that should be searched for an emoji
 * @param {Client} client the client for the bot
 */
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

const containsOnlyEmojis = text => {
    const onlyEmojis = text.replace(new RegExp('[\u0000-\u1eeff]', 'g'), '')
    const visibleChars = text.replace(new RegExp('[\n\r\s]+|( )+', 'g'), '')
    return onlyEmojis.length === visibleChars.length
}