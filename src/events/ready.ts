import AeroClient from "@aeroware/aeroclient";
import { EventHandler } from "@aeroware/aeroclient/dist/types";
import { TextChannel } from "discord.js";
import AutoPoster from "topgg-autoposter";
import mongo from "../utils/mongo";
import periodic from "../utils/periodic";

export default {
    name: "ready",
    once: true,
    async callback(this: AeroClient) {
        if (process.env.clientID! === this.user!.id) {
            const ap = AutoPoster(process.env.topGGToken!, this);

            ap.on("posted", () => {
                this.logger.info("Posted Info to Top.gg.");
            });
        }

        process.on("unhandledRejection", (err: any) => {
            if (err) this.logger.error(err.stack || err.message);
            if (!process.env.errorLog) return;
            const channel = this.channels.cache.get(process.env.errorLog);
            if (channel instanceof TextChannel)
                channel.send(err.stack || err.message, { code: true });
            else throw new TypeError("errorLog in .env is not a TextChannel");
        });

        await mongo(this, process.env.mongoPath!);

        periodic(this);
    },
} as EventHandler;
