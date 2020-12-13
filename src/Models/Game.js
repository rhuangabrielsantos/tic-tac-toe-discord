const { Schema, model } = require('mongoose');

const GameSchema = new Schema ({
    'first_player': {
        type: Number,
        required: true
    },
    'second_player': {
        type: Number,
        required: true
    },
    'marked_board': {
        type: Array,
        required: true
    },
})

module.exports = model('Game', GameSchema);
