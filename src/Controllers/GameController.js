const { generateEmptyBoard, getBoard, generateBoardView } = require('../Services/BoardService')
const { createEmbedAlert, getIdPlayerByMessage } = require('../utils');
const { createGame, acceptGameService, markACell, verifyIfIsGameOver, endGame, awaitReaction } = require('../Services/GameService');
const { generateRanking } = require('../Services/RankingService');

const HelpService = require('../Services/HelpService');

async function play (players, messageInstance) {
    const board = generateEmptyBoard();

    let gameIsCreated = await createGame(players, messageInstance, board.markings);

    if (gameIsCreated) {
        let secondPlayer = players[0];
        let message = await messageInstance.channel.send(secondPlayer + ', você aceita o desafio?');

        message.react('✅')
            .then(() => message.react('⛔'))
    }
}

async function acceptGame (client, reaction, user) {
    const gameDescription = await acceptGameService(client, reaction, user);
    const channelId = reaction.message.channel.id;

    if (!gameDescription) {
        return;
    }

    const board = generateBoardView(gameDescription.marked_board);
    const mentionFirstPlayer = `<@!${gameDescription.first_player}>`

    if (gameDescription) {
        client.channels.cache.get(channelId).send(mentionFirstPlayer + 'você começa!');
        client.channels.cache.get(channelId).send(board);
    }
}

async function mark (action, messageInstance) {
    let refreshedBoard = await markACell(action, messageInstance);
    let idPlayer = getIdPlayerByMessage(messageInstance).toString();

    if (refreshedBoard.view) {
        messageInstance.channel.send(refreshedBoard.view);
    }

    let isGameOver = await verifyIfIsGameOver(refreshedBoard.markings, idPlayer)
    
    if(isGameOver) {
        messageInstance.channel.send(isGameOver)
    }
}

async function board (action, message) {
    let board = await getBoard(message);

    if(!board) {
        return;
    }

    message.reply('o tabuleiro está assim!');
    message.channel.send(board);
}

function help (action, messageInstance) {
    const message = HelpService.createMessage(action[0]);

    messageInstance.channel.send(message);
}

async function end(action, message) {
    let gameDoesNotOver = await endGame(message);

    if(gameDoesNotOver) {
        return;
    }

    message.reply('Ficou com medinho, foi? O jogo foi finalizado! :clown:');
}

async function ranking(action, message) {
    let ranking = await generateRanking(message);
}

function recordedCommands () {
    return {
        play,
        mark,
        board,
        help,
        end,
        ranking
    }
}

module.exports = { recordedCommands, acceptGame }
