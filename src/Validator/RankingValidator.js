const MessageService = require('../Services/MessageService');

async function validateRankingIsEmpty(ranking, messageInstance) {
    if(ranking.length === 0) {
        MessageService.sendReplyToGuild(messageInstance, 'Não foi encontrada nenhuma informação, você precisa jogar uma partida antes de ver o ranking')

        return true;
    }

    return false;
}

module.exports = {
    validateRankingIsEmpty
}