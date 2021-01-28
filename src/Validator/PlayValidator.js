const { createEmbedAlert, getIdByPlayerMention, verifyArrayIsEmpty } = require('../utils');
const { getGameByPlayerId } = require('../Repositories/PlayerRepository');

const ERROR = 1;

async function validatePlayNewGame(players, idFirstPlayer, idSecondPlayer, messageInstance) {
    let countError = 0;
    let message = [];
    let validations = [];

    validations.push(validateSecondPlayerNull(players));
    validations.push(validateMoreThanOneAdversary(players));
    validations.push(validateAdversaryIsValid(players, messageInstance));
    validations.push(validateAdversaryIsABot(messageInstance));
    validations.push(await validateWhetherPlayersAlreadyHaveAnActivatedGame(idFirstPlayer, idSecondPlayer));

    validations.forEach(validate => {
        if(validate.error === ERROR) {
            message.push(validate.message);
            countError += validate.error;
        }
    });

    if (countError >= ERROR) {
        messageInstance.channel.send(message.shift())
        return countError;
    }
}

function validateSecondPlayerNull(players) {
    if (players.length === 0) {
        let embed = createEmbedAlert(
            'Você precisa informar o jogador adversário :clown:',
            'Para verificar os comandos digite **' + process.env.PREFIX + ' help**'
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
            'Para verificar os comandos digite **' + process.env.PREFIX + ' help**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

function validateAdversaryIsValid(players, messageInstance) {
    const adversaryId = getIdByPlayerMention(players[0]);
    const guild = messageInstance.guild

    if (messageInstance.author.id === adversaryId) {
        let embed = createEmbedAlert(
            'Você não pode jogar com você mesmo espertão :clown:',
            'Para verificar os comandos digite **' + process.env.PREFIX + ' help**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    if(!guild.member(adversaryId)) {
        let embed = createEmbedAlert(
            'Usuário inválido :clown:',
            'Mencione o usuário. Exemplo: **' + process.env.PREFIX + ' play @TioPatinhas**'
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
            'Para visualizar o jogo em andamento, envie **' + process.env.PREFIX + ' board**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

function validateAdversaryIsABot(messageInstance) {
    const mentionedUsers = messageInstance.mentions.users;

    const userIsABot = mentionedUsers.map(user => {
        let embed = createEmbedAlert(
            'O usuário é um bot espertinho :clown:',
            'Você só pode jogar com pessoas reais'
        );

        if (user.bot === true) {
            return {
                error: 1,
                message: embed
            };
        }

        return {};
    })

    return userIsABot[0];
}

module.exports = { 
    validatePlayNewGame
}
