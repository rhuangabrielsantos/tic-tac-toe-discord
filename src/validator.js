const { MessageMentions } = require('discord.js')
const { createEmbedAlert, formatAdversaryId } = require('./helper');

function validateSecondPlayerNull(action, message) {
    if (action.length === 0) {
        let embed = createEmbedAlert(
            'Você precisa informar o jogador adversário :clown:',
            'Para verificar os comandos digite **-ttt help**'
        );

        message.channel.send(embed);
    }
}

function validateMoreThanOneAdversary(action, message) {
    if (action.length > 1) {
        let embed = createEmbedAlert(
            'Você deve informar apenas um adversário :clown:',
            'Para verificar os comandos digite **-ttt help**'
        );

        message.channel.send(embed);
    }
}

function validateAdversaryIsValid(action, message) {
    const adversaryId = formatAdversaryId(action[0]);
    const guild = message.guild

    if (message.author.id === adversaryId) {
        let embed = createEmbedAlert(
            'Você não pode jogar com você mesmo espertão :clown:',
            'Para verificar os comandos digite **-ttt help**'
        );

        message.channel.send(embed);
        return;
    }

    if(!guild.member(adversaryId)) {
        let embed = createEmbedAlert(
            'Usuário inválido :clown:',
            'Para verificar os comandos digite **-ttt help**'
        );

        message.channel.send(embed);
        return;
    }
}

module.exports = { 
    validateSecondPlayerNull, 
    validateMoreThanOneAdversary, 
    validateAdversaryIsValid 
}