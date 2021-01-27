let algorithm = '';
let currentTutPage = 1;
$(document).ready(() => {
    initialize();
    addEventListeners();

    $('#backtracking-maze').click(() => {
        if (!running) {
            running = true;
            toggleButtons();
            clearBoard();
            setMaze();
        }
    });
    $('#random-maze').click(() => {
        if (!running) {
            running = true;
            toggleButtons();
            clearBoard();
            setNoise();
        }
    });
    $('#random-weighted-maze').click(() => {
        if (!running) {
            running = true;
            toggleButtons();
            clearBoard();
            setNoise(weighted = true);
        }
    });
    $('#dijkstra').click(() => {
        algorithm = 'dijkstra';
        $('#start').text('Visualize Dijkstra\'s');
    });
    $('#astar').click(() => {
        algorithm = 'astar';
        $('#start').text('Visualize A* Search');
    });
    $('#bfs').click(() => {
        algorithm = 'bfs';
        clearWeights();
        $('#start').text('Visualize BFS Search');
    });
    $('#dfs').click(() => {
        algorithm = 'dfs';
        clearWeights();
        $('#start').text('Visualize DFS Search');
    });
    $('#start').click(() => {
        toggleButtons();
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
            case 'bfs':
                if (!running) {
                    clearWeights();
                    clearPath();
                    bfs();
                }
                break;
            case 'dfs':
                if (!running) {
                    clearWeights();
                    clearPath();
                    dfs();
                }
                break;
            default: break;
        }
    });
    $('#clear-board').click(() => {
        if (!running) {
            clearBoard();
        }
    });
    $('#clear-path').click(() => {
        if (!running) {
            clearPath();
        }
    });
    $('#clear-weights').click(() => {
        if (!running) {
            clearWeights();
        }
    });
    $('#skip-tutorial').click(() => {
        $('.tutorial').css('display', 'none');
    });
    $('#view-tutorial').click(() => {
        $('.tutorial').css('display', 'block');
    });
    $('#tut-page1').click(() => {
        currentTutPage = 1;
        $('#tutorial > div').css('display', 'none');
        $('#tutorial #page1').css('display', 'block');
        $('#tutorial nav button').removeClass('active');
        $('#tutorial nav button#tut-page1').addClass('active');
        $('#skip-tutorial').text('Skip tutorial');
    });
    $('#tut-page2').click(() => {
        currentTutPage = 1;
        $('#tutorial > div').css('display', 'none');
        $('#tutorial #page2').css('display', 'block');
        $('#tutorial nav button').removeClass('active');
        $('#tutorial nav button#tut-page2').addClass('active');
        $('#skip-tutorial').text('Skip tutorial');
    });
    $('#tut-page3').click(() => {
        currentTutPage = 1;
        $('#tutorial > div').css('display', 'none');
        $('#tutorial #page3').css('display', 'block');
        $('#tutorial nav button').removeClass('active');
        $('#tutorial nav button#tut-page3').addClass('active');
        $('#skip-tutorial').text('Skip tutorial');
    });
    $('#tut-page4').click(() => {
        currentTutPage = 1;
        $('#tutorial > div').css('display', 'none');
        $('#tutorial #page4').css('display', 'block');
        $('#tutorial nav button').removeClass('active');
        $('#tutorial nav button#tut-page4').addClass('active');
        $('#skip-tutorial').text('Skip tutorial');
    });
    $('#tut-page5').click(() => {
        currentTutPage = 1;
        $('#tutorial > div').css('display', 'none');
        $('#tutorial #page5').css('display', 'block');
        $('#tutorial nav button').removeClass('active');
        $('#tutorial nav button#tut-page5').addClass('active');
        $('#skip-tutorial').text('Skip tutorial');
    });
    $('#tut-page6').click(() => {
        currentTutPage = 1;
        $('#tutorial > div').css('display', 'none');
        $('#tutorial #page6').css('display', 'block');
        $('#tutorial nav button').removeClass('active');
        $('#tutorial nav button#tut-page6').addClass('active');
        $('#skip-tutorial').text('End tutorial');
    });

});

const toggleButtons = () => {
    $('#clear-path').toggleClass('disabled');
    $('#clear-board').toggleClass('disabled');
    $('#clear-weights').toggleClass('disabled');
    $('#start').toggleClass('disabled');
    $('#pathfinding-algo').toggleClass('disabled');
    $('#mazegeneration-algo').toggleClass('disabled');
}