import mongoose from "mongoose";

const tempban = new mongoose.Schema({
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

export interface IBanInfo extends mongoose.Document<any> {
    _id: any;
    guildId: string;
    userId: string;
    endTime: Date;
};

export default mongoose.model("tempbans", tempban);