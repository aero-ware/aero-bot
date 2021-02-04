import { Command } from "@aeroware/aeroclient/dist/types";
import axios from "axios";
import { MessageEmbed } from "discord.js";

export default {
    name: "meme",
    description: "Sends a meme from reddit",
    details: "reddit gud, insta bad",
    category: "Fun",
    async callback({ message }) {
        try {
            let data;

            // api spammy but no nsfw is important
            do data = await fetchMeme();
            while (data.nsfw);

            message.channel.send(
                new MessageEmbed()
                    .setTitle(data.title)
                    .setURL(data.postLink)
                    .setDescription(`From r/${data.subreddit}`)
                    .setImage(data.url)
                    .setFooter(`${data.ups} upvotes - by u/${data.author}`)
            );
        } catch (e) {
            message.channel.send("There was a problem with the API.");
        }
    },
} as Command;

async function fetchMeme() {
    return (await axios.get("https://meme-api.herokuapp.com/gimme")).data;
}
