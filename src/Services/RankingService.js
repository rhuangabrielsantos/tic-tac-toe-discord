const RankingRepository = require('../Repositories/RankingRepository');
const { validateRankingIsEmpty } = require('../Validator/RankingValidator');
const MessageService = require('./MessageService');

async function generateRanking(messageInstance) {
    const guildId = messageInstance.channel.guild.id;
    const rankings = await RankingRepository.getRankingByGuildId(guildId);

    const rankingIsEmpty = await validateRankingIsEmpty(rankings, messageInstance);

    if(rankingIsEmpty) {
        return;
    }

    const message = generateRankingMessage(rankings);

    MessageService.sendMessageToGuild(messageInstance, message)
}

async function giveScoreToPlayer(playerId, guildId) {
    const playerScore = await RankingRepository.getScoreByPlayer(guildId, playerId);
    
    if(playerScore) {
        const newPlayerScore = playerScore.score + 1;
        await RankingRepository.update(guildId, playerId, newPlayerScore);
        return;
    }

    await RankingRepository.create(guildId, playerId);
}

function generateRankingMessage(rankings) {
    let message = ':trophy: **Ranking** \n\n';

    if (rankings[0]) {
        const score = rankings[0].score === 1 ? '**1 PONTO**' : `**${rankings[0].score} PONTOS**`
        message += `:first_place: <@!${rankings[0].player_id}> - ${score}\n`;
    }
    
    if (rankings[1]) {
        const score = rankings[1].score === 1 ? '**1 PONTO**' : `**${rankings[1].score} PONTOS**`
        message += `:second_place: <@!${rankings[1].player_id}> -   ${score}\n`;
    }
    
    if (rankings[2]) {
        const score = rankings[2].score === 1 ? '**1 PONTO**' : `**${rankings[2].score} PONTOS**`
        message += `:third_place: <@!${rankings[2].player_id}> - ${score}\n`;
    }
    
    return message;
}

module.exports = {
    generateRanking,
    giveScoreToPlayer
}