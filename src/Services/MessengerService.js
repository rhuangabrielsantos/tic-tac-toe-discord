const { MessageEmbed } = require("discord.js");

class MessengerService {
    constructor(messageInstance) {
        this.messageInstance = messageInstance;
    }

    sendEmbedMessageToGuild(title, description) {
        const logo = 'https://cdn.discordapp.com/app-icons/787531206619037736/66096ebede1d6464b43e6afa657cdc8c.png?size=256';

        const embed = new MessageEmbed()
            .setAuthor('TicTacToe', logo, 'https://github.com/rhuangabrielsantos/tic-tac-toe-discord')
            .setColor('#3262a8')
            .setTitle(title)
            .setTimestamp()
            .setDescription(description);

        return this.messageInstance.channel.send(embed);
    }

    sendSimpleMessageToGuild(messageDescription) {
        return this.messageInstance.channel.send(messageDescription);
    }

    sendReplyToGuild(messageDescription) {
        return this.messageInstance.reply(messageDescription);
    }
}

module.exports = MessengerService;