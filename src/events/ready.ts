import AeroClient from "@aeroware/aeroclient";
import { EventHandler } from "@aeroware/aeroclient/dist/types";
import AutoPoster from "topgg-autoposter";
import mongo from "../utils/mongo";
import periodic from "../utils/periodic";

export default {
    name: "ready",
    async callback(this: AeroClient) {         
        if (process.env.clientID! === this.user!.id) {
            const ap = AutoPoster(process.env.topGGToken!, this);

            ap.on("posted", () => {
                this.logger.info("Posted Info to Top.gg.");
            })
        }
        
        await mongo(this, process.env.mongoPath!);

        await periodic(this);
    }
} as EventHandler;