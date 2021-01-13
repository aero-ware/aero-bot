import AeroClient from "@aeroware/aeroclient";
import * as TopGG from "@top-gg/sdk";
import { config as dotenv } from "dotenv";
import AutoPoster from "topgg-autoposter";
import updateMutes from "./util/mute-checker";
import updatetempBans from "./util/tempban-checker";

dotenv();

const client = new AeroClient(
    {
        token: process.env.token,
        prefix: process.env.defaultPrefix,
        connectionUri: process.env.mongoPath,
        staff: process.env.adminIds!.split(","),
        commandsPath: "commands",
        logging: true,
        persistentCooldowns: true,
        useDefaults: true,
        readyCallback: () => {
            console.log("Ready!");

            setInterval(() => {
                updateMutes(client);
                updatetempBans(client);
            }, 5000);
        },
    },
    {
        partials: ["MESSAGE", "REACTION"],
        ws: {
            intents: ["GUILD_MEMBERS"],
        },
    }
);

(async () => {
    await client.login(process.env.token);

    if (process.env.clientID === client.user?.id) {
        const ap = AutoPoster(process.env.topGGToken!, client);

        ap.on("posted", () => {
            console.log("posted stats to top.gg");
        });
    }
})();

export const TopAPI = new TopGG.Api(process.env.topGGToken!);
