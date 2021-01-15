const updateMutes = require("./mute-checker")
const updatetempBans = require("./tempban-checker")

module.exports = (client) => {
    updateMutes(client)
    updatetempBans(client)
    client.user.setPresence({
        activity: {
            type: 'WATCHING',
            name: `${client.guilds.cache.size} Servers! >help`
        }
    })
}