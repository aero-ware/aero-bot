module.exports = {
    commands: ['status', 'setstatus'],
    category: 'Misc',
    description: 'owner only command. Sets the bot\'s status.',
    ownerOnly: true,
    expectedArgs: '<type> <text>',
    minArgs: 2,
    run: ({ message, client, args }) => {
        let [type, ...activity] = args
        activity = activity.join(' ')

        switch (type.toLowerCase()) {
            case 'playing':
                type = 'PLAYING'
                break
            
            case 'streaming':
                type = 'STREAMING'
                break

            case 'listening':
                type = 'LISTENING'
                break

            case 'watching':
                type = 'WATCHING'
                break

            case 'competing':
                type = 'COMPETING'
                break

            default:
                return message.reply('invalid prescence type.')
        }

        client.user.setPresence({
            activity: {
                name: activity,
                type
            }
        })
    }
}