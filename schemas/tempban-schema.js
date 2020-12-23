const mongoose = require('mongoose')

const tempbanSchema = mongoose.Schema({
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
})

module.exports = mongoose.model('tempbans', tempbanSchema)