const updateMutes = require("./mute-checker")
const updatetempBans = require("./tempban-checker")

module.exports = (client) => {
    updateMutes(client)
    updatetempBans(client)
    if (client.user.presence.activities.length === 0 || /\d+ \w+/g.test(client.user.presence.activities[0].name)) client.user.setPresence({
        activity: {
            type: 'WATCHING',
            name: `${client.guilds.cache.size} Servers! >help`
        }
    })
}