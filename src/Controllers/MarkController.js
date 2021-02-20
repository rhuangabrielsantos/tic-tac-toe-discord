const { getIdPlayerByMessage, getFirstValueInTheArray } = require('../utils');
const { markACell } = require('../Services/GameService');
const { getGameByPlayerId } = require('../Repositories/PlayerRepository');

const MessengerService = require('../Services/MessengerService');

async function mark (messageInstance, action) {
    const refreshedBoard = await markACell(action, messageInstance);
    const idPlayer = getIdPlayerByMessage(messageInstance).toString();

    if(!refreshedBoard){
        return;
    }

    if (refreshedBoard.view) {
        const playerGame = getFirstValueInTheArray(await getGameByPlayerId(idPlayer));
        const idNextPlayer = idPlayer === playerGame.first_player ? playerGame.second_player : playerGame.first_player;
        const mentionNextPlayer = `<@!${idNextPlayer}>`;
        const messenger = new MessengerService(messageInstance);

        messenger.sendSimpleMessageToGuild(`É a sua vez ${mentionNextPlayer}!`)
        messenger.sendSimpleMessageToGuild(refreshedBoard.view);
    }
}

module.exports = { mark }