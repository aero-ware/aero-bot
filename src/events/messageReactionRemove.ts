import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { MessageReaction, User } from "discord.js";
import handleRoleMenu from "../utils/rolemenu";

export default {
    name: "messageReactionRemove",
    async callback(reaction: MessageReaction, user: User) {
        await handleRoleMenu(reaction, user, false);
    }
} as EventHandler;