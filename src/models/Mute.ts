import mongoose from "mongoose";

const mute = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
});

export interface IMuteInfo extends mongoose.Document<any> {
    _id: any;
    guildId: string;
    userId: string;
    endTime: Date;
}

export default mongoose.model("mutes", mute);
