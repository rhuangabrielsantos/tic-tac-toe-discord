const Game = require('../Models/Game');
const { validatePlayNewGame } = require('../Validator/PlayValidator');
const { validateMarkACell } = require('../Validator/MarkValidator');
const { getIdByPlayerMention, getPlayerNumber, getFirstValueInTheArray, createEmbedAlert, getIdPlayerByMessage } = require('../utils');
const { getGameByPlayerId, refreshMarkingsInBoardByPlayerId, deleteGame } = require("../Repositories/PlayerRepository");
const { refreshBoard } = require("./BoardService");
const { verifyIfHasAWinner, verifyIfIsBoardFull } = require('../Validator/GameValidator');
const { validateEndGame } = require('../Validator/EndGameValidator');
const { giveScoreToPlayer } = require('./RankingService');

const { marks } = require('../Models/Enum/CellEnum');

async function createGame(players, messageInstance, boardMarkings) {
    const idFirstPlayer = messageInstance.author.id;
    const idSecondPlayer = getIdByPlayerMention(players[0]);
    const guildId = messageInstance.channel.guild.id;

    const newGameIsNotValid = await validatePlayNewGame(players, idFirstPlayer, idSecondPlayer, messageInstance);

    if(newGameIsNotValid) {
        return false;
    }

    await Game.create({
        'first_player': idFirstPlayer,
        'second_player': idSecondPlayer,
        'marked_board': boardMarkings,
        'guild_id': guildId
    });

    return true;
}

async function markACell(action, messageInstance) {
    const idPlayer = getIdPlayerByMessage(messageInstance);

    const markIsNotValid = await validateMarkACell(idPlayer, action, messageInstance);
    const typedCell = getFirstValueInTheArray(action).toUpperCase();

    if(markIsNotValid) {
        return false;
    }

    const game = await getGameByPlayerId(idPlayer);
    
    const playerGame = getFirstValueInTheArray(game);
    const playerNumber = getPlayerNumber(playerGame, idPlayer);

    const refreshedBoard = refreshBoard(playerGame.marked_board, playerNumber, typedCell);
    
    await refreshMarkingsInBoardByPlayerId(idPlayer, refreshedBoard.markings);

    return refreshedBoard;
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

async function endGame(messageInstance) {
    const idPlayer = getIdPlayerByMessage(messageInstance);
    const gameDoesNotActive = await validateEndGame(idPlayer, messageInstance);

    if (gameDoesNotActive) {
        return true;
    }

    return false;
}

async function giveUpMatch(idPlayer) {
    const gameDescription = getFirstValueInTheArray(await getGameByPlayerId(idPlayer));

    const adversaryId = gameDescription.first_player === idPlayer 
        ? gameDescription.second_player
        : gameDescription.first_player;

    await deleteGame(idPlayer);
    await giveScoreToPlayer(adversaryId, gameDescription.guild_id);
}

module.exports = {
    createGame, 
    markACell,
    verifyIfIsGameOver,
    endGame,
    giveUpMatch
}
