const { MessageEmbed } = require('discord.js');

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

module.exports = { 
    getArgumentsByDiscordMessage, 
    createEmbedAlert, 
    formatAdversaryId,
    verifyArrayIsEmpty
}