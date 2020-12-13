const Game = require('../Models/Game');
const { validatePlayNewGame } = require('../Validator/PlayValidator');
const { validateMarkACell } = require('../Validator/MarkValidator');
const { formatAdversaryId, getPlayerNumber, getFirstValueInTheArray } = require('../utils');
const { getGameByPlayerId, refreshMarkingsInBoardByPlayerId } = require("../Repositories/PlayerRepository");
const { refreshBoard } = require("./BoardService");

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
    let idPlayer = messageInstance.author.id;

    let markIsNotValid = await validateMarkACell(idPlayer, action, messageInstance);
    let typedCell = getFirstValueInTheArray(action);

    if(markIsNotValid) {
        return false;
    }

    let playerGame = getFirstValueInTheArray(await getGameByPlayerId(idPlayer));
    let playerNumber = getPlayerNumber(playerGame, idPlayer);

    let refreshedBoard = refreshBoard(playerGame.marked_board, playerNumber, typedCell);
    
    await refreshMarkingsInBoardByPlayerId(idPlayer, refreshedBoard.markings);

    return refreshedBoard.view;
}

module.exports = {
    createGame, 
    markACell
}
