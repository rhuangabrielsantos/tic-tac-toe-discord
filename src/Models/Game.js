const { Schema, model } = require('mongoose');

const GameSchema = new Schema ({
    'player_one': {
        type: String,
        required: true
    },
    'player_two': {
        type: String,
        required: true
    },
    'maked_board': {
        type: String,
        required: true
    },
})

module.exports = model('Game', GameSchema);