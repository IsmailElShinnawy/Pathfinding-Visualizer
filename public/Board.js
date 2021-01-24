const size = 25;
const cells = []; //0 -> empty, 1 -> wall, 2 -> weight, 3 -> start, 4 -> end
const visited = [];
const rows = Math.floor(($(window).height() - 300) / size);
const cols = Math.floor($(window).width() / size);

const initialize = () => {
    $('div#board').html('<table id="board" style="border-collapse: collapse"></table>');
    let tableHTML = '';
    for (let r = 0; r < rows; ++r) {
        tableHTML += `<tr id=\"${r}\">`;
        cells[r] = [];
        for (let c = 0; c < cols; ++c) {
            if (r == Math.floor(rows / 2) && c == Math.floor(cols / 4)) {
                tableHTML += `<td id=\"${r}-${c}\" class="start" width="${size}px" height="${size}px"></td>`;
                cells[r][c] = 3;
            } else if (r == Math.floor(rows / 2) && c == Math.floor(3 * cols / 4)) {
                tableHTML += `<td id=\"${r}-${c}\" class="end" width="${size}px" height="${size}px"></td>`;
                cells[r][c] = 4;
            } else {
                tableHTML += `<td id=\"${r}-${c}\" class width="${size}px" height="${size}px"></td>`;
                cells[r][c] = 0;
            }
        }
        tableHTML += '</tr>';
    }
    $('table#board').html(tableHTML);
}

const clearWalls = () => {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < cols; ++c) {
            if (cells[r][c] == 1) {
                cells[r][c] = 0;
                $(`td[id=${r}-${c}]`).removeClass('wall');
            }
        }
    }
}

const setBorders = () => {
    for (let c = 0; c < cells[0].length; ++c) {
        if (cells[0][c] != 3 && cells[0][c] != 4)
            cells[0][c] = 1;
    }
    for (let c = 0; c < cells[cells.length - 1].length; ++c) {
        if (cells[cells.length - 1][c] != 3 && cells[cells.length - 1][c] != 4)
            cells[cells.length - 1][c] = 1;
    }
    for (let r = 1; r < cells.length - 1; ++r) {
        if (cells[r][0] != 3 && cells[r][0] != 4)
            cells[r][0] = 1;
    }
    for (let r = 1; r < cells.length - 1; ++r) {
        if (cells[r][cells[r].length - 1] != 3 && cells[r][cells[r].length - 1] != 4)
            cells[r][cells[r].length - 1] = 1;
    }
}

const setGrid = () => {
    for (let r = 1; r < rows - 1; ++r) {
        for (let c = 1; c < cols - 1; ++c) {
            if (cells[r][c] != 3 && cells[r][c] != 4) {
                if (r % 2 == 0 || c % 2 == 0) {
                    cells[r][c] = 1;
                }
            }
        }
    }
}

const setMaze = () => {
    setBorders();
    setGrid();
    for (let r = 0; r < rows; ++r) {
        visited[r] = [];
        for (let c = 0; c < cols; ++c) {
            visited[r][c] = false;
        }
    }
    generateMaze(cols + 1);
}

const generateMaze = (idx) => {
    const neighbors = [];
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    visited[row][col] = true;
    if (col > 1) {
        if (cells[row][col - 2] != 1 && !visited[row][col - 2]) {
            neighbors.push(get1DIdx(row, col - 2));
        }
    }
    if (col < cols - 2) {
        if (cells[row][col + 2] != 1 && !visited[row][col + 2]) {
            neighbors.push(get1DIdx(row, col + 2));
        }
    }
    if (row > 1) {
        if (cells[row - 2][col] != 1 && !visited[row - 2][col]) {
            neighbors.push(get1DIdx(row - 2, col));
        }
    }
    if (row < rows - 2) {
        if (cells[row + 2][col] != 1 && !visited[row + 2][col]) {
            neighbors.push(get1DIdx(row + 2, col));
        }
    }
    shuffleArray(neighbors);
    if (neighbors.length == 0) {
        return;
    } else {
        neighbors.forEach(neighbor => {
            if (!visited[Math.floor(neighbor / cols)][neighbor % cols]) {
                removeWallBetween(idx, neighbor);
                generateMaze(neighbor);
            }
        });
    }

}

const removeWallBetween = (idx1, idx2) => {
    const row1 = Math.floor(idx1 / cols);
    const row2 = Math.floor(idx2 / cols);
    const col1 = idx1 % cols;
    const col2 = idx2 % cols;
    if (col1 > col2) {
        if (cells[row1][col1 - 1] != 3 && cells[row1][col1 - 1] != 4)
            cells[row1][col1 - 1] = 0;
    } else if (col1 < col2) {
        if (cells[row1][col2 - 1] != 3 && cells[row1][col2 - 1] != 4)
            cells[row1][col2 - 1] = 0;
    } else if (row1 > row2) {
        if (cells[row1 - 1][col1] != 3 && cells[row1 - 1][col1] != 4)
            cells[row1 - 1][col1] = 0;
    } else if (row1 < row2) {
        if (cells[row2 - 1][col1] != 3 && cells[row2 - 1][col1] != 4)
            cells[row2 - 1][col1] = 0;
    }
}

const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const get1DIdx = (row, col) => {
    return row * cols + col;
}

const addEventListeners = () => {
    let mouseDown = false;
    let selected = -1;

    $('div#board').mouseleave(() => {
        mouseDown = false;
    });
    $('td[id]').on({
        mousedown: (e) => {
            mouseDown = true;
            let id = $(e.target).attr('id').split('-');
            let row = id[0];
            let col = id[1];
            selected = cells[row][col];
            let classList = $(e.target).attr('class').split(/\s+/);
            if (classList.length == 0 || (!classList.includes('start') && !classList.includes('end'))) {
                $(e.target).toggleClass('wall');
                cells[row][col] = $(e.target).hasClass('wall') ? 1 : 0;
            }
        },
        mouseup: (e) => {
            let id = $(e.target).attr('id').split('-');
            let row = id[0];
            let col = id[1];
            if (selected == 3 || selected == 4) {
                $(e.target).removeClass('wall');
                cells[row][col] = selected;
            }
            mouseDown = false;
            selected = -1;
        },
        mouseenter: (e) => {
            let id = $(e.target).attr('id').split('-');
            let row = id[0];
            let col = id[1];
            if (selected == 3) {
                $(e.target).addClass('start');
            } else if (selected == 4) {
                $(e.target).addClass('end');
            } else if (mouseDown) {
                let classList = $(e.target).attr('class').split(/\s+/);
                if (!classList.includes('start') && !classList.includes('end')) {
                    $(e.target).toggleClass('wall');
                    cells[row][col] = $(e.target).hasClass('wall') ? 1 : 0;
                }
            }
        },
        mouseleave: (e) => {
            let id = $(e.target).attr('id').split('-');
            let row = id[0];
            let col = id[1];
            let classList = $(e.target).attr('class').split(/\s+/);
            if (selected == 3) {
                $(e.target).removeClass('start');
                cells[row][col] = cells[row][col] == 3 ? 0 : cells[row][col];
            } else if (selected == 4) {
                $(e.target).removeClass('end');
                cells[row][col] = cells[row][col] == 4 ? 0 : cells[row][col];
            }
        }
    });
}