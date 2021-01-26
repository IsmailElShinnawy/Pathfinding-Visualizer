$(document).ready(() => {
    initialize();
    addEventListeners();

    $('button#backtracking-maze').click(() => {
        if (!running) {
            running = true;
            clearWalls();
            setMaze();
            animateMaze(0);
        }
    });
    $('button#random-maze').click(() => {
        if (!running) {
            running = true;
            clearWalls();
            setNoise();
            animateMaze(0);
        }
    });
    $('button#dij').click(() => {
        if (!running) {
            dijkstra();
        }
    });
    $('button#astar').click(() => {
        if (!running) {
            astar();
        }
    });
    $('button#clear-board').click(() => {
        if (!running) {
            clearWalls();
        }
    });

});

const animateMaze = (idx) => {
    setTimeout(() => {
        if (idx == cells.length * cells[0].length) {
            running = false;
            return;
        }
        if (cells[Math.floor(idx / cols)][idx % cols] == 1) {
            $(`td[id=${Math.floor(idx / cols)}-${idx % cols}]`).addClass('wall');
        }
        animateMaze(idx + 1);
    }, 0);
}