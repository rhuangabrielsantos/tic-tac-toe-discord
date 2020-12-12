const Game = require('../Models/Game');
const { validatePlayNewGame } = require('../Validator/PlayValidator');
const { validateMarkACell } = require('../Validator/MarkValidator');
const { formatAdversaryId } = require('../utils');

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
        'maked_board': boardMarkings
    });

    return true;
}

async function markACell(players, typedCell, messageInstance) {
    let idPlayer = messageInstance.author.id;
    validateMarkACell(idPlayer, typedCell, messageInstance);
    
}

module.exports = {
    createGame, 
    markACell
}