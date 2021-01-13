const { Schema, model } = require('mongoose');

const RankingSchema = new Schema ({
    'guild_id': {
        type: Number,
        required: true
    },
    'player_id': {
        type: Number,
        required: true
    },
    'score': {
        type: Number,
        required: true
    }
})

module.exports = model('Ranking', RankingSchema);
