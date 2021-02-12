const MessengerService = require('../Services/MessengerService');

async function validateRankingIsEmpty(ranking, messageInstance) {
    if(ranking.length === 0) {
    
        const messanger = new MessengerService(messageInstance);
        messanger.sendEmbedMessageToGuild(
            'O Ranking está vazio.',
            'Não foi encontrada nenhuma informação para este servidor, você precisa jogar uma partida antes de ver o ranking'
        )

        return true;
    }

    return false;
}

module.exports = {
    validateRankingIsEmpty
}