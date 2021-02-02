import AeroClient from "@aeroware/aeroclient";
import { checkMutes, checkBans, checkBotBans } from "./mute-bans";

export default function periodic(client: AeroClient) {
    muteBans(client);
    setInterval(muteBans, 5000, client);
    statusUpdate(client);
    setInterval(statusUpdate, 1800000, client);
}

function muteBans(client: AeroClient) {
    checkMutes(client);
    checkBans(client);
    checkBotBans();
}

function statusUpdate(client: AeroClient) {
    if (
        client.user!.presence.activities.length === 0 ||
        /\d+ \w+/g.test(client.user!.presence.activities[0].name)
    )
        client.user!.setPresence({
            activity: {
                type: "WATCHING",
                name: `${client.guilds.cache.size} Servers | ${client.clientOptions.prefix}help`,
            },
        });
}
