require('dotenv').config();
require('./server');

const { Client } = require('discord.js');
const { getArgumentsByDiscordMessage } = require('./utils');
const { recordedCommands, acceptGame } = require('./Controllers/GameController');

const client = new Client();

client.on('message', message => {
    if (message.author.not) return;
    if (!message.content.startsWith(process.env.PREFIX)) return;

    const arguments = getArgumentsByDiscordMessage(message);
    const commands = recordedCommands();
    const action = commands[arguments.command];

    if (action) {
        action(arguments.action, message);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot === true) return;

    await acceptGame(client, reaction, user)
});

client.login(process.env.BOT_TOKEN);