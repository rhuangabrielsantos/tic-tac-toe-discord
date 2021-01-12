const { generateEmptyBoard, getBoard, generateBoardView } = require('../Services/BoardService')
const { createEmbedAlert, getIdPlayerByMessage } = require('../utils');
const { createGame, acceptGameService, markACell, verifyIfIsGameOver, endGame, awaitReaction } = require('../Services/GameService');

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
    let idPlayer = getIdPlayerByMessage(messageInstance);

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

function help (action, message) {
    const description = 
        'Adicione **' + process.env.PREFIX + '** antes de qualquer comando\n\n' +
        ':loudspeaker: `play [adversario]` - Inicia um novo jogo\n' +
        ':pencil2: `mark [posicao]` - Marca uma casa\n' +
        ':rooster: `end` - Termina uma partida\n' +
        ':mag: `board` - Exibe o tabuleiro\n\n' +
        'Desenvolvido por **@rhuangabrielsantos @anaclaudialimacosta**';

    const embed = createEmbedAlert(
        ':robot:  Comandos Tic Tac Toe  :robot:',
        description
    )

    message.channel.send(embed);
}

async function end(action, message) {
    let gameDoesNotOver = await endGame(message);

    if(gameDoesNotOver) {
        return;
    }

    message.reply('Ficou com medinho, foi? O jogo foi finalizado! :clown:');
}

function recordedCommands () {
    return {
        play,
        mark,
        board,
        help,
        end
    }
}

module.exports = { recordedCommands, acceptGame }
