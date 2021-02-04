import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { Guild } from "discord.js";
import guilds from "../models/Guild";
import members from "../models/Member";

export default {
    name: "guildDelete",
    callback(guild: Guild) {
        guilds.findByIdAndDelete(guild.id);
        members.deleteMany({
            guildId: guild.id,
        });
    },
} as EventHandler;
