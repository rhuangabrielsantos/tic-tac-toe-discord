const { winningCombinations, marks } = require("../Models/Enum/CellEnum");
const { getPlayersMarkings, verifyArrayIsEmpty, createEmbedAlert } = require("../utils");

const ERROR = 1;

function verifyIfHasAWinner(markings) {
    let playersMarkings = getPlayersMarkings(markings);

    let firstPlayerMarks = playersMarkings.firstPlayerMarks;
    let secondPlayerMarks = playersMarkings.secondPlayerMarks;

    let winner = 0;

    winningCombinations.map(combination => {
        let xIsWinner = 0;
        let oIsWinner = 0;

        combination.map(value => {
            if (firstPlayerMarks.indexOf(value) > -1) {
                xIsWinner++;
                return;
            }

            if (secondPlayerMarks.indexOf(value) > -1) {
                oIsWinner++;
                return;
            }
        });

        if (xIsWinner === 3) {
            winner = marks.X;
            return;
        }

        if (oIsWinner == 3) {
            winner = marks.O
            return;
        }
    });

    return winner;
}

function verifyIfIsBoardFull(markings) {
    let isBoardFull = true;
    
    markings.forEach(mark => {
        if(mark === 0) {
            isBoardFull = false;
        }
    });

    return isBoardFull;
}

function validateIfPlayerHasActiveGame(playerGame) {
    if (verifyArrayIsEmpty(playerGame)) {        
        let embed = createEmbedAlert(
            'Você deve ter um jogo ativo para enviar esse comando, espertão :clown:',
            'Para visualizar o jogo existente, envie **' + process.env.PREFIX + ' board**'
        );

        return {
            error: ERROR,
            message: embed
        };
    }

    return {};
}

module.exports = {
    verifyIfHasAWinner,
    verifyIfIsBoardFull, 
    validateIfPlayerHasActiveGame
}