module.exports = {
    commands: 'poll',
    description: 'adds a poll to the provided message',
    minArgs: 2,
    expectedArgs: '<type (yn|ymn)> <messageID>',
    category: 'Tools',
    run: async ({ message, args }) => {
        const messageToReact = await message.channel.messages.fetch(args[1])
        if (!messageToReact) return message.reply(`the message with id ${args[1]} does not exist`)
        switch (args[0]) {
            case 'yn':
                messageToReact.react('👍')
                setTimeout(() => messageToReact.react('👎'), 500)
                break
            
            case 'ymn':
                messageToReact.react('👍')
                setTimeout(() => messageToReact.react('😑'), 500)
                setTimeout(() => messageToReact.react('👎'), 500)
                break
        }
        return message.delete()
    }
}