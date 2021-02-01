import { Command } from "@aeroware/aeroclient/dist/types";
import guilds, { IGuildConfig } from "../../models/Guild";
import { setLevelData, getLevelData } from "../../utils/leveling";

export default {
    name: "setlevel",
    category: "Leveling",
    description: "sets the level of a user",
    minArgs: 2,
    usage: "<user/id> <level>",
    guildOnly: true,
    permissions: ["ADMINISTRATOR"],
    async callback({ message, args }) {
        const { levelsEnabled } = await guilds.findById(message.guild!.id) as IGuildConfig;
        if (!levelsEnabled) {
            message.channel.send("Leveling is disabled here.");
            return;
        }
        const target = message.mentions.users.first() || message.client.users.cache.get(args[0]);
        if (!target) {
            message.channel.send("Cannot find the target user.");
            return;
        }

        let levelToSet: number;
        try {
            levelToSet = parseInt(args[1]);
        } catch (e) {
            message.channel.send("Provide a valid level to set.");
            return;
        }

        await setLevelData(
            message.guild!.id,
            target.id, levelToSet,
            (await getLevelData(message.guild!.id, target.id)).xp
        );

        message.channel.send(`Set ${target}'s level to ${levelToSet}`);
    }
} as Command;