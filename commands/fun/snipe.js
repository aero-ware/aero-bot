const { MessageEmbed } = require("discord.js");
const guildSchema = require("../../schemas/guild-schema");

module.exports = {
    commands: 'snipe',
    category: 'Fun',
    description: 'Shows the most recent deleted message for the given channel (or this channel)',
    expectedArgs: '[channel]',
    guildOnly: true,
    run: async ({ message }) => {
        let target = message.channel;
        if (message.mentions.channels.first()) target = message.mentions.channels.first()

        const { snipes } = await guildSchema.findOne({ _id: message.guild.id })
        if (!snipes) {
            return message.reply('there\'s nothing to snipe!')
        }

        let snipedMessage = snipes[target.id]
        if (!snipedMessage) {
            return message.reply('there\'s nothing to snipe!')
        }

        author = message.guild.members.cache.get(snipedMessage.author)


        const snipeEmbed = new MessageEmbed()
            .setTitle('Sniped Message')
            .setAuthor(author.user.tag, author.user.displayAvatarURL({ dynamic: true }))
            .setDescription(snipedMessage.content)
            .setTimestamp(new Date(snipedMessage.timestamp))
            .setFooter('haha get sniped')

        message.channel.send(snipeEmbed)
    }
}