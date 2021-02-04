const MessengerService = require('../Services/MessengerService');

async function validateRankingIsEmpty(ranking, messageInstance) {
    if(ranking.length === 0) {
    
        const messanger = new MessengerService(messageInstance);
        messanger.sendReplyToGuild('Não foi encontrada nenhuma informação, você precisa jogar uma partida antes de ver o ranking')

        return true;
    }

    return false;
}

module.exports = {
    validateRankingIsEmpty
}