const { createEmbedHelp } = require("../utils");

class HelpService {
    static createMessage(command) {
        if (!command) {
            return HelpService.default();
        }
        
        const registeredCommands = {
            'play': HelpService.play,
            'mark': HelpService.mark,
            'end': HelpService.end,
            'board': HelpService.board,
            'ranking': HelpService.ranking
        };

        if(!registeredCommands[command]) {
            return HelpService.error();
        }

        return registeredCommands[command]();
    }

    static play() {
        return createEmbedHelp('Comando play   :loudspeaker:', 
            '**Função**\n' + 
            'Usado para iniciar uma partida com outros jogadores.\n\n' +
            '**Descrição**\n' + 
            '- Este comando possui um contador de 30 segundos, se o adversário não aceitar a partida, ela será cancelada automaticamente.\n' +
            '- Para iniciar a partida você deve mencionar um usuário válido e não possuir uma partida em andamento.\n\n' +
            '**Exemplo**\n' + 
            '`' + process.env.BOT_PREFIX + ' play @rhuangabrielsantos`'
        );
    }

    static mark() {
        return createEmbedHelp('Comando mark   :pencil2:', 
            '**Função**\n' + 
            'Usado para marcar uma casa no tabuleiro.\n\n' +
            '**Descrição**\n' + 
            '- Para marcar a casa utilize letras maiúsculas conforme exemplo abaixo.\n' +
            '- Utilize as guias que estão em volta do tabuleiro, as linhas são as letras e as colunas são os numeros, para marcar a posição que está na primeira linha e primeira coluna, por exemplo, utilize A1.\n\n' +
            '**Exemplo**\n' + 
            '`' + process.env.BOT_PREFIX + ' mark B3`'
        );
    }

    static end() {
        return createEmbedHelp('Comando end   :rooster:', 
            '**Função**\n' + 
            'Usado para finalizar uma partida.\n\n' +
            '**Descrição**\n' + 
            '- Este comando finaliza a partida atual que o jogador possui e automaticamente marca ponto para o adversário, então pense bem se você realmente deseja desistir.\n\n' +
            '**Exemplo**\n' + 
            '`' + process.env.BOT_PREFIX + ' end`'
        );
    }

    static board() {
        return createEmbedHelp('Comando board   :mag:', 
            '**Função**\n' + 
            'Usado para visualizar o tabuleiro da partida que está em andamento.\n\n' +
            '**Descrição**\n' + 
            '- Você deve possuir um jogo ativo.\n' +
            '- Você pode utilizar este comando a qualquer momento durante o jogo.\n\n' +
            '**Exemplo**\n' + 
            '`' + process.env.BOT_PREFIX + ' board`'
        );
    }

    static ranking() {
        return createEmbedHelp('Comando ranking   :trophy:', 
            '**Função**\n' + 
            'Usado ver o ranking de vitórias dos jogadores.\n\n' +
            '**Descrição**\n' + 
            'Este comando lista os jogadores que possuem mais vitórias do servidor.\n\n' +
            '**Exemplo**\n' + 
            '`' + process.env.BOT_PREFIX + ' ranking`'
        );
    }

    static default() {
        return createEmbedHelp(':robot:  Comandos Tic Tac Toe  :robot:',
            'Adicione **' + process.env.BOT_PREFIX + '** antes de qualquer comando\n\n' +
            ':loudspeaker: `play [adversario]` - Inicia um novo jogo\n' +
            ':pencil2: `mark [posicao]` - Marca uma casa\n' +
            ':rooster: `end` - Termina uma partida\n' +
            ':mag: `board` - Exibe o tabuleiro\n' +
            ':trophy: `ranking` - Exibe o ranking do servidor\n\n' +
            'Para saber mais sobre um comando digite `' + process.env.BOT_PREFIX + ' help [nome_comando]`\n' +
            'Exemplo: `-t help play`\n\n' +
            'Desenvolvido por **@rhuangabrielsantos @anaclaudialimacosta**'
        )
    }

    static error() {
        return createEmbedHelp('Comando não encontrado   :pensive:', 
            '**Este comando não foi encontrado, verifique se você digitou corretamente e envie novamente**\n' + 
            'Para ver os comandos disponíveis envie `' + process.env.BOT_PREFIX + ' help`.\n\n'
        );
    }
}

module.exports = HelpService;