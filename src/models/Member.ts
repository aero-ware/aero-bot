import mongoose from "mongoose";

const reqString = {
    type: String,
    required: true
};

const member = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    coins: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    nextXPAdd: {
        type: Date,
        default: null,
    },
    warnings: {
        type: [Object],
        default: null,
    }
});

export type Warning = {
    author: string,
    timeStamp: number,
    reason: string,
    kind?: string,
};
export interface IMemberInfo extends mongoose.Document<any> {
    guildId: string;
    userId: string;
    coins: number;
    xp: number;
    level: number;
    nextXPAdd: Date | null;
    warnings: Warning[] | null;
};

export default mongoose.model("members", member);