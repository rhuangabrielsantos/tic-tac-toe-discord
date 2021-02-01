const { generateEmptyBoard, getBoard, generateBoardView } = require('../Services/BoardService')
const { createEmbedAlert, getIdPlayerByMessage, getIdByPlayerMention, getFirstValueInTheArray } = require('../utils');
const { createGame, markACell, verifyIfIsGameOver, endGame } = require('../Services/GameService');
const { generateRanking } = require('../Services/RankingService');
const MessageService = require('../Services/MessageService');
const { activateGame, getGameByPlayerId, deleteGame } = require('../Repositories/PlayerRepository');

const HelpService = require('../Services/HelpService');

async function play (players, messageInstance) {
    const board = generateEmptyBoard();

    let gameIsCreated = await createGame(players, messageInstance, board.markings);

    if (gameIsCreated) {
        const secondPlayer = players[0];

        const idSecondPlayer = getIdByPlayerMention(secondPlayer);
        
        messageInstance.channel.send(secondPlayer + ', você aceita o desafio?')
            .then(async (message) => {
                await message.react('✅').then(() => message.react('⛔'));

                message.awaitReactions((reaction, user) => user.id == idSecondPlayer && (reaction.emoji.name == '✅' || reaction.emoji.name == '⛔'), { max: 1, time: 30000 })
                    .then(async collected => {
                        message.delete();

                        if(collected.first().emoji.name == '✅') {
                            MessageService.sendMessageToGuild(message, 'Desafio foi aceito!');
                            await acceptGame(message, idSecondPlayer);
                            
                            return;
                        }
                        await deleteGame(idSecondPlayer);

                        MessageService.sendMessageToGuild(message, 'Desafio não foi aceito!');
                    }).catch(async () => {
                        message.delete();
                        
                        await deleteGame(idSecondPlayer);

                        MessageService.sendMessageToGuild(message, 'Acabou o tempo e o desafio não foi aceito!');
                    });
            });;
    }
}

async function acceptGame (message, idPlayer) {
    const gameDescription = getFirstValueInTheArray(await getGameByPlayerId(idPlayer));

    if (!gameDescription) {
        return;
    }

    await activateGame(idPlayer);

    const board = generateBoardView(gameDescription.marked_board);
    const mentionFirstPlayer = `<@!${gameDescription.first_player}>`

    if (gameDescription) {
        MessageService.sendMessageToGuild(message, mentionFirstPlayer + 'você começa!');
        MessageService.sendMessageToGuild(message, board);
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
