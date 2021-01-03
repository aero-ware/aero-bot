module.exports = {
    commands: 'simjoin',
    description: 'admin only command that simulates someone joining',
    expectedArgs: '',
    permissions: 'ADMINISTRATOR',
    category: 'Testing',
    guildOnly: true,
    run: ({ message, client }) => {
        client.emit('guildMemberAdd', message.member)
    }
}