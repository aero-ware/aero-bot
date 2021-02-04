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

export interface IBotBanInfo extends mongoose.Document<any> {
    userId: string;
    endTime: Date | null;
}

export default mongoose.model("botbans", botban);
