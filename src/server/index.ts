import argon2 from "argon2";
import MongoStore from "connect-mongo";
import cors from "cors";
import Crypto from "crypto-js";
import express, { json, urlencoded } from "express";
import fs from "fs";
import https from "https";
import session from "express-session";
import passport from "passport";
import { Webhook } from "@top-gg/sdk";
import client from "../index";
import CONFIG from "../../config.json";
import dashboardUsers from "../models/DashboardUser";
import { MessageEmbed, TextChannel } from "discord.js";

export default async function app() {
    const dev = process.env.NODE_ENV !== "production";

    await import("./auth/passport");

    const app = express();

    const topGGWebhook = new Webhook(process.env.TOPGG_WEBHOOK_AUTH);

    app.use(cors());
    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.use(
        session({
            name: "reserved",
            secret: "some random secret",
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                sameSite: "lax",
                secure: !dev,
            },
            store: MongoStore.create({
                mongoUrl: process.env.mongoPath,
            }),
            saveUninitialized: false,
            resave: false,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/", (req, res) => {
        res.send(!!req.user);
    });

    app.get("/commands", (req, res) => {
        res.status(200).send(client.commands);
    });

    app.get("/auth", passport.authenticate("discord"));

    app.get("/auth/redirect", async (req, res, next) => {
        passport.authenticate("discord", async (err, user, info) => {
            if (err) return next(err);

            if (!user) return res.redirect("/auth");

            req.logIn(user, async (err) => {
                if (err) return next(err);

                return res.redirect(
                    `http://aero-ware.github.io/aero-bot/?id=${
                        user._id
                    }&access=${encodeURIComponent(
                        await argon2.hash(
                            Crypto.AES.decrypt(
                                user.accessToken,
                                process.env.CRYPTO_ACCESS!
                            ).toString(Crypto.enc.Utf8)
                        )
                    )}&refresh=${encodeURIComponent(
                        await argon2.hash(
                            Crypto.AES.decrypt(
                                user.refreshToken,
                                process.env.CRYPTO_REFRESH!
                            ).toString(Crypto.enc.Utf8)
                        )
                    )}`
                );
            });
        })(req, res, next);
    });

    app.get("/auth/logout", (req, res) => {
        if (req.user) req.logOut();

        return res.redirect(
            `http://aero-ware.github.io/aero-bot/?id=undefined&access=undefined&refresh=undefined`
        );
    });

    app.post("/verify/", async (req, res) => {
        const { accessToken, refreshToken, id } = req.body;

        if (!accessToken || !refreshToken || !id) return res.sendStatus(400);

        const user = await dashboardUsers.findById(id);

        if (!user) return res.sendStatus(403);

        if (
            !(await argon2.verify(
                accessToken,
                Crypto.AES.decrypt(
                    user.accessToken,
                    process.env.CRYPTO_ACCESS!
                ).toString(Crypto.enc.Utf8)
            )) ||
            !(await argon2.verify(
                refreshToken,
                Crypto.AES.decrypt(
                    user.refreshToken,
                    process.env.CRYPTO_REFRESH!
                ).toString(Crypto.enc.Utf8)
            ))
        )
            return res.sendStatus(403);

        return res.status(200).json({
            avatar: user.avatar,
            username: user.username,
            guilds: user.guilds,
        });
    });

    app.post(
        "/topgg",
        topGGWebhook.middleware(),
        async (req, res): Promise<any> => {
            if (req.get("authorization") !== process.env.TOPGG_WEBHOOK_AUTH)
                return res.sendStatus(403);

            try {
                const voteChannel = await client.channels.fetch(
                    CONFIG.VOTE_LOG_CHANNEL
                );
                if (!(voteChannel instanceof TextChannel)) {
                    client.logger.error(
                        `Vote log channel ${voteChannel.id} is not a text channel.`
                    );
                    return;
                }

                if (!req.vote) return;

                if (req.vote.type === "upvote") {
                    const user = await client.users.fetch(req.vote.user);

                    voteChannel.send(
                        new MessageEmbed()
                            .setTitle("User Voted")
                            .setThumbnail(
                                user.displayAvatarURL({
                                    dynamic: true,
                                    format: "png",
                                })
                            )
                            .addField("User", user.tag, true)
                            .addField(
                                "Weekend Bonus",
                                req.vote.isWeekend ? "Yes" : "No",
                                false
                            )
                            .addField("Rewards", "TBA", false)
                    );
                } else if (req.vote.type === "test")
                    client.logger.success("Top.GG Webhook Test Success!");
            } catch (e) {
                client.logger.error(
                    `${CONFIG.VOTE_LOG_CHANNEL} is not a valid channel.`
                );
            } finally {
                res.sendStatus(200);
            }
        }
    );

    if (dev) {
        app.listen(80, () =>
            client.logger.success("HTTP Server online on port 80")
        );
    } else {
        const server = https
            .createServer(
                {
                    cert: fs.readFileSync(process.env.SSL_CERT_PATH!),
                    key: fs.readFileSync(process.env.SSL_KEY_PATH!),
                },
                app
            )
            .listen(443);

        server.on("listening", () =>
            client.logger.success(
                // @ts-ignore
                `HTTPS Server online on port ${server.address().port}`
            )
        );
    }
}
