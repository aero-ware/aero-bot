module.exports = {
    commands: 'simjoin',
    description: 'admin only command that simulates someone joining',
    expectedArgs: '',
    requiredPermissions: ['ADMINISTRATOR'],
    category: 'Testing',
    guildOnly: true,
    run: ({ message, client }) => {
        client.emit('guildMemberAdd', message.member)
    }
}