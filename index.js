const { Client } = require('discord.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()

const client = new Client({
    partials: ['MESSAGE', 'REACTION']
})

client.on('ready', () => {
    console.log('Ready!')
    new WOKCommands(client, 'commands', 'features', 'messages.json')
        .setMongoPath(process.env.mongoPath)
        .setBotOwner(process.env.adminIds.split(','))
        .setDefaultPrefix(process.env.defaultPrefix)
        .setDefaultLanguage('english')
        .setCategoryEmoji('Economy', '💰')
        .setCategoryEmoji('Moderation', '🔨')
        .setCategoryEmoji('Fun', '🎉')
        .setCategoryEmoji('Misc', '📚')
})

client.login(process.env.token)
