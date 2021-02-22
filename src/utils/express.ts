import express, { json } from "express";
import cors from "cors";
import client from "../index";
import guilds from "../models/Guild";

const corsOptions: cors.CorsOptions = {
    origin: ["https://aero-ware.github.io", "https://dheerajpv.github.io"],
    optionsSuccessStatus: 200,
};

export default function runExpress() {
    const app = express();

    app.use(cors(corsOptions));
    app.use(json());

    app.get("/commands", (_req, res) => {
        res.status(200).send(client.commands);
    });

    app.get(
        "/guilds",
        async (req, res): Promise<any> => {
            if (!req.body.id)
                return res
                    .status(400)
                    .send("Request missing an 'id' property in the body.");
            else if (!client.guilds.cache.get(req.body.id))
                return res.status(404).send("Guild not found");

            res.status(200).send({
                discord: client.guilds.cache.get(req.body.id),
                db: await guilds.findById(req.body.id),
            });
        }
    );

    app.listen(80, () => client.logger.success("Express online"));
}
