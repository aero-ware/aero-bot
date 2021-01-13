import mongoose from "mongoose";

const tempbanSchema = new mongoose.Schema({
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

const model = mongoose.model("tempbans", tempbanSchema);

export default model;
