require('dotenv').config();
require('./server');

const { Client } = require('discord.js');
const { getArgumentsByDiscordMessage } = require('./utils');
const { recordedCommands } = require('./Controllers/GameController');

const client = new Client();

client.on('message', message => {
    if (message.author.not) return;
    if (!message.content.startsWith("-ttt")) return;

    const arguments = getArgumentsByDiscordMessage(message);
    const commands = recordedCommands();
    const action = commands[arguments.command];

    if (action) {
        action(arguments.action, message);
    }
});

client.login(process.env.BOT_TOKEN);