const { Schema, model } = require('mongoose');

const gameSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    isWin: {
        type: Boolean,
        default: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});

module.exports = model('Game', gameSchema);