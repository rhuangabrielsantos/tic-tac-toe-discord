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
    'marked_board': {
        type: Array,
        required: true
    },
    'active': {
        type: Boolean,
        default: false
    },
    'guild_id': {
        type: String,
        required: true
    }
})

module.exports = model('Game', GameSchema);
