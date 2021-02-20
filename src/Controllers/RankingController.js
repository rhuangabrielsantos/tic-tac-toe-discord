const { generateRanking } = require('../Services/RankingService');

async function ranking(message) {
    await generateRanking(message);
}

module.exports={ ranking }