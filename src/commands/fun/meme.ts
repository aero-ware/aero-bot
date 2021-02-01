import { Command } from "@aeroware/aeroclient/dist/types";
import axios from "axios";
import { MessageEmbed } from "discord.js";

const SUBS = ["memes", "dankmemes"];

export default {
    name: "meme",
    description: "Sends a meme from reddit",
    details: "reddit gud, insta bad",
    category: "Fun",
    async callback({ message }) {
        try {
            let data;

            // api spammy but no nsfw is important also videos cant be in embeds
            do data = await fetchMeme();
            while (data.nsfw || data.isVideo);

            message.channel.send(
                new MessageEmbed()
                    .setTitle(data.title)
                    .setURL(data.link)
                    .setDescription(`From r/${data.subreddit}`)
                    .setImage(data.url)
                    .setFooter(
                        `${data.ratings.upvote - data.ratings.downvote} points`
                    )
                    .setTimestamp()
            );
        } catch (e) {
            message.channel.send("There was a problem with the API.");
        }
    },
} as Command;

async function fetchMeme() {
    return (
        await axios.get("https://api.snowflakedev.xyz/api/meme", {
            headers: {
                Authorization: process.env.snowflakeToken,
            },
            params: {
                sbr: SUBS[Math.floor(Math.random() * SUBS.length)],
            },
        })
    ).data;
}
