const { default: axios } = require('axios')
const { MessageEmbed } = require('discord.js')
const { formatDistanceToNow } = require('date-fns')
require('dotenv').config({ path: '../../.env' })

const memeSubs = [
    'memes',
    'dankmemes',
]

module.exports = {
    commands: 'meme',
    category: 'Fun',
    description: 'shows a meme from reddit',
    run: async ({ message, instance }) => {
        let apiFail = false
        let data = await fetchMeme()
            .catch(() => {
            apiFail = true
            message.reply(instance.messageHandler.get(message.guild, 'API_ERROR'))
        })
        if (apiFail) return

        // we don't want NSFW memes (sorry API)
        while (data.nsfw) data = await fetchMeme()

        const memeEmbed = new MessageEmbed()
            .setTitle(data.title)
            .setURL(data.link)
            .setDescription(instance.messageHandler.get(message.guild, 'FROM_SUB', {
                SUB: data.subreddit
            }))
            .setImage(data.url)
            .setFooter(instance.messageHandler.get(message.guild, 'REDDIT_POINTS', {
                POINTS: data.ratings.upvote - data.ratings.downvote
            }) /* + ` - ${formatDistanceToNow(Date.parse(data.createdAt), { addSuffix: true })}`*/)
            // TODO: ^^ above line, uncomment the created at time when the API is fixed

        message.channel.send(memeEmbed)
    }
}

const fetchMeme = async () => {
    const { data } = await axios.get(`https://api.snowflakedev.xyz/api/meme`, {
        headers: {
            Authorization: process.env.snowflakeToken,
        },
        params: {
            sbr: memeSubs[Math.floor(Math.random() * memeSubs.length)]
        }
    })
    return data
}