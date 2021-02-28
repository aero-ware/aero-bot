import argon2 from "argon2";
import MongoStore from "connect-mongo";
import cors from "cors";
import Crypto from "crypto-js";
import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import client from "../index";
import dashboardUsers from "../models/DashboardUser";

export default async function app() {
    const dev = process.env.NODE_ENV !== "production";

    await import("./auth/passport");

    const app = express();

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
                                process.env.cryptoAccess!
                            ).toString(Crypto.enc.Utf8)
                        )
                    )}&refesh=${encodeURIComponent(
                        await argon2.hash(
                            Crypto.AES.decrypt(
                                user.refreshToken,
                                process.env.cryptoRefresh!
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
            `http://aero-ware.github.io/aero-bot/?access=undefined&refesh=undefined`
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
                    process.env.cryptoAccess!
                ).toString(Crypto.enc.Utf8)
            )) ||
            !(await argon2.verify(
                refreshToken,
                Crypto.AES.decrypt(
                    user.refreshToken,
                    process.env.cryptoRefresh!
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

    app.listen(80, () => client.logger.success("Express online"));
}
