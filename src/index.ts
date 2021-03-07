import AeroClient, { Arguments } from "@aeroware/aeroclient";
import { Intents } from "discord.js";
import { config as dotenv } from "dotenv";
import CONFIG from "../config.json";
import botbans, { IBotBanInfo } from "./models/Botban";
import app from "./server";

dotenv();

app();

const client = new AeroClient(
    {
        token: process.env.token,
        prefix:
            process.env.NODE_ENV === "production"
                ? CONFIG.DEFAULT_PREFIX
                : CONFIG.DEV_PREFIX,
        useDefaults: CONFIG.AEROCLIENT.USE_DEFAULTS,
        logging: CONFIG.AEROCLIENT.LOGGING,
        loggerHeader: CONFIG.AEROCLIENT.LOGGER_HEADER,
        commandsPath: CONFIG.AEROCLIENT.COMMANDS_PATH,
        eventsPath: CONFIG.AEROCLIENT.EVENTS_PATH,
        testServers: CONFIG.TEST_SERVERS,
        /*
          todo: make this work, until then responses works
          messagesPath: CONFIG.AEROCLIENT.MESSAGES_PATH,
        */
        connectionUri: process.env.mongoPath,
        persistentCooldowns: CONFIG.AEROCLIENT.PERSIST_COOLDOWNS,
        responses: {
            ...CONFIG.AEROCLIENT.RESPONSES,
        },
        staff: CONFIG.STAFF,
        disableStaffCooldowns: CONFIG.AEROCLIENT.DISABLE_STAFF_COOLDOWNS,
        dev:
            process.env.NODE_ENV !== "production"
                ? {
                      eval: {
                          console: true,
                          command: true,
                      },
                  }
                : undefined,
    },
    {
        ws: {
            intents: [Intents.NON_PRIVILEGED, "GUILD_MEMBERS"],
        },
        partials: ["MESSAGE", "REACTION"],
    }
);

client.use(async ({ message, args, command }, next, stop) => {
    // shows the current prefix if the bot is mentioned
    const pingRegex = new RegExp(`^<@!?${client.user?.id}>$`);

    if (pingRegex.test(message.content)) {
        client.commands.get("setprefix")?.callback({
            args,
            client,
            message,
            text: message.content,
            locale: "",
            parsed: [],
        });
        return stop();
    }

    // bot ban checking
    const userban = (await botbans.findOne({
        userId: message.author.id,
    })) as IBotBanInfo;
    if (userban && command?.category !== "Fun") return stop();

    return next();
});

Arguments.use(client);

export default client;
