import AeroClient from "@aeroware/aeroclient";
import { config as dotenv } from "dotenv";
import { Intents, TextChannel } from "discord.js";
import botbans, { IBotBanInfo } from "./models/Botban";

dotenv();

const client = new AeroClient(
    {
        token: process.env.token,
        prefix: process.env.defaultPrefix,
        useDefaults: true,
        logging: true,
        loggerHeader: "aerobot",
        commandsPath: "commands",
        eventsPath: "events",
        connectionUri: process.env.mongoPath,
        persistentCooldowns: true,
        responses: {
            cooldown: "Please wait $TIME before running the command again.",
            error: "An error occurred.",
            usage: "The usage for `$COMMAND` is `$COMMAND $USAGE`",
            guild: "This command can only be used in a server.",
            dm: "This command can only be used in a DM.",
            staff: "This command can only be run by staff",
            guarded: "This command cannot be disabled.",
            disabled: "This command is disabled in this server.",
            perms: "You need to have $PERMS permissions to run this command.",
        },
        staff: process.env.adminIds!.split(/,\s*/g),
        disableStaffCooldowns: true,
    },
    {
        ws: {
            intents: [Intents.NON_PRIVILEGED, "GUILD_MEMBERS"],
        },
        partials: ["MESSAGE", "REACTION"],
    }
);

client.use(async ({ message, args, command }, next) => {
    // shows the current prefix if the bot is mentioned
    const pingRegex = new RegExp(`^<@!?${client.user?.id}>$`);

    if (pingRegex.test(message.content)) {
        client.commands.get("setprefix")?.callback({
            args,
            client,
            message,
            text: message.content,
            locale: "",
        });
        return next(true);
    }

    // bot ban checking
    const userban = (await botbans.findOne({
        userId: message.author.id,
    })) as IBotBanInfo;
    if (userban && command?.category !== "Fun") return next(true);

    return next();
});

export default client; // should only be used for generating webpage
