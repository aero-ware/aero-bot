const { Client } = require('discord.js')
const WOKCommands = require('wokcommands')
const TopGG = require('@top-gg/sdk')
const AutoPoster = require('topgg-autoposter')
const periodic = require('./util/periodic')
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
                emoji: '🎮',
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

    setInterval(periodic, 5000, client)
})

client.login(process.env.token).then(() => {
    const TopAPI = new TopGG.Api(process.env.topGGToken)

    client.topGG = TopAPI

    if (process.env.clientID === client.user.id) {
        const ap = AutoPoster(process.env.topGGToken, client)

        ap.on('posted', () => {
            console.log('posted stats to top.gg')
        })
    }
})
