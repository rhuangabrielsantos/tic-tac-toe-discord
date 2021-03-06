const { MessageEmbed } = require('discord.js');
const { marks } = require('./Models/Enum/CellEnum');

const getArgumentsByDiscordMessage = message => {
    const commandBody = message.content.split(' ');

    commandBody.shift();

    return {
        'command': commandBody[0],
        'action': commandBody.slice(1)
    }
}

function createEmbedAlert(title, description) {
    const logo = 'https://cdn.discordapp.com/app-icons/787531206619037736/66096ebede1d6464b43e6afa657cdc8c.png?size=256';

    return new MessageEmbed()
            .setAuthor('TicTacToe', logo, 'https://github.com/rhuangabrielsantos/tic-tac-toe-discord')
            .setTitle(title)
            .setTimestamp()
            .setColor(0xff0000)
            .setDescription(description);
}

function createEmbedHelp(title, description) {
    return new MessageEmbed()
            .setTitle(title)
            .setColor('#f5f542')
            .setDescription(description);
}

function getIdByPlayerMention(mention) {
    if(!mention) {
        return null;
    }

    return mention.replace(/<@!(\d+)>/, (regexMath, idNumber) => {
        return idNumber;
    });
}

function verifyArrayIsEmpty(array) {
    return (array.length === 0);
}

function getFirstValueInTheArray(array) {
    return array[0];
}

function getPlayerNumber(playerGame, idPlayer) {
    if (idPlayer === playerGame.first_player) {
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
    createEmbedHelp,
    getIdByPlayerMention,
    verifyArrayIsEmpty,
    getFirstValueInTheArray,
    getPlayerNumber,
    getPlayersMarkings,
    getIdPlayerByMessage
}