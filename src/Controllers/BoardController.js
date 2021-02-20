const { getBoard } = require('../Services/BoardService')

const MessengerService = require('../Services/MessengerService');

async function board (messageInstance) {
    let board = await getBoard(messageInstance);

    if(!board) {
        return;
    }

    const messenger = new MessengerService(messageInstance);

    messenger.sendReplyToGuild('o tabuleiro está assim!');
    messenger.sendSimpleMessageToGuild(board);
}

module.exports = { board }