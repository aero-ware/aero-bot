const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const memberSchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    coins: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    warnings: {
        type: [Object],
        default: null,
    }
})

module.exports = mongoose.model('members', memberSchema)