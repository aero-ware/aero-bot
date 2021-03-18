import { Document, Model, model, models, Schema } from "mongoose";

export interface IItem extends Document {
    name: string;
    description: string;
    cost: number;
    type: "EDIBLE" | "TOOL" | "COLLECTABLE" | "USEONCE";
}

export const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ["EDIBLE", "TOOL", "COLLECTABLE", "USEONCE"],
        required: true,
    },
});

const items: Model<IItem> = models["items"] || model("items", itemSchema);

export default items;
