module.exports = {
    commands: '8ball',
    category: 'Fun',
    description: 'Ask the magic 8 ball about all your problems!',
    minArgs: 1,
    expectedArgs: '<question>',
    syntaxError: 'the 8ball is too busy to listen to prank callers',
    run: ({ message }) => {
        const answers = [
            'as I see it, yes',
            'ask again later.',
            'better not tell you now.',
            'cannot predict now.',
            'concentrate and ask again.',
            'don\'t count on it.',
            'it is certain.',
            'it is decidedly so.',
            'most likely',
            'my reply is no.',
            'my sources say no.',
            'outlook not so good.',
            'reply hazy, try again.',
            'outlook good.',
            'signs point to yes.',
            'without a doubt.',
            'yes.',
            'yes - definetly.',
            'you may rely on it.',
        ]
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)]
        return message.reply(randomAnswer)
    }
}