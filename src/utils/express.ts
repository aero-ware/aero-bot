import express, { json } from "express";
import cors from "cors";
import client from "../index";

export default function runExpress() {
    const app = express();

    app.use(cors());
    app.use(json());

    app.get("/commands", (_req, res) => {
        res.status(200).send(client.commands);
    });

    app.listen(80, () => client.logger.success("Express online"));
}
