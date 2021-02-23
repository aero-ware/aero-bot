import { Command } from "@aeroware/aeroclient/dist/types";

export default {
    name: "status",
    staffOnly: true,
    category: "utility",
    guarded: true,
    hidden: true,
    minArgs: 1,
    callback({ message, client, args }): any {
        let [type, ...activity]: any = args;
        activity = activity.join(" ");

        if (type.toLowerCase() !== "clear" && !(activity.length > 0))
            return message.channel.send("provide an activity value");

        switch (type.toLowerCase()) {
            case "playing":
                type = "PLAYING";
                break;

            case "streaming":
                type = "STREAMING";
                break;

            case "listening":
                type = "LISTENING";
                break;

            case "watching":
                type = "WATCHING";
                break;

            case "competing":
                type = "COMPETING";
                break;

            case "clear":
                return client.user!.setPresence({
                    activity: {
                        name: `${client.guilds.cache.size} Servers! >help`,
                        type: "WATCHING",
                    },
                });

            default:
                return message.channel.send("invalid prescence type.");
        }

        client.user!.setPresence({
            activity: {
                name: activity.join(" "),
                // @ts-ignore
                type,
            },
        });
    },
} as Command;
