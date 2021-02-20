const { deleteGame, getGameByPlayerId } = require("../Repositories/PlayerRepository");
const { validateIfPlayerHasActiveGame } = require("./GameValidator");
const { verifyIfHasAWinner, verifyIfIsBoardFull } = require('../Validator/GameValidator');
const { getFirstValueInTheArray } = require('../utils');
const { giveScoreToPlayer } = require('../Services/RankingService');
const { marks } = require('../Models/Enum/CellEnum');

const MessengerService = require('../Services/MessengerService');

const ERROR = 1;

async function validateEndGame(idPlayer, messageInstance) {
    let error = 0;
    let message = [];
    let validations = [];

    let playerGame = await getGameByPlayerId(idPlayer);

    validations.push(validateIfPlayerHasActiveGame(playerGame));

    validations.forEach(validate => {
        if(validate.error === ERROR) {
            message.push(validate.message);
            error += validate.error;
        }
    });

    if (error >= ERROR) {
        const messenger = new MessengerService(messageInstance);
        messenger.sendSimpleMessageToGuild(message.shift())

        return error;
    }
}

async function verifyIfIsGameOver(markings, playerId) {
    if(!markings) {
        return false;
    }

    const hasAWinner = verifyIfHasAWinner(markings);
    const isBoardFull = verifyIfIsBoardFull(markings);

    const playerGame = getFirstValueInTheArray(await getGameByPlayerId(playerId));

    const firstPlayerMention = `<@!${playerGame.first_player}>`;
    const secondPlayerMention = `<@!${playerGame.second_player}>`;

    if(hasAWinner !== 0 || isBoardFull) {
        await deleteGame(playerId)
    }
        
    if(hasAWinner === marks.X) {
        await giveScoreToPlayer(playerGame.first_player, playerGame.guild_id);

        return `O ${firstPlayerMention} é o vencedor, quem sabe em uma próxima vez ${secondPlayerMention}!\n ` +
            'Para visualizar o ranking do servidor envie `-t ranking`.';
    }

    if(hasAWinner === marks.O) {
        await giveScoreToPlayer(playerGame.second_player, playerGame.guild_id);

        return `O ${secondPlayerMention} é o vencedor, quem sabe em uma próxima vez ${firstPlayerMention}!\n ` +
            'Para visualizar o ranking do servidor envie `-t ranking`.';
    }

    if(isBoardFull) {
        return 'Ihh, deu velha. Ou os dois jogadores são muito bons, ou são muito ruins.\n' +
            'Só tem um jeito de descobrir isso, vamos jogar novamente?';
    }
}

module.exports = {
    validateEndGame, 
    verifyIfIsGameOver
}