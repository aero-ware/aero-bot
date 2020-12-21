const mongoose = require('mongoose')

const logSchema = mongoose.Schema({
    _id: String,
    channelId: {
        type: String,
    }
})

module.exports = mongoose.model('log-channels', logSchema)