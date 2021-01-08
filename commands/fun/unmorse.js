const { default: axios } = require("axios")
require('dotenv').config({ path: '../../.env' })

module.exports = {
    commands: ['unmorse', 'morsedecode', 'morse-decode'],
    category: 'Fun',
    description: 'converts morse code into text',
    minArgs: 1,
    expectedArgs: '<text>',
    run: async ({ message, text, instance }) => {
        const morseRegex = /^( |\.|-|\/)+$/
        if (!morseRegex.test(text)) return message.reply(instance.messageHandler.get(message.guild, 'INVALID_MORSE_CODE'))
        let apiFail = false
        const res = await axios.get(`https://api.snowflakedev.xyz/api/morse/decode`, {
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