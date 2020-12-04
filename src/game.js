const { 
    validateSecondPlayerNull, 
    validateMoreThanOneAdversary,
    validateAdversaryIsValid
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

function play (action, message) {
    validateSecondPlayerNull(action, message)
    validateMoreThanOneAdversary(action, message)
    validateAdversaryIsValid(action, message)
    // Validar se existe partida entre os participantes

    const board = generateEmptyBoard()

    Game.create({
        'player_one': message.author.id,
        'player_two': formatAdversaryId(action[0]),
        'maked_board': '{0,0,0,0,0,0,0,0,0}'
    })

    message.reply('você começa!')
    message.channel.send(board);
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

    const board = generateBoard(mocDate)
    message.reply('o tabuleiro está assim!')
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