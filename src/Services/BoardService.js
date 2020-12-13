const { cell } = require('../Models/Enum/CellEnum');

function generateEmptyBoard() {
    let view = ':blue_square::one::two::three::blue_square:\n' +
        ':regional_indicator_a::white_large_square::white_large_square::white_large_square::regional_indicator_a:\n' +
        ':regional_indicator_b::white_large_square::white_large_square::white_large_square::regional_indicator_b:\n' +
        ':regional_indicator_c::white_large_square::white_large_square::white_large_square::regional_indicator_c:\n' +
        ':blue_square::one::two::three::blue_square:';

    let markings = [0,0,0,0,0,0,0,0,0];

    return {
        view,
        markings
    }
}

function refreshBoard(markings, playerNumber, typedCell) {
    let boardPosition = cell[typedCell];

    markings[boardPosition] = playerNumber;

    let view = generateBoardView(markings);

    return {
        view,
        markings
    }
}

function generateBoardView(markedBoard) {
    let board = ':blue_square::one::two::three::blue_square:\n:regional_indicator_a:';
    let number = 0;

    for(number; number < 3; number++) {
        board += createCell(markedBoard[number])
    }

    board += ':regional_indicator_a:\n:regional_indicator_b:'
    
    for(number; number < 6; number++) {
        board += createCell(markedBoard[number])
    }

    board += ':regional_indicator_b:\n:regional_indicator_c:'
    
    for(number; number < 9; number++) {
        board += createCell(markedBoard[number])
    }

    board += ':regional_indicator_c:\n:blue_square::one::two::three::blue_square:';

    return board;
}

function createCell(mark) {
    if (mark === 1) {
        return ':negative_squared_cross_mark:'
    }

    if (mark === 2) {
        return ':o2:'
    }

    return ':white_large_square:'
}

module.exports = { 
    generateEmptyBoard,
    generateBoardView,
    refreshBoard
}
