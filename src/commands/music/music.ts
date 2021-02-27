import { Command } from "@aeroware/aeroclient/dist/types";
import { Guild, Message } from "discord.js";
import ytdl from "ytdl-core";

const queue = new Map();

/**
 * Copyright ⓒ cursorsdottsx 2021 doesnt even work lmfao
 */
export default {
    name: "music",
    guildOnly: true,
    async callback({ message, args }) {
        if (!message.member?.voice.channel) {
            message.channel.send(`You are not in a voice channel!`);
            return "invalid";
        }

        if (!args.length) {
            if (!message.member.voice.channel.joinable) {
                message.channel.send(`I can't join that voice channel!`);
                return "invalid";
            }

            const permissions = message.member.voice.channel.permissionsFor(
                message.client.user!
            );

            if (!permissions || !permissions.has("SPEAK")) {
                return message.channel.send(
                    "I need permissions speak in your voice channel!"
                );
            }

            try {
                const connection = await message.member.voice.channel.join();

                return message.channel.send(`I have joined!`);
            } catch {
                message.channel.send(`I couldn't join the voice channel!`);
                return "invalid";
            }
        }

        const serverQueue = queue.get(message.guild!.id);

        switch (args[0]) {
            case "play": {
                execute(message, serverQueue, args);
            }
        }

        return;
    },
} as Command;

async function execute(message: Message, serverQueue: any, args: string[]) {
    const voiceChannel = message.member!.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user!);
    if (!permissions || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [] as any[],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild!.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            //@ts-ignore
            queueContruct.connection = connection;
            play(message.guild!, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild!.id);
            return message.channel.send(err || "uh oh an error happened D:");
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(
            `${song.title} has been added to the queue!`
        );
    }

    return;
}

function skip(message: Message, serverQueue: any) {
    if (!message.member?.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );

    if (!serverQueue)
        return message.channel.send("There are no tracks in the queue!");

    return serverQueue.connection.dispatcher.end();
}

function stop(message: Message, serverQueue: any) {
    if (!message.member?.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );

    if (!serverQueue)
        return message.channel.send("There are no tracks in the queue!");

    serverQueue.songs = [];

    return serverQueue.connection.dispatcher.end();
}

function play(guild: Guild, song: any) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", (error: any) => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
