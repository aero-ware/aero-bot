import AeroClient from "@aeroware/aeroclient";
import tempbanSchema from "../schemas/tempban-schema";

const updatetempBans = async (client: AeroClient) => {
    const tempbans = await tempbanSchema.find({});
    for (const tempban of tempbans) {
        //@ts-ignore
        if (tempban.endTime < Date.now()) {
            //@ts-ignore
            unbanMember(tempban.guildId, tempban.userId, client);
        }
    }
};

const unbanMember = async (guildId: string, userId: string, client: AeroClient) => {
    const guild = await client.guilds.fetch(guildId);
    const user = await client.users.fetch(userId);
    const guildBans = await guild.fetchBans();
    const userIsBanned = guildBans.has(userId);
    if (userIsBanned) {
        await guild.members.unban(user);
    }
    await tempbanSchema.findOneAndDelete({ guildId, userId });
};

export default updatetempBans;
