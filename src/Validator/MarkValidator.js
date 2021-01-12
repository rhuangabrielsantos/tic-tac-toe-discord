const { createEmbedAlert, getFirstValueInTheArray, getPlayerNumber } = require('../utils');
const { cell, marks } = require('../Models/Enum/CellEnum');
const { getGameByPlayerId } = require("../Repositories/PlayerRepository");
const { validateIfPlayerHasActiveGame } = require("./GameValidator")
const ERROR = 1;

let defaultEmbed = createEmbedAlert(
    'Você deve marcar uma casa válida :clown:',
    'Para marcar uma casa, envie **' + process.env.PREFIX + ' mark A1**\nPara visualizar o board, envie **' + process.env.PREFIX + ' board**'
);

async function validateMarkACell(idPlayer, action, messageInstance) {
    let error = 0;
    let message = [];
    let validations = [];

    let typedCell = getFirstValueInTheArray(action);
    let playerGame = await getGameByPlayerId(idPlayer);

    validations.push(validateTypedCellLength(action));
    validations.push(validateIfPlayerHasActiveGame(playerGame));
    validations.push(validateThatTheGameWasAccepted(playerGame));
    validations.push(validateIfTypedCellIsValid(typedCell));
    validations.push(validateIfCellIsBlank(typedCell, playerGame));
    validations.push(validateIfIsPlayerTurn(playerGame, idPlayer));

    validations.forEach(validate => {
        if(validate.error === ERROR) {
            message.push(validate.message);
            error += validate.error;
        }
    });

    if (error >= ERROR) {
        messageInstance.channel.send(message.shift())
        return error;
    }
}

function validateIfTypedCellIsValid(typedCell) {
    if(!cell.hasOwnProperty(typedCell)) {
        return {
            error: ERROR,
            message: defaultEmbed
        };
    }

    return {};
}

function validateTypedCellLength(action) {
    if(action.length !== 1) {
        return {
            error: ERROR,
            message: defaultEmbed
        };
    }

    return {};
}

function validateIfCellIsBlank(typedCell, playerGame) {
    let game = getFirstValueInTheArray(playerGame);

    if (!game) {
        return {};
    }

    let markings = game.marked_board;
    let boardPosition = cell[typedCell];
    
    if(markings[boardPosition] !== 0) {
        return {
            error: ERROR,
            message: defaultEmbed
        };
    }

    return {};
}

function validateIfIsPlayerTurn(playerGame, idPlayer) {
    let game = getFirstValueInTheArray(playerGame);

    if (!game) {
        return {};
    }
    
    let markings = game.marked_board;
    let playerNumber = getPlayerNumber(game, idPlayer);

    let turnsFirstPlayer = 0;
    let turnsSecondPlayer = 0;

    markings.forEach(mark => {
        if(mark === marks.X) {
            turnsFirstPlayer++;
            return;
        }

        if(mark === marks.O) {
            turnsSecondPlayer++;
            return;
        }
    });

    if(playerNumber === marks.X && turnsFirstPlayer === turnsSecondPlayer) {
        return {};
    }

    if(playerNumber === marks.O && turnsFirstPlayer > turnsSecondPlayer) {
        return {};
    }
    
    let embed = createEmbedAlert(
        'Não é a sua vez princeso, pera ae :clown:',
        ''
    );

    return {
        error: ERROR,
        message: embed
    };
}

function validateThatTheGameWasAccepted(playerGame) {
    let game = getFirstValueInTheArray(playerGame);

    if (game.active === false) {
        let embed = createEmbedAlert(
            'O adversário não aceitou o jogo ainda princeso, pera ae :clown:',
            ''
        );
        
        return {
            error: ERROR,
            message: embed
        }
    }

    return {}
}

module.exports = { validateMarkACell }
