const Game = require("../Models/Game");
const { createEmbedAlert, verifyArrayIsEmpty } = require('../utils');
const { cell } = require('../Models/Enum/CellEnum');

async function validateMarkACell(idPlayer, typedCell, messageInstance) {
    let error = 0;
    let message = [];
    let validations = [];

    validations.push(await validateIfPlayerHasActiveGame(idPlayer));
    validations.push(validateIfTypedCellIsValid(typedCell));

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

async function validateIfPlayerHasActiveGame(idPlayer) {
    let game = await Game.find().or([
        { first_player: idPlayer },
        { second_player: idPlayer }
    ]).exec();

    if (!verifyArrayIsEmpty(game)) {
        let embed = createEmbedAlert(
            'Já existe um jogo entre os dois jogadores :clown:',
            'Para visualizar o jogo existente, envie **-ttt board**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

function validateIfTypedCellIsValid(typedCell) {
    cell.forEach((item, index) => {
        console.log(index, item)
    })
}


module.exports = { validateMarkACell }
// A1 A2 A3
// B1 B2 B3
// C1 C1 C3
