const HelpService = require('../Services/HelpService');

function help (messageInstance, action) {
    const message = HelpService.createMessage(action[0]);

    messageInstance.channel.send(message);
}

module.exports = { help }