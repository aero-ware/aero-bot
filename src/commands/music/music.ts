import { Command } from "@aeroware/aeroclient/dist/types";

const queues = new Map();

/**
 * Copyright ⓒ cursorsdottsx 2021 dont steal my code pls
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

        switch (args[0]) {
            case "play": {
            }
        }

        return;
    },
} as Command;
