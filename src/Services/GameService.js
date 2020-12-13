const Game = require('../Models/Game');
const { validatePlayNewGame } = require('../Validator/PlayValidator');
const { validateMarkACell } = require('../Validator/MarkValidator');
const { formatAdversaryId, getPlayerNumber, getFirstValueInTheArray, createEmbedAlert, getIdPlayerByMessage } = require('../utils');
const { getGameByPlayerId, refreshMarkingsInBoardByPlayerId, deleteGame } = require("../Repositories/PlayerRepository");
const { refreshBoard } = require("./BoardService");
const { verifyIfHasAWinner, verifyIfIsBoardFull } = require('../Validator/GameValidator');
const { validateEndGame } = require('../Validator/EndGameValidator');

const { marks } = require('../Models/Enum/CellEnum');

async function createGame(players, messageInstance, boardMarkings) {
    let idFirstPlayer = messageInstance.author.id;
    let idSecondPlayer = formatAdversaryId(players[0]);

    let newGameIsNotValid = await validatePlayNewGame(players, idFirstPlayer, idSecondPlayer, messageInstance);

    if(newGameIsNotValid) {
        return false;
    }

    await Game.create({
        'first_player': idFirstPlayer,
        'second_player': idSecondPlayer,
        'marked_board': boardMarkings
    });

    return true;
}

async function markACell(action, messageInstance) {
    let idPlayer = getIdPlayerByMessage(messageInstance);

    let markIsNotValid = await validateMarkACell(idPlayer, action, messageInstance);
    let typedCell = getFirstValueInTheArray(action);

    if(markIsNotValid) {
        return false;
    }

    let game = await getGameByPlayerId(idPlayer);
    
    let playerGame = getFirstValueInTheArray(game);
    let playerNumber = getPlayerNumber(playerGame, idPlayer);

    let refreshedBoard = refreshBoard(playerGame.marked_board, playerNumber, typedCell);
    
    await refreshMarkingsInBoardByPlayerId(idPlayer, refreshedBoard.markings);

    return refreshedBoard;
}

async function verifyIfIsGameOver(markings, playerId) {
    if(!markings) {
        return false;
    }

    let hasAWinner = verifyIfHasAWinner(markings);
    let isBoardFull = verifyIfIsBoardFull(markings);

    if(hasAWinner !== 0 || isBoardFull) {
        await deleteGame(playerId)
    }
        
    if(hasAWinner === marks.X) {
        
        return createEmbedAlert('O X Ganhou', '');
    }

    if(hasAWinner === marks.O) {
        return createEmbedAlert('A O Ganhou', '');
    }

    if(isBoardFull) {
        return createEmbedAlert('Deu velha', '')
    }
}

async function endGame(messageInstance) {
    let idPlayer = getIdPlayerByMessage(messageInstance);
    let gameDoesNotActive = await validateEndGame(idPlayer, messageInstance);

    if (gameDoesNotActive) {
        return true;
    }

    await deleteGame(idPlayer);

    return false;
}

module.exports = {
    createGame, 
    markACell,
    verifyIfIsGameOver,
    endGame
}
