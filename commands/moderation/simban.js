module.exports = {
    commands: 'simban',
    description: 'admin only command that simulates a ban',
    permissions: 'ADMINISTRATOR',
    category: 'Moderation',
    run: message => {
        return message.client.emit('guildBanAdd', message.guild, message.author)
    }
}