import express, { json } from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import client from "../index";

export default function runExpress() {
    const app = express();

    app.use(cors());
    app.use(json());

    app.get("/commands", (_req, res) => {
        res.status(200).send(client.commands);
    });

    if (process.env.NODE_ENV === "dev")
        app.listen(80, () => client.logger.success("Express online"));
    else if (process.env.NODE_ENV === "production") {
        const server = https
            .createServer(
                {
                    key: fs.readFileSync(
                        "/etc/letsencrypt/live/aero-host.eastus.cloudapp.azure.com/privkey.pem"
                    ),
                    cert: fs.readFileSync(
                        "/etc/letsencrypt/live/aero-host.eastus.cloudapp.azure.com/fullchain.pem"
                    ),
                },
                app
            )
            .listen(443);
        // @ts-ignore
        server.on("listening", () => client.logger.success(`Listening on port ${server.address().port}!`));
    }
}
