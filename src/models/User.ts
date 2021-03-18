import { Document, model, Schema } from "mongoose";
import { itemSchema } from "./Item";

const jobTypes = ["YouTuber", "Chef", "unemployed"];

type JobType = "YouTuber" | "Chef" | "unemployed";

const userSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    bankBalance: {
        type: Number,
        default: 0,
    },
    bankCapacity: {
        type: Number,
        default: 1000,
    },
    inventory: {
        type: [itemSchema],
        default: [],
    },
    passive: {
        type: Boolean,
        default: false,
    },
    multiplier: {
        type: Number,
        default: 1,
    },
    job: {
        type: String,
        enum: jobTypes,
        default: "unemployed",
    },
});

export interface IUser extends Document {
    _id: string;
    balance: number;
    bankBalance: number;
    bankCapacity: number;
    passive: boolean;
    multiplier: number;
    job: JobType;
}

export default model<IUser>("users", userSchema);
