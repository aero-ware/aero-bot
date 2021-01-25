const updateMutes = require("./mute-checker")
const updatetempBans = require("./tempban-checker")

const muteBans = (client) => {
    updateMutes(client)
    updatetempBans(client)
}

const statusUpdate = (client) => {
    if (client.user.presence.activities.length === 0 || /\d+ \w+/g.test(client.user.presence.activities[0].name))
        client.user.setPresence({
            activity: {
                type: 'WATCHING',
                name: `${client.guilds.cache.size} Servers! >help`
            }
        })
}

module.exports = (client) => {
    setInterval(muteBans, 5000, client) // update mutes and bans every 5 seconds
    setInterval(statusUpdate, 1800000, client) // change server count status every 30 mins
}