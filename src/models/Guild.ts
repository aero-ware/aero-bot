import mongoose from "mongoose";

const optionalString = {
    type: String,
    default: null,
};

const guild = new mongoose.Schema({
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
        default: new Map()
    },
    blacklistedWords: {
        type: [String],
        default: [],
    },
    snipes: {
        type: Object,
        default: {},
    },
    autoRole: optionalString,
    levelsEnabled: {
        type: Boolean,
        default: true,
    },
    suggestionChannels: {
        type: [String],
        default: [],
    },
});

export interface IGuildConfig extends mongoose.Document<any> {
    _id: string;
    welcomeChannelId: string | null;
    welcomeText: string | null;
    logChannelId: string | null;
    mutedRoleId: string | null;
    banPurgeDays: number;
    adChannels: string[],
    roleMenus: Map<string, Map<string, any>>;
    blacklistedWords: string[];
    snipes: {
        [channel: string]: {
            id: string;
            content: string;
            author: string;
            timestamp: number;
        };
    };
    autoRole: string | null;
    levelsEnabled: boolean;
    suggestionChannels: string[],
};

export default mongoose.model('guild-configs', guild);