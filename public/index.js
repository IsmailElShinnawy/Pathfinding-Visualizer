$(document).ready(() => {
    initialize();
    addEventListeners();

    let algorithm = "";

    $('#backtracking-maze').click(() => {
        if (!running) {
            running = true;
            toggleButtons();
            clearWalls();
            setMaze();
        }
    });
    $('#random-maze').click(() => {
        if (!running) {
            running = true;
            toggleButtons();
            clearWalls();
            setNoise();
        }
    });
    $('#dijkstra').click(() => {
        algorithm = 'dijkstra';
        $('#start').text('Visualize Dijkstra\'s');
    });
    $('#astar').click(() => {
        algorithm = 'astar'
        $('#start').text('Visualize A* Search');
    });
    $('#start').click(() => {
        switch (algorithm) {
            case 'dijkstra':
                if (!running) {
                    clearPath();
                    dijkstra();
                }
                break;
            case 'astar':
                if (!running) {
                    clearPath();
                    astar();
                }
                break;
            default: break;
        }
    });
    $('#clear-board').click(() => {
        if (!running) {
            clearWalls();
        }
    });
    $('#clear-path').click(() => {
        if (!running) {
            clearPath();
        }
    });

});

const toggleButtons = () => {
    $('#clear-path').toggleClass('disabled');
    $('#clear-board').toggleClass('disabled');
    $('#start').toggleClass('disabled');
    $('#pathfinding-algo').toggleClass('disabled');
    $('#mazegeneration-algo').toggleClass('disabled');
}