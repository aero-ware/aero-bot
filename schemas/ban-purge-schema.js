const { Schema, model } = require("mongoose");

const banPurgeSchema = Schema({
    _id: {
        type: String,
        required: true,
    },
    days: {
        type: Number,
        default: 0,
    },
})

module.exports = model('ban-purge-days', banPurgeSchema)