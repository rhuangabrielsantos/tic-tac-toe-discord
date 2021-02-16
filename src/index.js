require('dotenv').config();
require('./server');

const { Client } = require('discord.js');
const { getArgumentsByDiscordMessage } = require('./utils');
const { recordedCommands } = require('./Controllers/GameController');
const MessengerService = require('./Services/MessengerService');

const client = new Client();

client.on('ready', () => {
    client.user.setPresence({
        activity: {
            name: process.env.BOT_PREFIX + ' help',
            type: "PLAYING"
        }
    });
});

client.on('message', message => {
    if (message.author.not) return;
    if (!message.content.startsWith(process.env.BOT_PREFIX)) return;

    const messageArguments = getArgumentsByDiscordMessage(message);
    const commands = recordedCommands();
    const action = commands[messageArguments.command];

    if (action) {
        action(messageArguments.action, message);
        return;
    }

    const messenger = new MessengerService(message);

    const title = 'Comando não encontrado';
    const description = 'O comando inserido não foi encontrado, verifique se você digitou corretamente e envie novamente.\n' +
        'Para visualizar os comandos disponíveis, envie ``-t help`.';

    messenger.sendEmbedMessageToGuild(title, description);
});

client.login(process.env.BOT_TOKEN);