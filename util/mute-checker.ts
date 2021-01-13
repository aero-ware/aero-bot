import AeroClient from "@aeroware/aeroclient";
import guildSchema from "../schemas/guild-schema";
import muteSchema from "../schemas/mute-schema";

const updateMutes = async (client: AeroClient) => {
    const mutes = await muteSchema.find({});
    for (const mute of mutes) {
        //@ts-ignore
        if (mute.endTime < Date.now()) unmuteMember(mute.guildId, mute.userId, client);
    }
};

const unmuteMember = async (guildId: string, userId: string, client: AeroClient) => {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId);
    //@ts-ignore
    const { mutedRoleId } = await guildSchema.findOne({ _id: guildId });
    await member.roles.remove(mutedRoleId).then(async () => {
        await muteSchema.findOneAndDelete({
            guildId,
            userId,
        });
    });
};

export default updateMutes;
