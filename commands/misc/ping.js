module.exports = {
    commands: ['ping', 'latency'],
    description: 'Tells you the Discord API latency and also the latency of this bot',
    category: 'Misc',
    run: ({ message, client }) => {
        message.channel.send('Calculating ping...').then(sentMessage => {
            const ping = sentMessage.createdTimestamp - message.createdTimestamp
            sentMessage.edit(`**Bot latency:** ${ping}ms, **Discord API latency:** ${client.ws.ping}ms`) // webhook test
        })
    }
}