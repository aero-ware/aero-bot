import AeroClient from "@aeroware/aeroclient";
import mongoose from "mongoose";

export default async function mongo(client: AeroClient, mongoPath: string) {
    try {
        await mongoose.connect(
            mongoPath,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                keepAlive: true,
            },
            (err) => {
                if (err) return client.logger.error(err.stack || err.message);
                client.logger.success("Connected to mongo");
            }
        );

        mongoose.connection.on("connect", () => {
            client.logger.success("Mongoose is connected");
        });

        mongoose.connection.on("error", (err) => {
            if (err) client.logger.error(err.stack || err.message);
        });

        mongoose.connection.on("disconnect", () => {
            client.logger.warn("Mongoose was disconnected");
        });

        mongoose.connection.on("reconnect", () => {
            client.logger.info("Mongoose has reconnected");
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
