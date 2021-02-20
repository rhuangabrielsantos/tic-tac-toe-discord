const { play } = require('./PlayController');
const { mark } = require('./MarkController');
const { end } = require('./EndController');
const { board } = require('./BoardController');
const { ranking } = require('./RankingController');
const { help } = require('./HelpController');

const MessengerService = require('../Services/MessengerService');
const { getArgumentsByDiscordMessage } = require('../utils');

const recordedCommands = {
    play,
    mark,
    board,
    help,
    end,
    ranking
}

const title = 'Comando não encontrado';
const description = 'O comando inserido não foi encontrado, verifique se você digitou corretamente e envie novamente.\n' +
        'Para visualizar os comandos disponíveis, envie ``-t help`.';

function handleCommand(message) {
    const messageArguments = getArgumentsByDiscordMessage(message);
    const action = recordedCommands[messageArguments.command];

    if (action) {
        action(message, messageArguments.action);
        return;
    }

    const messenger = new MessengerService(message);
    messenger.sendEmbedMessageToGuild(title, description);
}

module.exports = { handleCommand }
