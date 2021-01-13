class MessageService {
    static sendMessageToGuild(messageInstance, message) {
        messageInstance.channel.send(message);
    }

    static sendReplyToGuild(messageInstance, message) {
        messageInstance.reply(message);
    }
}

module.exports = MessageService;