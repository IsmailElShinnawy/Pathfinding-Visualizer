$(document).ready(() => {
    initialize();
    addEventListeners();

    $('button#generate-maze').click(() => {
        clearWalls();
        setMaze();
        animateMazeBorder(0);
    });
    $('button#dij').click(() => {
        dij();
    });
    $('button#astar').click(() => {
        astar();
    });
    $('button#clear-board').click(() => {
        clearWalls();
    });

});

const animateMazeBorder = (idx) => {
    setTimeout(() => {
        if (idx == cells.length * cells[0].length) {
            return;
        }
        if (cells[Math.floor(idx / cols)][idx % cols] == 1) {
            $(`td[id=${Math.floor(idx / cols)}-${idx % cols}]`).addClass('wall');
        }
        animateMazeBorder(idx + 1);
    }, 0);
}