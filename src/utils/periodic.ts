import { Client } from "discord.js";
import AutoPoster from "topgg-autoposter";
import { checkMutes, checkBans } from "./mute-bans";

export default function periodic(client: Client) {
    muteBans(client);
    setInterval(muteBans, 5000, client);
    statusUpdate(client);
    setInterval(statusUpdate, 1800000, client);
}

function muteBans(client: Client) {
    checkMutes(client);
    checkBans(client);
}

function statusUpdate(client: Client) {
    if (
        client.user!.presence.activities.length === 0 ||
        /\d+ \w+/g.test(client.user!.presence.activities[0].name)
    )
        client.user!.setPresence({
            activity: {
                type: "WATCHING",
                name: `${client.guilds.cache.size} Servers | >help`,
            },
        });
}
