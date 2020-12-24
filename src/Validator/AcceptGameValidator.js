const { getFirstValueInTheArray } = require('../utils');
const { getInactiveSecondPlayerGame } = require('../Repositories/PlayerRepository');

async function validateAcceptGame(idPlayer) {
    let game = getFirstValueInTheArray(await getInactiveSecondPlayerGame(idPlayer));

    if(game) {
        return game;
    }
}

module.exports = { validateAcceptGame }