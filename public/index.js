import Board from './Board.js';

$(document).ready(() => {
    const board = new Board('#board', 25);
    board.initialize();
    board.addEventListeners();
});