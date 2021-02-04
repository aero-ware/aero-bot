import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { MessageReaction, User } from "discord.js";
import handleRoleMenu from "../utils/rolemenu";

export default {
    name: "messageReactionAdd",
    async callback(reaction: MessageReaction, user: User) {
        console.log("meesageReactionAdd");
        await handleRoleMenu(reaction, user, true);
    },
} as EventHandler;
