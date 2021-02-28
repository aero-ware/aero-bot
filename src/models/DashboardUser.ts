/**
 * Copyright ⓒ cursorsdottsx 2021 dont steal my code pls
 */

import { Document, Model, model, models, Schema } from "mongoose";

export interface IDashboardUser extends Document {
    _id: string;
    username: string;
    avatar: string;
    guilds: any[];
    accessToken: string;
    refreshToken: string;
}

export const dashboardUserSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    guilds: {
        type: Array,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

const dashboardUsers: Model<IDashboardUser> =
    models["dashboard-users"] || model("dashboard-users", dashboardUserSchema);

export default dashboardUsers;
