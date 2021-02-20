const { generateEmptyBoard, generateBoardView } = require('../Services/BoardService');
const { createGame } =  require('../Services/GameService');
const { getFirstValueInTheArray, getIdByPlayerMention } = require('../utils');
const { activateGame, getGameByPlayerId, deleteGame } = require('../Repositories/PlayerRepository');

const MessengerService = require('../Services/MessengerService');

async function play (messageInstance, players) {
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

module.exports = { play }