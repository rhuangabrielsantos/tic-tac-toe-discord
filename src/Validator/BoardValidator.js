const { getGameByPlayerId } = require("../Repositories/PlayerRepository");
const { validateIfPlayerHasActiveGame } = require("./GameValidator");

const MessengerService = require('../Services/MessengerService');

const ERROR = 1;

async function validateShowBoard(idPlayer, messageInstance) {
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

module.exports = {
    validateShowBoard
}