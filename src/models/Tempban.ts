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

export default mongoose.model("tempbans", tempban);