import cors from "cors";
import express, { json } from "express";
import client from "../index";

export default function app() {
    const app = express();

    app.use(cors());
    app.use(json());

    app.get("/commands", (_req, res) => {
        res.status(200).send(client.commands);
    });

    app.listen(3000, () => client.logger.success("Express online"));
}
