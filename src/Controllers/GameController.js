const { generateEmptyBoard, getBoard, generateBoardView } = require('../Services/BoardService')
const { getIdPlayerByMessage, getIdByPlayerMention, getFirstValueInTheArray } = require('../utils');
const { createGame, markACell, verifyIfIsGameOver, endGame, giveUpMatch } = require('../Services/GameService');
const { generateRanking } = require('../Services/RankingService');
const { activateGame, getGameByPlayerId, deleteGame } = require('../Repositories/PlayerRepository');

const HelpService = require('../Services/HelpService');
const MessengerService = require('../Services/MessengerService');

async function play (players, messageInstance) {
    const board = generateEmptyBoard();

    const gameIsCreated = await createGame(players, messageInstance, board.markings);

    if (gameIsCreated) {
        const firstPlayerMention = `<@!${messageInstance.author.id}>`;
        const secondPlayerMention = players[0];

        const idSecondPlayer = getIdByPlayerMention(secondPlayerMention);

        const messanger = new MessengerService(messageInstance);
        
        const messageTitle = 'Uma solicitação de partida foi iniciada!';
        const messageDescription = `${secondPlayerMention} foi desafiado(a) por ${firstPlayerMention} para uma partida de Jogo da Velha.\n\n` + 
            `**Você aceita?**`;
        
        messanger.sendEmbedMessageToGuild(messageTitle, messageDescription)
            .then(async (message) => {
                await message.react('✅').then(() => message.react('⛔'));

                message.awaitReactions((reaction, user) => user.id == idSecondPlayer && (reaction.emoji.name == '✅' || reaction.emoji.name == '⛔'), { max: 1, time: 30000 })
                    .then(async collected => {
                        const messenger = new MessengerService(message);

                        message.delete();

                        if(collected.first().emoji.name == '✅') {
                            const messageTitle = 'A partida foi aceita!'
                            const messageDescription = `${firstPlayerMention} você começa o jogo!\n\n` +
                                'Para jogar envie o comando `-t mark [casa]`, se precisar de ajuda para utilizar este comando, envie `-t help mark`.';

                            messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);

                            await acceptGame(message, idSecondPlayer);
                            
                            return;
                        }

                        await deleteGame(idSecondPlayer);

                        const messageTitle = 'A partida não foi aceita!'
                        const messageDescription = `Alguem não está com vontade de jogar ${firstPlayerMention} :pensive:`

                        messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);
                    }).catch(async () => {
                        message.delete();
                        
                        await deleteGame(idSecondPlayer);

                        const messageTitle = 'Acabou o tempo!'
                        const messageDescription = `Já se passou 30 segundos e o adversário não aceitou a partida.\n` +
                            `Eu acho que ele(a) está te ignorando ${firstPlayerMention} :flushed:`

                        const messenger = new MessengerService(message);
                        messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);
                    });
            });
    }
}

async function acceptGame (message, idPlayer) {
    const gameDescription = getFirstValueInTheArray(await getGameByPlayerId(idPlayer));

    if (!gameDescription) {
        return;
    }

    await activateGame(idPlayer);

    const board = generateBoardView(gameDescription.marked_board);

    if (gameDescription) {
        const messenger = new MessengerService(message)
        messenger.sendSimpleMessageToGuild(board);
    }
}

async function mark (action, messageInstance) {
    const refreshedBoard = await markACell(action, messageInstance);
    const idPlayer = getIdPlayerByMessage(messageInstance).toString();

    const isGameOver = await verifyIfIsGameOver(refreshedBoard.markings, idPlayer);
    const messenger = new MessengerService(messageInstance);

    if(isGameOver) {
        const messageTitle = 'O jogo acabou!';

        messenger.sendEmbedMessageToGuild(messageTitle, isGameOver);
        messenger.sendSimpleMessageToGuild(refreshedBoard.view);
        return;
    }

    if (refreshedBoard.view) {
        const playerGame = getFirstValueInTheArray(await getGameByPlayerId(idPlayer));
    
        const idNextPlayer = idPlayer === playerGame.first_player ? playerGame.second_player : playerGame.first_player;
        const mentionNextPlayer = `<@!${idNextPlayer}>`;
        
        messenger.sendSimpleMessageToGuild(`É a sua vez ${mentionNextPlayer}!`)
        messenger.sendSimpleMessageToGuild(refreshedBoard.view);
    }
}

async function board (action, messageInstance) {
    let board = await getBoard(messageInstance);

    if(!board) {
        return;
    }

    const messenger = new MessengerService(messageInstance);

    messenger.sendReplyToGuild('o tabuleiro está assim!');
    messenger.sendSimpleMessageToGuild(board);
}

function help (action, messageInstance) {
    const message = HelpService.createMessage(action[0]);

    messageInstance.channel.send(message);
}

async function end(action, messageInstance) {
    let gameDoesNotOver = await endGame(messageInstance);

    if(gameDoesNotOver) {
        return;
    }

    const messenger = new MessengerService(messageInstance);
    const messageTitle = 'Você está desistindo da partida!'
    const descriptionTitle = 'Você tem certeza?\n' +
        'Ao desistir o adversário irá receber a pontuação automaticamente!';

    messenger.sendEmbedMessageToGuild(messageTitle, descriptionTitle)
        .then(async (message) => {
            await message.react('✅').then(() => message.react('⛔'));

            message.awaitReactions((reaction, user) => user.id == messageInstance.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '⛔'), { max: 1, time: 30000 })
                .then(async collected => {
                    const messenger = new MessengerService(message);

                    message.delete();

                    if(collected.first().emoji.name == '✅') {
                        await giveUpMatch(messageInstance.author.id);

                        const firstPlayerMention = `<@!${messageInstance.author.id}>`;

                        const messageTitle = 'Você desistiu da partida!'
                        const messageDescription = `Não teve como, o jogador ${firstPlayerMention} desistiu da partida.\n` +
                            'Ficou com medinho foi? :clown:';

                        messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);

                        return;
                    }
                    const messageTitle = 'Você não desistiu da partida!'
                    const messageDescription = 'Achou que eu iria desistir? Achou erraaado otário!\n' + 
                        'Segue o jogo!';

                    messenger.sendEmbedMessageToGuild(messageTitle, messageDescription)

                }).catch(async () => {
                    const messenger = new MessengerService(message);

                    message.delete();

                    const messageTitle = 'Acabou o tempo de desistencia.'
                    const messageDescription = 'O tempo passou e você não desistiu, então segue o jogo!';

                    messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);
                });
            });
}

async function ranking(action, message) {
    await generateRanking(message);
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
