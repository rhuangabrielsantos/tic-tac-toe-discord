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

async function deleteGame(idPlayer) {
    return await Game.find().or([
        { first_player: idPlayer },
        { second_player: idPlayer }
    ]).deleteOne();
}

async function activateGame(idPlayer) {
    return await Game.find().or([
        { first_player: idPlayer },
        { second_player: idPlayer }
    ]).updateOne({
        active: true
    });
}

async function getInactiveSecondPlayerGame(idPlayer) {
    return await Game.find().and([
        { active: 'false' },
        { second_player: idPlayer }
    ]).exec();
}

module.exports = { getGameByPlayerId, refreshMarkingsInBoardByPlayerId, deleteGame, activateGame, getInactiveSecondPlayerGame }
