module.exports = {
    commands: ['support'],
    aliases: ['link', 'invite', 'docs'],
    category: 'tools',
    description: 'Gives you all the link to help you with the bot!',
    callback: ({message, instance}) => {
        const { MessageEmbed} = require('discord.js')
        const { guild } = message
        message.channel.send(new MessageEmbed()
            .setTitle('Useful links.')
            .addFields({
                name: 'Support Server',
                value: 'Need help with the bot?, found a bug?, some errors with cloning? Enter the server to get all the answers you need by clicking this [link](https://discord.gg/JdTQG3a9Ye)',
                inline: true
            },
            {
                name: 'Inviting the bot',
                value: 'Invite the bot using this [link!](https://discord.com/oauth2/authorize?client_id=787460489427812363&permissions=8&scope=bot)',
                inline: true
            },
            {
                name: 'Docs',
                value:'Check the documents about some commands via the [website](https://aero-ware.github.io/aero-bot/) **the docs are not complete**',
                inline: true
            })
            .setTimestamp(new Date())
            .setColor('d14242'))
    }
}