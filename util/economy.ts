import memberSchema from "../schemas/member-schema";

const getCoins = async (guildId: string, userId: string) => {
    const result = await memberSchema.findOne({
        guildId,
        userId,
    });

    let coins = 0;
    //@ts-ignore
    if (result) coins = result.coins;
    else {
        await new memberSchema({
            guildId,
            userId,
            coins,
        }).save();
    }

    return coins;
};

const addCoins = async (guildId: string, userId: string, coins: number) => {
    const result = await memberSchema.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                coins,
            },
        },
        {
            upsert: true,
            new: true,
            useFindAndModify: false,
        }
    );

    //@ts-ignore
    return result.coins;
};

const setCoins = async (guildId: string, userId: string, coins: number): Promise<number> => {
    const bal = await module.exports.getCoins(guildId, userId);
    await module.exports.addCoins(guildId, userId, -bal);
    const newBal = await module.exports.addCoins(guildId, userId, coins);
    return newBal;
};

export { setCoins, addCoins, getCoins };
