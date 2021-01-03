module.exports = {
    commands: ['invites'],
    category: 'Tools',
    description: 'shows how many people you (or someone else) has invited to this server.',
    guildOnly: true,
    run: async ({ message, text }) => {
        let target = message.author
        if (message.mentions.users.first()) target = message.mentions.users.first()
        else if (text) {
            let invalidID = false
            const user = await client.users.fetch(text).catch(() => invalidID = true)
            if (!invalidID) target = user
            else return message.reply('invalid user ID.')            
        }

        const invites = await message.guild.fetchInvites()
        const userInvites = invites.filter(invite => invite.inviter.id === target.id)

        let uses = 0
        userInvites.forEach(value => {
            uses += value.uses
        })

        message.reply(`${target === message.author ? 'you have' : `${target} has`} invited ${uses} people so far${uses === 0 ? '...' : '!'}`)
    }
}