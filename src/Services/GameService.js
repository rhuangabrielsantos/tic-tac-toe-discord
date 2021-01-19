const Game = require('../Models/Game');
const { validatePlayNewGame } = require('../Validator/PlayValidator');
const { validateMarkACell } = require('../Validator/MarkValidator');
const { getIdByPlayerMention, getPlayerNumber, getFirstValueInTheArray, createEmbedAlert, getIdPlayerByMessage } = require('../utils');
const { getGameByPlayerId, refreshMarkingsInBoardByPlayerId, deleteGame, activateGame } = require("../Repositories/PlayerRepository");
const { refreshBoard } = require("./BoardService");
const { verifyIfHasAWinner, verifyIfIsBoardFull } = require('../Validator/GameValidator');
const { validateEndGame } = require('../Validator/EndGameValidator');
const { validateAcceptGame } = require('../Validator/AcceptGameValidator');
const { giveScoreToPlayer } = require('./RankingService');

const { marks } = require('../Models/Enum/CellEnum');

async function createGame(players, messageInstance, boardMarkings) {
    const idFirstPlayer = messageInstance.author.id;
    const idSecondPlayer = getIdByPlayerMention(players[0]);
    const guildId = messageInstance.channel.guild.id;

    const newGameIsNotValid = await validatePlayNewGame(players, idFirstPlayer, idSecondPlayer, messageInstance);

    if(newGameIsNotValid) {
        return false;
    }

    await Game.create({
        'first_player': idFirstPlayer,
        'second_player': idSecondPlayer,
        'marked_board': boardMarkings,
        'guild_id': guildId
    });

    return true;
}

async function acceptGameService(client, reaction, user) {
    let idPlayer = user.id;
    let emoji = reaction._emoji.name;
    let channelId = reaction.message.channel.id;

    let gameDescription = await validateAcceptGame(idPlayer);

    if (!gameDescription) {
        return;
    }

    if (emoji === '✅' && gameDescription.second_player === idPlayer) {
        client.channels.cache.get(channelId).send('O desafio foi aceito!');
        activateGame(idPlayer);
        return gameDescription;
    }

    if (emoji === '⛔' && gameDescription.second_player === idPlayer) {
        client.channels.cache.get(channelId).send('Ih, ficou com medinho :clown:');
        deleteGame(idPlayer);
        return;
    }
}

async function markACell(action, messageInstance) {
    const idPlayer = getIdPlayerByMessage(messageInstance);

    const markIsNotValid = await validateMarkACell(idPlayer, action, messageInstance);
    const typedCell = getFirstValueInTheArray(action);

    if(markIsNotValid) {
        return false;
    }

    const game = await getGameByPlayerId(idPlayer);
    
    const playerGame = getFirstValueInTheArray(game);
    const playerNumber = getPlayerNumber(playerGame, idPlayer);

    const refreshedBoard = refreshBoard(playerGame.marked_board, playerNumber, typedCell);
    
    await refreshMarkingsInBoardByPlayerId(idPlayer, refreshedBoard.markings);

    return refreshedBoard;
}

async function verifyIfIsGameOver(markings, playerId) {
    if(!markings) {
        return false;
    }

    const hasAWinner = verifyIfHasAWinner(markings);
    const isBoardFull = verifyIfIsBoardFull(markings);

    const playerGame = getFirstValueInTheArray(await getGameByPlayerId(playerId));

    if(hasAWinner !== 0 || isBoardFull) {
        await deleteGame(playerId)
    }
        
    if(hasAWinner === marks.X) {
        await giveScoreToPlayer(playerGame.first_player, playerGame.guild_id);

        return createEmbedAlert('O X Ganhou', '');
    }

    if(hasAWinner === marks.O) {
        await giveScoreToPlayer(playerGame.second_player, playerGame.guild_id);

        return createEmbedAlert('A O Ganhou', '');
    }

    if(isBoardFull) {
        return createEmbedAlert('Deu velha', '')
    }
}

async function endGame(messageInstance) {
    const idPlayer = getIdPlayerByMessage(messageInstance);
    const gameDoesNotActive = await validateEndGame(idPlayer, messageInstance);

    if (gameDoesNotActive) {
        return true;
    }

    const gameDescription = getFirstValueInTheArray(await getGameByPlayerId(idPlayer));

    const adversaryId = gameDescription.first_player === idPlayer 
        ? gameDescription.second_player
        : gameDescription.first_player;

    await deleteGame(idPlayer);
    await giveScoreToPlayer(adversaryId, gameDescription.guild_id);

    return false;
}

module.exports = {
    createGame, 
    markACell,
    verifyIfIsGameOver,
    endGame,
    acceptGameService
}
