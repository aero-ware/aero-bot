const mongoose = require('mongoose')

const muteSchema = mongoose.Schema({
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

module.exports = mongoose.model('mutes', muteSchema)