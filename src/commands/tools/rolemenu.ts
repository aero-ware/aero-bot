import { Command } from "@aeroware/aeroclient/dist/types";
import { Client, MessageEmbed } from "discord.js";
import guilds, { IGuildConfig } from "../../models/Guild";

export default {
    name: "rolemenu",
    aliases: ["reactionroles"],
    category: "Tools",
    description: "create, update, and remove reaction role menus.",
    details: "Run `rolemenu help` to see eveything you can do",
    minArgs: 1,
    maxArgs: 4,
    permissions: ["ADMINISTRATOR"],
    guildOnly: true,
    async callback({ message, args, client }): Promise<any> {
        const [arg, messageID, emoji, roleID] = args;
        const guildInfo = (await guilds.findById(
            message.guild!.id
        )) as IGuildConfig;
        switch (arg) {
            case "add":
                guildInfo.roleMenus.set(messageID, new Map<string, string>());
                await guildInfo.save();
                message.channel.send(
                    `New rolemenu created in message ${messageID}`
                );
                return;

            case "remove":
                guildInfo.roleMenus.delete(messageID);
                await guildInfo.save();
                message.channel.send(`Rolemenu in ${messageID} deleted`);
                return;

            case "update":
                // yes I know this isnt very *typescripty* but what I tried before didnt work.
                if (!guildInfo.roleMenus || !guildInfo.roleMenus.has(messageID))
                    return message.reply(
                        `message ${messageID} does not have a rolemenu attached to it. Use \`rolemenu add <message ID>\` to create one.`
                    );
                const emote = getEmote(emoji, client);
                if (!emote)
                    return message.reply(
                        "you did not give me an emote to add."
                    );
                let e = emote.emoteName || emote.emoteID;

                if (roleID === "none") {
                    // removing a reactionrole if 'none' is provided
                    delete (guildInfo.roleMenus.get(messageID)! as any)[e!];
                    await guilds.findOneAndUpdate(
                        { _id: message.guild!.id },
                        { roleMenus: guildInfo.roleMenus }
                    );
                    return message.reply(
                        `emoji ${emoji}'s role in rolemenu of message ${messageID} has been removed.`
                    );
                } else if (!message.guild!.roles.cache.get(roleID)) {
                    return message.reply("invalid role ID.");
                }

                (guildInfo.roleMenus.get(messageID)! as any)[e!] = roleID;
                const roleMenuMessage = await message.channel.messages.fetch(
                    messageID
                );
                roleMenuMessage.react(e!);
                await guilds.findOneAndUpdate(
                    { _id: message.guild!.id },
                    { roleMenus: guildInfo.roleMenus }
                );
                return message.reply(
                    `role ${roleID} added to message ${messageID} in emoji ${
                        emote.emoteID
                            ? `<:${
                                  message.guild!.emojis.cache.get(
                                      emote.emoteID
                                  )!.name
                              }:${emote.emoteID}>`
                            : emote.emoteName
                    }`
                );

            case "help":
                message.channel.send(
                    new MessageEmbed()
                        .setTitle("Usage for the rolemenu command")
                        .setDescription(
                            "This embed describes how to create, update, or remove role menus."
                        )
                        .addFields(
                            {
                                name: "Creating a rolemenu",
                                value:
                                    "**1.** Send a message to have the rolemenu attached to.\n" +
                                    `**2.** Run \`rolemenu add <message ID>\` to initialize the rolemenu for that message **in the same channel as the message**`,
                            },
                            {
                                name: "Adding roles to a rolemenu",
                                value:
                                    `Run \`rolemenu update <message ID> <emoji> <role ID>\` **in the same channel as the message**.\n` +
                                    "*The emoji will be automatically added as a reaction to the message.*",
                            },
                            {
                                name: "Removing a role from a rolemenu",
                                value:
                                    `Run \`rolemenu update <message ID> <emoji> none\` **in the same channel as the message**.\n` +
                                    "*The emoji will be deregistered for adding roles.*",
                            },
                            {
                                name: "Deleting a rolemenu",
                                value: `Run \`rolemenu remove <message ID>\` **in the same channel as the message**`,
                            }
                        )
                        .setColor("RANDOM")
                );
                return;
        }
    },
} as Command;

//! can i steal pls
// canta magic
function getEmote(str: string, client: Client) {
    let emoteName, emoteID, e, n;

    // If the emote is an animated emote:
    if (str.startsWith("<a:")) {
        e = str.slice(3);
        n = e.search(":");
        emoteName = e.slice(0, n);
        emoteID = e.slice(n + 1, -1);
        // If the emote is a non-animated custom emote
    } else if (str.startsWith("<:")) {
        e = str.slice(2);
        n = e.search(":");
        emoteName = e.slice(0, n);
        emoteID = e.slice(n + 1, -1);
        // If its neither, then it has to be a normal discord emote
    } else {
        // Check if it a default emote
        if (!containsOnlyEmojis(str)) return;
        emoteName = str;
    }

    // emoteID = undefined => then its a default emote
    if (emoteID) {
        e = client.emojis.cache.get(emoteID);
        if (!e) return;
        else return { emoteID: emoteID };
    } else if (emoteName) {
        return { emoteName: emoteName };
    } else return;
}

function containsOnlyEmojis(text: string): boolean {
    const onlyEmojis = text.replace(new RegExp("[\u0000-\u1eeff]", "g"), "");
    const visibleChars = text.replace(new RegExp("[\n\rs]+|( )+", "g"), "");
    return onlyEmojis.length === visibleChars.length;
}
