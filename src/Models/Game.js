const { Schema, model } = require('mongoose');

const GameSchema = new Schema ({
    'first_player': {
        type: String,
        required: true
    },
    'second_player': {
        type: String,
        required: true
    },
    'maked_board': {
        type: String,
        required: true
    },
})

module.exports = model('Game', GameSchema);
