module.exports = {
    commands: 'simban',
    description: 'admin only command that simulates a ban',
    requiredPermissions: ['ADMINISTRATOR'],
    category: 'Testing',
    guildOnly: true,
    run: ({ message, client }) => {
        client.emit('guildBanAdd', message.guild, message.author)
    }
}