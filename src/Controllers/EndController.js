const { endGame, giveUpMatch } = require('../Services/GameService');

const MessengerService = require('../Services/MessengerService');

async function end(messageInstance) {
  let gameDoesNotOver = await endGame(messageInstance);

  if (gameDoesNotOver) {
    return;
  }

  const messenger = new MessengerService(messageInstance);
  const messageTitle = "Você está desistindo da partida!";
  const descriptionTitle =
    "Você tem certeza?\n" +
    "Ao desistir o adversário irá receber a pontuação automaticamente!";

  messenger
    .sendEmbedMessageToGuild(messageTitle, descriptionTitle)
    .then(async (message) => {
      await message.react("✅").then(() => message.react("⛔"));

      message
        .awaitReactions(
          (reaction, user) =>
            user.id == messageInstance.author.id &&
            (reaction.emoji.name == "✅" || reaction.emoji.name == "⛔"),
          { max: 1, time: 30000 }
        )
        .then(async (collected) => {
          const messenger = new MessengerService(message);

          message.delete();

          if (collected.first().emoji.name == "✅") {
            await giveUpMatch(messageInstance.author.id);

            const firstPlayerMention = `<@!${messageInstance.author.id}>`;

            const messageTitle = "Você desistiu da partida!";
            const messageDescription =
              `Não teve como, o jogador ${firstPlayerMention} desistiu da partida.\n` +
              "Ficou com medinho foi? :clown:";

            messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);

            return;
          }
          const messageTitle = "Você não desistiu da partida!";
          const messageDescription =
            "Achou que eu iria desistir? Achou erraaado otário!\n" +
            "Segue o jogo!";

          messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);
        })
        .catch(async () => {
          const messenger = new MessengerService(message);

          message.delete();

          const messageTitle = "Acabou o tempo de desistencia.";
          const messageDescription =
            "O tempo passou e você não desistiu, então segue o jogo!";

          messenger.sendEmbedMessageToGuild(messageTitle, messageDescription);
        });
    });
}

module.exports = { end }