const { MessageEmbed } = require('discord.js');
const { marks } = require('./Models/Enum/CellEnum')

const getArgumentsByDiscordMessage = message => {
    const commandBody = message.content.split(' ');

    commandBody.shift();

    return {
        'command': commandBody[0],
        'action': commandBody.slice(1)
    }
}

function createEmbedAlert(title, description) {
    return new MessageEmbed()
            .setTitle(title)
            .setColor(0xff0000)
            .setDescription(description);
}

function formatAdversaryId(adversaryMention) {
    if(!adversaryMention) {
        return;
    }

    return adversaryMention.replace('<@!', '').replace('>', '')
}

function verifyArrayIsEmpty(array) {
    return (array.length === 0);
}

function getFirstValueInTheArray(array) {
    return array[0];
}

function getPlayerNumber(playerGame, idPlayer) {
    if (parseInt(idPlayer) === playerGame.first_player) {
        return marks.X;
    }

    return marks.O;
}

function getPlayersMarkings(markings) {
    let firstPlayerMarks = [];
    let secondPlayerMarks = [];
    
    if (!markings) {
        return {
            firstPlayerMarks,
            secondPlayerMarks
        }
    }

    markings.forEach((mark, index) => {
        if(mark === marks.X) {
            firstPlayerMarks.push(index);
            return;
        }

        if(mark === marks.O) {
            secondPlayerMarks.push(index);
            return;
        }
    });

    return {
        firstPlayerMarks,
        secondPlayerMarks
    }
}

function getIdPlayerByMessage(messageInstance) {
    return messageInstance.author.id;
}

module.exports = { 
    getArgumentsByDiscordMessage, 
    createEmbedAlert, 
    formatAdversaryId,
    verifyArrayIsEmpty,
    getFirstValueInTheArray,
    getPlayerNumber,
    getPlayersMarkings,
    getIdPlayerByMessage
}