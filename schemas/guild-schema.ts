import mongoose from "mongoose";

const optionalString = {
    type: String,
    default: null,
};

const guildSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    welcomeChannelId: optionalString,
    welcomeText: optionalString,
    logChannelId: optionalString,
    mutedRoleId: optionalString,
    banPurgeDays: {
        type: Number,
        default: 0,
    },
    adChannels: {
        type: [String],
        default: [],
    },
    roleMenus: {
        type: Map,
        default: new Map(),
    },
    blacklistedWords: {
        type: [String],
        default: [],
    },
    snipes: {
        type: Object,
        default: {},
    },
    autoRole: {
        type: String,
        default: null,
    },
});

const model = mongoose.model("guild-configs", guildSchema);

export default model;
