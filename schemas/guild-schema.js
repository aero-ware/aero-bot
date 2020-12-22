const mongoose = require('mongoose')

const optionalString = {
    type: String,
    default: null,
}

const guildSchema = mongoose.Schema({
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
})

module.exports = mongoose.model('guild-configs', guildSchema)