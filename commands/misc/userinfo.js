const { MessageEmbed } = require ('discord.js')

module.exports = {
    description: 'Display info about a user',
    category: 'Misc',
    minArgs: 0,
    maxArgs: 0,   
    callback: async({message, arguments: args, text}) =>{
        
        let target = message.mentions.members.first() || message.author;

        let status;
        switch (target.presence.status) {
            case "online":
                status = "<:online:729181184193462285> online";
                break;
            case "dnd":
                status = "<:dnd:729181212530442311> dnd";
                break;
            case "idle":
                status = "<:idle:729181121933475931> idle";
                break;
            case "offline":
                status = "<:offline:729181162182017051> offline";
                break;
        }

        const embed = new MessageEmbed()
            .setTitle(`${target.username} stats`)
            .setColor(`#f3f3f3`)
            .setThumbnail(target.displayAvatarURL({dynamic : true}))
            .addFields(
                {
                    name: "Name: ",
                    value: target.username,
                    inline: true
                },
                {
                    name: "#️⃣ Discriminator: ",
                    value: `#${target.discriminator}`,
                    inline: true
                },
                {
                    name: "🆔 ID: ",
                    value: target.id,
                },
                {
                    name: "Current Status: ",
                    value: status,
                    inline: true
                },
                {
                    name: "Activity: ",
                    value: target.presence.activities[0] ? target.presence.activities[0].name : `User isn't playing a game!`,
                    inline: true
                },
                {
                    name: 'Avatar link: ',
                    value: `[Click Here](${target.displayAvatarURL()})`
                },
                {
                    name: 'Creation Date: ',
                    value: target.createdAt.toLocaleDateString("en-us"),
                    inline: true
                },

            )

        await message.channel.send(embed)
    }
}