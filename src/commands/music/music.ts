import { utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import { Queue } from "@aeroware/structures";
import {
    Message,
    StreamDispatcher,
    TextChannel,
    VoiceConnection,
} from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";

const queues = new Map<
    string,
    {
        connection: VoiceConnection;
        queue: Queue<{
            title: string;
            url: string;
        }>;
        channel: TextChannel;
    }
>();

/**
 * Copyright ⓒ cursorsdottsx 2021 dont steal my code pls
 */
export default {
    name: "music",
    guildOnly: true,
    async callback({ message, args }) {
        if (!message.member?.voice.channel) {
            message.channel.send(`You need to be in a voice channel!`);
            return "invalid";
        }

        if (!message.member.voice.channel.joinable) {
            message.channel.send(`I can't join that voice channel!`);
            return "invalid";
        }

        const permissions = message.member.voice.channel.permissionsFor(
            message.client.user!
        );

        if (!permissions || !permissions.has("SPEAK")) {
            return message.channel.send(
                "I need permissions to speak in your voice channel!"
            );
        }

        try {
            const connection = await message.member.voice.channel.join();

            message.guild?.me?.voice.setSelfDeaf(true);

            message.channel.send(`I have joined your voice channel!`);

            const server = queues.get(message.guild!.id) || {
                connection,
                queue: new Queue(),
                channel: message.channel as TextChannel,
            };

            if (!args.length) return "invalid";

            switch (args.shift()!) {
                case "play": {
                    const { videos } = await yts(args.join(" "));

                    if (!videos.length) {
                        message.channel.send(
                            `I couldn't find anything to play!`
                        );
                        return "invalid";
                    }

                    let video: typeof videos[0];

                    if (videos.length > 1) {
                        await message.channel
                            .send(`There are multiple results. Select a track by using its index:
${videos
    .slice(0, 5)
    .map((v, i) => `[${i + 1}] **${v.title}**`)
    .join("\n")}`);

                        const index = parseInt(
                            (
                                await utils.getReply(message, {
                                    regex: /^[1-5]$/,
                                    time: 10000,
                                })
                            )?.content!
                        );

                        if (!index) {
                            message.channel.send(`No track was selected.`);
                            return "invalid";
                        }

                        video = videos[index - 1];
                    } else video = videos[0];

                    server.queue.enqueue({
                        title: video.title,
                        url: video.url,
                    });

                    return play(server);
                }

                case "skip": {
                    if (server.queue.isEmpty) {
                        message.channel.send(`There are no tracks to skip!`);
                        return "invalid";
                    }

                    const track = server.queue.dequeue()!;

                    message.channel.send(`Track **${track.title}** skipped!`);

                    return play(server);
                }

                case "stop": {
                    while (!server.queue.isEmpty) server.queue.dequeue();

                    return message.channel.send(`I have stopped the music!`);
                }

                default: {
                    message.channel.send(`Unrecognized sucommand.`);
                    return "invalid";
                }
            }
        } catch {
            message.channel.send(`I couldn't join the voice channel!`);
            return "invalid";
        }
    },
} as Command;

async function play({
    queue,
    channel,
    connection,
}: Exclude<ReturnType<typeof queues["get"]>, undefined>): Promise<
    Message | StreamDispatcher | void
> {
    const track = queue.dequeue();

    if (!track)
        return channel.send(`There are no more tracks left in the queue!`);

    const readable = ytdl(track.url);

    channel.send(`Now playing: **${track.title}**`);

    const stream = connection.play(readable);

    return stream
        .on("finish", () =>
            play({
                queue,
                channel,
                connection,
            })
        )
        .on("error", (err) => {
            console.error(err);
            channel.send(`There was trouble playing your track.`);
        });
}
