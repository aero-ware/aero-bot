import { EventHandler } from "@aeroware/aeroclient/dist/types";
import {
    DMChannel,
    Guild,
    Message,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import guilds, { IGuildConfig } from "../models/Guild";
import { handler as levelHandler } from "../utils/leveling";

export default {
    name: "message",
    async callback(message: Message) {
        const guildInfo = message.guild
            ? ((await guilds.findById(message.guild?.id)) as IGuildConfig)
            : null;

        if (message.guild) messageLinkEmbed(message);

        if (guildInfo) {
            blacklistChecker(message, guildInfo);
            antiAd(message, guildInfo);
            suggestions(message, guildInfo);
            levelHandler(message, guildInfo);
        }
    },
} as EventHandler;

async function isInvite(guild: Guild, code: string): Promise<boolean> {
    return await new Promise(async (resolve) => {
        await guild.fetchInvites().then((invites) => {
            for (const invite of invites) {
                if (code === invite[0]) return resolve(true);
            }
            return resolve(false);
        });
    });
}

async function antiAd(message: Message, info: IGuildConfig) {
    if (!message.guild) return;
    const { member, content, channel, guild, webhookID } = message;
    if (!member) return;
    if (webhookID) return;
    if (member.hasPermission("ADMINISTRATOR")) return;
    const { adChannels } = info;
    if (adChannels.includes(channel.id)) return;
    const code = content.split("discord.gg/")[1]
        ? content.split("discord.gg/")[1].split(" ")[0]
        : null;
    if (!code) return;
    if (!isInvite(guild, code)) {
        message.delete().catch();
        message.channel.send("No external invites.");
    }
}

async function suggestions(message: Message, info: IGuildConfig) {
    const { suggestionChannels } = info;
    if (message.author.bot) return;
    if (!message.guild || message.member?.hasPermission("ADMINISTRATOR"))
        return;
    if (suggestionChannels.includes(message.channel.id)) {
        if (message.deletable) message.delete().catch();
        const suggestion = await message.channel.send(
            new MessageEmbed()
                .setDescription(
                    `${message.content}\n
                    📊 Vote on this suggestion so that it can be implemented!`
                )
                .setColor("YELLOW")
                .setTimestamp()
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                )
        );

        ["👍", "👎"].forEach(async (e) => {
            await suggestion.react(e);
        });
    }
}

async function blacklistChecker(message: Message, info: IGuildConfig) {
    if (
        !message.guild ||
        message.webhookID ||
        message.author.bot ||
        message.member?.hasPermission("ADMINISTRATOR")
    )
        return;

    const { blacklistedWords } = info;
    let offending = false;
    for (const word of blacklistedWords) {
        if (message.content.toLowerCase().includes(word.toLowerCase()))
            offending = true;
    }
    if (offending) {
        if (message.deletable) message.delete().catch();
        message.channel.send("That word is not allowed here!").catch();
    }
}

async function messageLinkEmbed(message: Message) {
    if (!message.guild) return;
    const arr = message.content.match(
        /https:\/\/discord.com\/channels(\/\d{18}){3}/im
    );
    if (!arr) return;
    const link = arr[0] || "";

    const [guildId, channelId, messageId] = link.split("/").slice(4);
    if (message.guild?.id === guildId) {
        const channel = message.guild!.channels.cache.get(channelId);
        if (!channel || !(channel instanceof TextChannel)) return;
        const linkedMessage = await channel.messages.fetch(messageId).catch();
        if (linkedMessage.channel instanceof DMChannel) return;

        const webhook = await (message.channel as TextChannel).createWebhook(
            message.member?.nickname || message.author.username,
            {
                avatar: message.author.displayAvatarURL({
                    dynamic: true,
                    format: "png",
                }),
                reason: "Message Link embed",
            }
        );

        if (message.deletable) message.delete().catch();

        let embed = new MessageEmbed()
            .setDescription(linkedMessage.content)
            .setAuthor(
                linkedMessage.member?.nickname || linkedMessage.author.username,
                linkedMessage.author.displayAvatarURL({ dynamic: true })
            )
            .addField(
                "Jump",
                `[Go to message](${linkedMessage.url} "Go to message")`
            )
            .setColor("RANDOM")
            .setFooter(`#${linkedMessage.channel.name}`)
            .setTimestamp(linkedMessage.createdTimestamp);

        const imageRegex = /^https:\/\/cdn\.discordapp\.com\/attachments\/(\d{18}\/){2}\w+\.((png)|(jpe?g)|(webp)|(gif)|(tiff?)|(bmp)|(heif)|(svg))$/gi;

        if (linkedMessage.attachments.size > 0) {
            if (imageRegex.test(linkedMessage.attachments.first()!.url))
                embed = embed.setImage(linkedMessage.attachments.first()!.url);
        }

        await webhook.send(
            message.content
                .replace(/https:\/\/discord.com\/channels(\/\d{18}){3}/im, "")
                .replace(/ +/, " "),
            [embed, ...message.attachments.array()]
        );

        await webhook.delete("Sent a message and now i go bye bye");
    }
}
