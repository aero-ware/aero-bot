import mongoose from "mongoose";

const muteSchema = new mongoose.Schema({
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

const model = mongoose.model("mutes", muteSchema);

export default model;
