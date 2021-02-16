require('dotenv').config();
require('./server');

const { Client } = require('discord.js');
const { getArgumentsByDiscordMessage } = require('./utils');
const { recordedCommands } = require('./Controllers/GameController');

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
    }
});

client.login(process.env.BOT_TOKEN);