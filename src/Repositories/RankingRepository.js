const Ranking = require("../Models/Ranking");

class RankingRepository {
    static async getRankingByGuildId(guildId) {
        return await Ranking.find({
            guild_id: guildId
        })
        .sort({
            score: 'desc'
        })
        .exec();
    }

    static async getScoreByPlayer(guildId, playerId) {
        return await Ranking.findOne({
            guild_id: guildId,
            player_id: playerId
        })
        .exec();
    }

    static async create(guildId, playerId) {
        await Ranking.create({
            guild_id: guildId,
            player_id: playerId,
            score: 1
        })
    }

    static async update(guildId, playerId, score) {
        await Ranking.updateOne({
            guild_id: guildId,
            player_id: playerId
        }, {
            score: score
        })
    }
}

module.exports = RankingRepository;