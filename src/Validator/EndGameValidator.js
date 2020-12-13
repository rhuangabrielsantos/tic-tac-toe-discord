const { getGameByPlayerId } = require("../Repositories/PlayerRepository");
const { validateIfPlayerHasActiveGame } = require("./GameValidator");

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
        messageInstance.channel.send(message.shift())
        return error;
    }
}

module.exports = {
    validateEndGame
}