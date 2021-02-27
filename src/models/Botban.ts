import mongoose from "mongoose";

const botban = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    endTime: {
        type: Date,
        default: null,
    },
});

export interface IBotBanInfo extends mongoose.Document {
    userId: string;
    endTime: Date | null;
}

const botbans = mongoose.model<IBotBanInfo>("botbans", botban);

export default botbans;
