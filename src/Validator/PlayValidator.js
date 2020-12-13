const { createEmbedAlert, formatAdversaryId, verifyArrayIsEmpty } = require('../utils');
const { getGameByPlayerId } = require('../Repositories/PlayerRepository');

const ERROR = 1;

async function validatePlayNewGame(players, idFirstPlayer, idSecondPlayer, messageInstance) {
    let error = 0;
    let message = [];
    let validations = [];

    validations.push(validateSecondPlayerNull(players));
    validations.push(validateMoreThanOneAdversary(players));
    validations.push(validateAdversaryIsValid(players, messageInstance));
    validations.push(await validateWhetherPlayersAlreadyHaveAnActivatedGame(idFirstPlayer, idSecondPlayer));

    validations.forEach(validate => {
        if(validate.error === ERROR) {
            message.push(validate.message);
            error += validate.error;
        }
    });

    if (error >= ERROR) {
        messageInstance.channel.send(message.shift())
        return error;
    }
}

function validateSecondPlayerNull(players) {
    if (players.length === 0) {
        let embed = createEmbedAlert(
            'Você precisa informar o jogador adversário :clown:',
            'Para verificar os comandos digite **-ttt help**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

function validateMoreThanOneAdversary(players) {
    if (players.length > 1) {
        let embed = createEmbedAlert(
            'Você deve informar apenas um adversário :clown:',
            'Para verificar os comandos digite **-ttt help**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

function validateAdversaryIsValid(players, messageInstance) {
    const adversaryId = formatAdversaryId(players[0]);
    const guild = messageInstance.guild

    if (messageInstance.author.id === adversaryId) {
        let embed = createEmbedAlert(
            'Você não pode jogar com você mesmo espertão :clown:',
            'Para verificar os comandos digite **-ttt help**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    if(!guild.member(adversaryId)) {
        let embed = createEmbedAlert(
            'Usuário inválido :clown:',
            'Mencione o usuário. Exemplo: **-ttt play @TioPatinhas**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

async function validateWhetherPlayersAlreadyHaveAnActivatedGame(idFirstPlayer, idSecondPlayer) {
    let firstHasAlreadyAGame = await getGameByPlayerId(idFirstPlayer);
    let secondHasAlreadyAGame = await getGameByPlayerId(idSecondPlayer);

    if (!verifyArrayIsEmpty(firstHasAlreadyAGame) || !verifyArrayIsEmpty(secondHasAlreadyAGame)) {
        let embed = createEmbedAlert(
            'Você já possui uma partida em andamento :clown:',
            'Para visualizar o jogo em andamento, envie **-ttt board**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

module.exports = { 
    validatePlayNewGame
}
