import { Document, model, Schema } from "mongoose";

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    sellPrice: {
        type: Number,
        default: 0,
    },
});

export interface IItem extends Document {
    name: string;
    description: string;
    emoji: string;
    sellPrice: number;
}

export default model<IItem>("items", itemSchema);
