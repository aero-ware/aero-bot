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
        app.listen(80, () =>
            client.logger.success("HTTP server online on port 80")
        );
    else if (process.env.NODE_ENV === "production") {
        const server = https
            .createServer(
                {
                    key: fs.readFileSync(process.env.SSL_KEY_PATH!),
                    cert: fs.readFileSync(process.env.SSL_CERT_PATH!),
                },
                app
            )
            .listen(443);

        server.on("listening", () => {
            client.logger.success(
                // @ts-ignore
                `HTTPS server online on port ${server.address().port}`
            );
        });
    }
}
