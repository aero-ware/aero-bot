const mongoose = require('mongoose')

const requiredString = {
    type: String,
    required: true,
}

const welcomeSchema = mongoose.Schema({
    _id: requiredString,
    channelId: requiredString,
    text: requiredString,
})

module.exports = mongoose.model('welcome-channels', welcomeSchema)