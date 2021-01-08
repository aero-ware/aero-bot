const { default: axios } = require("axios")
require('dotenv').config({ path: '../../.env' })

module.exports = {
    commands: ['morse', 'morsecode', 'morse-encode'],
    category: 'Fun',
    description: 'converts text into morse code',
    minArgs: 1,
    expectedArgs: '<text>',
    run: async ({ message, text, instance }) => {
        let apiFail = false
        const res = await axios.get(`https://api.snowflakedev.xyz/api/morse/encode`, {
            headers: {
                Authorization: process.env.snowflakeToken,
            },
            params: {
                text,
            },
        }).catch(() => {
            apiFail = true
            message.reply(instance.messageHandler.get(message.guild, 'API_ERROR'))
        })
        if (apiFail) return
        message.reply(res.data.data ? res.data.data : instance.messageHandler.get(message.guild, 'API_ERROR'))
    }
}