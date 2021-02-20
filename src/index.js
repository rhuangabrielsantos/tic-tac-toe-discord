require('dotenv').config();
require('./server');

const { Client } = require('discord.js');
const { handleCommand } = require('./Controllers/CommandManagerController');

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

    handleCommand(message);
});

client.login(process.env.BOT_TOKEN);