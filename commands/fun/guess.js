const Discord = require('discord.js')
let serversmap = new Map();

module.exports = {
    commands: ['guess'],
    category: 'Fun',
    description: 'Guess the number to win the game !',
    minArgs: 0,
    maxArgs: 0,
    callback: async ({message, client}) => {
        if (serversmap.has(message.guild.id)) {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle('Error')
                .setDescription('I just allow 1 game per server')
                .setColor("#FF0000"));
        }
    
        
        let game_collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 1000 * 60 * 5 // timout after 5min
        });
    
        let bot_collector = new Discord.MessageCollector(message.channel, m => m.author.id === client.user.id, {
            time: 1000 * 60 * 5 // timeout after 5min
        });
    
        serversmap.set(message.guild.id, [game_collector, bot_collector]);
    
        let gameconfig = {
            maximum: 40,
            minimum: 1,
            tries: 5,
            trycount: 0,
            title: ''
        }
    
        let random_number = Math.floor(Math.random() * (gameconfig.maximum - gameconfig.minimum + 1)) + gameconfig.minimum;
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Guess the number')
            .setDescription(`The number is between **${gameconfig.minimum}** and **${gameconfig.maximum}.**
            You have ${gameconfig.tries} chances to guess it!
            
            Use ` + "``stop`` to stop the game.")
            .setThumbnail(message.author.displayAvatarURL())
            .setColor('#00ffe5'))
    
        game_collector.on('collect', u_msg => {
            if (isNaN(u_msg.content)) {
                return game_collector.stop('forced') 
                    
            }
            if (parseInt(u_msg.content) > gameconfig.maximum)
                return message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Number greater than the maximum')
                    .setDescription(`**${u_msg.content}** is greater than the maximum (**${gameconfig.maximum})**`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(`The number is between ${gameconfig.minimum} and ${gameconfig.maximum}.\nUse 'stop' to stop the game.`)
                    .setColor('RANDOM'))
    
            if (parseInt(u_msg.content) < gameconfig.minimum)
                return message.channel.send(new Discord.MessageEmbed()
                    .setTitle('Number less than the minimum')
                    .setDescription(`**${u_msg.content}** is less than the minium (**${gameconfig.minimum}**)`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setFooter(`The number is between ${gameconfig.minimum} and ${gameconfig.maximum}.\nUse 'stop' to stop the game.`)
                    .setColor('RANDOM'))
    
            if (u_msg.content === 'stop')
                return game_collector.stop('forced')
    
            if (parseInt(u_msg.content) === random_number) {
                if (gameconfig.trycount <= 1) gameconfig.title = 'Lucky';
                else if (gameconfig.trycount <= 2) gameconfig.title = 'Very Good';
                else if (gameconfig.trycount <= 3) gameconfig.title = 'Good';
                else if (gameconfig.trycount <= 4) gameconfig.title = 'Slow';
                else if (gameconfig.trycount <= 5) gameconfig.title = 'Very Slow';
    
                game_collector.stop('win');
            }
    
            if (gameconfig.tries === 1) return game_collector.stop('gameover');
    
            let dist = parseInt(u_msg.content) - random_number;
            if (dist < 0) dist *= -1;
    
            let tryplural = 'remaining attempt';
            if (gameconfig.tries > 2) tryplural = 'remaining attempts';
    
            if (dist <= 9) color = '#26ff00';
            else if (dist >= 10) color = '#aaff00';
            else if (dist >= 20) color = '#e1ff00';
            else if (dist >= 50) color = '#ffe500';
            else if (dist >= 100) color = '#ffaa00';
            else if (dist >= 200) color = '#ff5900';
            else if (dist >= 300) color = '#ff0000';
    
            if (parseInt(u_msg.content) < random_number) {
                gameconfig.trycount++;
                gameconfig.tries--;
                return message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`**${u_msg.content}** is **less** than the secret number, try again.`)
                    .setDescription(`${gameconfig.tries} ${tryplural}.`)
                    .setFooter(`The number is between ${gameconfig.minimum} and ${gameconfig.maximum}.\nUse 'stop' to stop the game.`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setColor(color))
            }
    
            if (parseInt(u_msg.content) > random_number) {
                gameconfig.trycount++;
                gameconfig.tries--;
                return message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`**${u_msg.content}** is **greater** than the secret number, try again.`)
                    .setDescription(`${gameconfig.tries} ${tryplural}.`)
                    .setFooter(`The number is between ${gameconfig.minimum} and ${gameconfig.maximum}.\nUse 'stop' to stop the game.`)
                    .setThumbnail(message.author.displayAvatarURL())
                    .setColor(color))
            }
        })
    
        game_collector.on('end', (msg, reason) => {
            serversmap.delete(message.guild.id);
            bot_collector.stop();
            switch (reason) {
                case 'gameover':
                    return message.channel.send(new Discord.MessageEmbed()
                        .setTitle('Game Over!')
                        .setDescription(`You lost all attempts.
                        The secret number was **${random_number}**.`)
                        .setColor('RANDOM'));
                case 'forced':
                    return message.channel.send(new Discord.MessageEmbed()
                        .setTitle('Game Over!')
                        .setDescription(`User finished game.
                        The secret number was **${random_number}**.`)
                        .setColor('RANDOM'));
                case 'win':
                    return message.channel.send(new Discord.MessageEmbed()
                        .setTitle('You Won!')
                        .setDescription('Congratualations, you found the secret number!')
                        .addField('Statistics',
                            `**Secret Number:** ${random_number}
                        **Tries:** ${gameconfig.trycount + 1}
                        **Remaining attempts:** ${gameconfig.tries - 1}
                        **Your Rank:** ${gameconfig.title}`)
                        .setColor('RANDOM'));
                default:
                    return message.channel.send(new Discord.MessageEmbed()
                        .setTitle('Game Over!')
                        .setDescription(`The 5 minutes are over.
                        The secret number was **${random_number}**.`)
                        .setColor('RANDOM'));
            }
        })
    
    }
    
    }