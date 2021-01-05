const { default: axios } = require("axios")
require('dotenv').config({ path: '../../.env' })

module.exports = {
    commands: ['unmorse', 'morsedecode', 'morse-decode'],
    category: 'Fun',
    description: 'converts morse code into text',
    minArgs: 1,
    expectedArgs: '<text>',
    run: async ({ message, text }) => {
        const morseRegex = /^( |\.|-|\/)+$/
        if (!morseRegex.test(text)) return message.reply('invalid morse code.')
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
            message.reply('there was an API Error, please try again later.')
        })
        if (apiFail) return
        message.reply(res.data.data ? res.data.data : 'There was an API Error, please try again later.')
    }
}