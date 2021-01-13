const { Schema, model } = require('mongoose');

const RankingSchema = new Schema ({
    'guild_id': {
        type: String,
        required: true
    },
    'player_id': {
        type: String,
        required: true
    },
    'score': {
        type: Number,
        required: true
    }
})

module.exports = model('Ranking', RankingSchema);
