const { Client } = require('discord.js')
const WOKCommands = require('wokcommands')
const updateMutes = require('./util/mute-checker')
const updatetempBans = require('./util/tempban-checker')
require('dotenv').config()

const client = new Client({
    partials: ['MESSAGE', 'REACTION']
})

client.on('ready', () => {
    console.log('Ready!')
    const wok = new WOKCommands(client, {
        commandsDir: 'commands',
        featureDir: 'features',
        messagesPath: 'messages.json',
        showWarns: true,
    })
        .setMongoPath(process.env.mongoPath)
        .setDefaultPrefix(process.env.defaultPrefix)
        .setBotOwner(process.env.adminIds.split(','))
        .setDefaultLanguage('english')
        .setCategorySettings([
            {
                name: 'Economy',
                emoji: '💰'
            },
            {
                name: 'Moderation',
                emoji: '⚔',
            },
            {
                name: 'Fun',
                emoji: '🎉',
            },
            {
                name: 'Tools',
                emoji: '🔧',
            },
            {
                name: 'Leveling',
                emojiL: '🎮',
            },
            {
                name: 'Misc',
                emoji: '📚',
            },
            {
                name: 'Testing',
                emoji: '🧪',
                hidden: true,
            },
        ])
        .setColor('#90edaf')

    wok.on('databaseConnected', (conection, state) => {
        console.log('Connected to database!, state: ' + state)
    })

    setInterval(() => {
        updateMutes(client)
        updatetempBans(client)
    }, 5000)
})

client.login(process.env.token)
