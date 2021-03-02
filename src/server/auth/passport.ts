import Crypto from "crypto-js";
import passport from "passport";
import { Strategy } from "passport-discord";
import refresh from "passport-oauth2-refresh";
import dashboardUsers from "../../models/DashboardUser";
import CONFIG from "../../../config.json";

passport.deserializeUser<string>(async (id, done) => {
    try {
        const user = await dashboardUsers.findById(id);

        if (user) done(undefined, user);
    } catch (error) {
        console.error(error);
        done(error, undefined);
    }
});

passport.serializeUser<string>(async (user, done) => {
    //@ts-ignore
    done(undefined, user._id);
});

const strategy = new Strategy(
    {
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        callbackURL:
            process.env.NODE_ENV !== "production"
                ? process.env.DEV_CALLBACK
                : process.env.PROD_CALLBACK,
        scope: ["identify", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);

        try {
            let user = await dashboardUsers.findById(profile.id);

            const { username } = profile;
            const avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
            const guilds = (profile.guilds || []).map((g) => ({
                ...g,
                icon: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`,
            }));

            const encryptedAccessToken = Crypto.AES.encrypt(
                accessToken,
                process.env.cryptoAccess!
            ).toString();

            const encryptedRefreshToken = Crypto.AES.encrypt(
                refreshToken,
                process.env.cryptoRefresh!
            ).toString();

            if (user) {
                user.username = username;
                user.avatar = avatar;
                user.guilds = guilds;
                user.accessToken = encryptedAccessToken;
                user.refreshToken = encryptedRefreshToken;
            } else
                user = await dashboardUsers.create({
                    _id: profile.id,
                    username: username,
                    avatar: avatar,
                    guilds: guilds,
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                });

            done(undefined, user);
        } catch (error) {
            console.error(error);
            done(error, undefined);
        }
    }
);

passport.use(strategy);
refresh.use(strategy);
