const Game = require("../Models/Game");

async function getGameByPlayerId(idPlayer) {
    return await Game.find().or([
        { first_player: idPlayer },
        { second_player: idPlayer }
    ]).exec();
}

async function refreshMarkingsInBoardByPlayerId(idPlayer, refreshedBoard) {
    return await Game.find().or([
        { first_player: idPlayer },
        { second_player: idPlayer }
    ]).updateOne({
        marked_board: refreshedBoard
    });
}

module.exports = { getGameByPlayerId, refreshMarkingsInBoardByPlayerId }
