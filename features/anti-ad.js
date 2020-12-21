module.exports = client => {
    const isInvite = async (guild, code) => {
        return await new Promise(resolve => {
            guild.fetchInvites().then(invites => {
                for (const invite of invites) {
                    // invite[0] is the code
                    // example discord.gg/{code}
                    if (code === invite[0]) return resolve(true)
                }
                return resolve(false)
            })
        })
    }

    client.on('message', async message => {
        const { memmber, content } = message
        const code = content.split('discord.gg/')[1]
        if (content.includes('discord.gg/')) {
            const isOurInvite = await isInvite(message.guild, code.split(' ')[0])
            if (!isOurInvite) {
                // we know this is advertising.
                message.delete()
                message.reply('No invites from other servers.')
            }
        }
    })
}

module.exports.config = {
    displayName: 'antiAd',
    dbName: 'anti-ad', // DO NOT CHANGE
}