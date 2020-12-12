const { 
    validateSecondPlayerNull, 
    validateMoreThanOneAdversary,
    validateAdversaryIsValid,
    validateWhetherPlayersAlreadyHaveAnActivatedGame
} = require('./validator');

const { 
    generateEmptyBoard, 
    generateBoard 
} = require('./board')

const {
    createEmbedAlert,
    formatAdversaryId
} = require('./helper');

const Game = require('./Models/Game');

function play (players, messageInstance) {
    let idFirstPlayer = messageInstance.author.id;
    let idSecondPlayer = formatAdversaryId(players[0]);

    validateSecondPlayerNull(players, messageInstance);
    validateMoreThanOneAdversary(players, messageInstance);
    validateAdversaryIsValid(players, messageInstance);
    validateWhetherPlayersAlreadyHaveAnActivatedGame(idFirstPlayer, idSecondPlayer);

    const board = generateEmptyBoard();

    return;

    Game.create({
        'first_player': idFirstPlayer,
        'second_player': idSecondPlayer,
        'maked_board': '{0,0,0,0,0,0,0,0,0}'
    })

    messageInstance.reply('você começa!');
    messageInstance.channel.send(board);
}

function mark (action, message) {
    // Validar se o usuário que enviou o comando possui uma partida
    // Validar se a marcação é valida

    // Obter o id da partida
    // Salvar no banco a marcação

    // Enviar o board pro usuário atualizado
}

function board (action, message) {
    // Validar se o usuário que enviou o comando possui uma partida

    // Obter os campos que foram preenchidos do banco 
    const mocDate = [2, 1, 0, 0, 1, 2, 2, 0, 1];

    const board = generateBoard(mocDate);
    message.reply('o tabuleiro está assim!');
    message.channel.send(board);
}

function help (action, message) {
    const description = 
        'Adicione **-ttt** antes de qualquer comando\n\n' +
        ':loudspeaker: `play [adversario]` - Inicia um novo jogo\n' +
        ':pencil2: `mark [posicao]` - Marca uma casa\n' +
        ':mag: `board` - Exibe o tabuleiro\n\n' +
        'Desenvolvido por **@rhuangabrielsantos @anaclaudialimacosta**';

    const embed = createEmbedAlert(
        ':robot:  Comandos Tic Tac Toe  :robot:',
        description
    )

    message.channel.send(embed);
}

function recordedCommands () {
    return {
        play,
        mark,
        board,
        help
    }
}

module.exports = { recordedCommands }