const { MessageEmbed } = require("discord.js")
const memberSchema = require("../../schemas/member-schema")

module.exports = {
    commands: ['removedata'],
    description: 'removes your userdata from the database. THIS ACTION IS NOT REVERSIBLE.',
    category: 'Data',
    run: async ({ message }) => {
        const confirmationEmbed = new MessageEmbed()
            .setTitle('Remove User Data')
            .setDescription('Are you sure you want to remove ALL data stored on you?\n' +
                '**THIS IS NOT REVERSIBLE.**\n' + 
                'Please not that your punishments will not be removed as this can be used to circumvent punishments if that was allowed.'
            )
            .addField('What data will be lost?',
                '- your coin balance in all servers you are a part of.\n' + 
                '- your XP and level in all servers you are a part of.'
            )

        const confirmationMessage = await message.channel.send(confirmationEmbed)
        
        const yesOrNo = ['✅', '❌']

        yesOrNo.forEach(async (e) => await confirmationMessage.react(e))

        const choice = (
            await confirmationMessage.awaitReactions(
                (r, u) => yesOrNo.includes(r.emoji.name) && u.id === message.author.id,
                {
                    max: 1,
                    time: 15000,
                }
            )
        ).first()

        confirmationMessage.reactions.removeAll()

        if (!choice || choice.emoji.name === '❌') return message.channel.send('ok, not deleting your data.')

        if (process.env.AdminIds.split(',').includes(message.author.id)) return message.reply('you are an admin of the bot. If you really want to remove data, please contact the owner.')

        message.channel.send('deleting data...')
        await memberSchema.updateMany({ userId: message.author.id }, {
            coins: 0,
            xp: 0,
            level: 1,
            nextXPAdd: new Date(),
        })
        message.channel.send('deletion complete.')
        
    }
}