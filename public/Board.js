const size = 23;
const cells = []; //0 -> empty, 1 -> wall, 2 -> weight, 3 -> start, 4 -> end, 5 -> visited, 6 -> path
const visited = [];
const rows = Math.floor(($(window).height() - 300) / size);
const cols = Math.floor($(window).width() / size);
let running = false;

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
            }
        }
    }
    const startId = $('td.start').attr('id');
    const endId = $('td.end').attr('id');
    $('td').each((idx, item) => {
        if ($(item).attr('id') === startId) {
            $(item).attr('class', 'start');
        } else if ($(item).attr('id') === endId) {
            $(item).attr('class', 'end');
        } else {
            $(item).attr('class', '');
        }
    });
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

const setNoise = () => {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < cols; ++c) {
            if (cells[r][c] != 3 && cells[r][c] != 4 && Math.random() < 0.3)
                cells[r][c] = 1;
        }
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

const dijkstra = () => {
    running = true;
    const startId = $('td[class=start]').attr('id').split('-');
    const endId = $('td[class=end]').attr('id').split('-');
    const startIdx = get1DIdx(parseInt(startId[0]), parseInt(startId[1]));
    const endIdx = get1DIdx(parseInt(endId[0]), parseInt(endId[1]));
    const dis = new Array(rows * cols);
    const visited = new Array(rows * cols);
    const prev = new Array(rows * cols);
    for (let i = 0; i < dis.length; ++i) {
        dis[i] = 1e9;
        visited[i] = false;
        prev[i] = i;
    }
    // const pq = new PriorityQueue();
    const tmp = [];
    // pq.push({ idx: startIdx, weight: 0 });
    tmp.push({ idx: startIdx, weight: 0 });
    dis[startIdx] = 0;
    dijkstraHelper(tmp, endIdx, dis, visited, prev);
    // while (!pq._isEmpty()) {
    // while (tmp.length != 0) {
    // }
}
const dijkstraHelper = (tmp, endIdx, dis, visited, prev) => {
    setTimeout(() => {
        if (tmp.length == 0) {
            console.log('no path');
            running = false;
            return;
        }
        let minIdx = 0;
        tmp.forEach((item, i) => {
            if (item.weight < tmp[minIdx].weight) {
                minIdx = i;
            }
        });
        // const current = pq.pop();
        const current = tmp.splice(minIdx, 1)[0];
        if (visited[current.idx]) {
            dijkstraHelper(tmp, endIdx, dis, visited, prev);
            return;
        };
        visited[current.idx] = true;
        const row = Math.floor(current.idx / cols);
        const col = current.idx % cols;
        $(`td[id=${row}-${col}]`).addClass('visited');
        if (current.idx == endIdx) {
            console.log(`found a path of ${dis[endIdx]} nodes`);
            animatePath(prev, current.idx);
            return;
        }
        if (row > 0 && cells[row - 1][col] != 1 && dis[get1DIdx(row - 1, col)] > dis[current.idx] + 1) {
            dis[get1DIdx(row - 1, col)] = dis[current.idx] + 1;
            prev[get1DIdx(row - 1, col)] = current.idx;
            // pq.push({ idx: get1DIdx(row - 1, col), weight: dis[get1DIdx(row - 1, col)] });
            tmp.push({ idx: get1DIdx(row - 1, col), weight: dis[get1DIdx(row - 1, col)] });
        }
        if (col < cols - 1 && cells[row][col + 1] != 1 && dis[get1DIdx(row, col + 1)] > dis[current.idx] + 1) {
            dis[get1DIdx(row, col + 1)] = dis[current.idx] + 1;
            prev[get1DIdx(row, col + 1)] = current.idx;
            // pq.push({ idx: get1DIdx(row, col + 1), weight: dis[get1DIdx(row, col + 1)] });
            tmp.push({ idx: get1DIdx(row, col + 1), weight: dis[get1DIdx(row, col + 1)] });

        }
        if (row < rows - 1 && cells[row + 1][col] != 1 && dis[get1DIdx(row + 1, col)] > dis[current.idx] + 1) {
            dis[get1DIdx(row + 1, col)] = dis[current.idx] + 1;
            prev[get1DIdx(row + 1, col)] = current.idx;
            // pq.push({ idx: get1DIdx(row + 1, col), weight: dis[get1DIdx(row + 1, col)] });
            tmp.push({ idx: get1DIdx(row + 1, col), weight: dis[get1DIdx(row + 1, col)] });
        }
        if (col > 0 && cells[row][col - 1] != 1 && dis[get1DIdx(row, col - 1)] > dis[current.idx] + 1) {
            dis[get1DIdx(row, col - 1)] = dis[current.idx] + 1;
            prev[get1DIdx(row, col - 1)] = current.idx;
            // pq.push({ idx: get1DIdx(row, col - 1), weight: dis[get1DIdx(row, col - 1)] });
            tmp.push({ idx: get1DIdx(row, col - 1), weight: dis[get1DIdx(row, col - 1)] });
        }
        dijkstraHelper(tmp, endIdx, dis, visited, prev);
    }, 20);
}

const astar = () => {
    running = true;
    const startId = $('td[class=start]').attr('id').split('-');
    const endId = $('td[class=end]').attr('id').split('-');
    const startIdx = get1DIdx(parseInt(startId[0]), parseInt(startId[1]));
    const startR = parseInt(startId[0]);
    const startC = parseInt(startId[1]);
    const endIdx = get1DIdx(parseInt(endId[0]), parseInt(endId[1]));
    const endR = parseInt(endId[0]);
    const endC = parseInt(endId[1]);
    const fScore = new Array(rows * cols);
    const gScore = new Array(rows * cols);
    const prev = new Array(rows * cols);
    for (let i = 0; i < fScore.length; ++i) {
        fScore[i] = 1e9;
        gScore[i] = 1e9;
        prev[i] = i;
    }

    // const pq = new PriorityQueue();
    const tmp = [];
    // pq.push({ idx: startIdx, weight: getManhattanDistance(startR, startC, endR, endC), gScore: 0 });
    tmp.push({ idx: startIdx, weight: getManhattanDistance(startR, startC, endR, endC) });
    fScore[startIdx] = getManhattanDistance(startR, startC, endR, endC);
    gScore[startIdx] = 0;

    // while (!pq._isEmpty()) {
    // while (tmp.length != 0) {

    // }
    astarHelper(tmp, endIdx, endR, endC, fScore, gScore, prev);
}

const astarHelper = (tmp, endIdx, endR, endC, fScore, gScore, prev) => {
    setTimeout(() => {
        if (tmp.length == 0) {
            running = false;
            return;
        }
        let minIdx = 0;
        tmp.forEach((item, i) => {
            if (fScore[item.idx] <= fScore[tmp[minIdx].idx]) {
                minIdx = i;
            }
        });
        // const current = pq.pop();
        const current = tmp.splice(minIdx, 1)[0];
        const row = Math.floor(current.idx / cols);
        const col = current.idx % cols;
        $(`td[id=${row}-${col}]`).addClass('visited');
        if (current.idx == endIdx) {
            console.log(`found a path of ${gScore[current.idx]} nodes`);
            animatePath(prev, current.idx);
            return;
        }
        const newGScore = gScore[current.idx] + 1;
        if (row > 0 && cells[row - 1][col] != 1 && gScore[get1DIdx(row - 1, col)] > newGScore) {
            gScore[get1DIdx(row - 1, col)] = newGScore;
            fScore[get1DIdx(row - 1, col)] = getManhattanDistance(row - 1, col, endR, endC) + newGScore;
            prev[get1DIdx(row - 1, col)] = current.idx;
            // pq.push({ idx: get1DIdx(row - 1, col), weight: fScore[get1DIdx(row - 1, col)], gScore: newGScore });
            if (!tmp.some(e => e.idx == get1DIdx(row - 1, col)))
                tmp.push({ idx: get1DIdx(row - 1, col), weight: fScore[get1DIdx(row - 1, col)] });
        }
        if (col < cols - 1 && cells[row][col + 1] != 1 && gScore[get1DIdx(row, col + 1)] > newGScore) {
            gScore[get1DIdx(row, col + 1)] = newGScore;
            fScore[get1DIdx(row, col + 1)] = getManhattanDistance(row, col + 1, endR, endC) + newGScore;
            prev[get1DIdx(row, col + 1)] = current.idx;
            // pq.push({ idx: get1DIdx(row, col + 1), weight: fScore[get1DIdx(row, col + 1)], gScore: newGScore });
            if (!tmp.some(e => e.idx == get1DIdx(row, col + 1)))
                tmp.push({ idx: get1DIdx(row, col + 1), weight: fScore[get1DIdx(row, col + 1)] });
        }
        if (row < rows - 1 && cells[row + 1][col] != 1 && gScore[get1DIdx(row + 1, col)] > newGScore) {
            gScore[get1DIdx(row + 1, col)] = newGScore;
            fScore[get1DIdx(row + 1, col)] = getManhattanDistance(row + 1, col, endR, endC) + newGScore;
            prev[get1DIdx(row + 1, col)] = current.idx;
            // pq.push({ idx: get1DIdx(row + 1, col), weight: fScore[get1DIdx(row + 1, col)], gScore: newGScore });
            if (!tmp.some(e => e.idx == get1DIdx(row + 1, col)))
                tmp.push({ idx: get1DIdx(row + 1, col), weight: fScore[get1DIdx(row + 1, col)] });
        }
        if (col > 0 && cells[row][col - 1] != 1 && gScore[get1DIdx(row, col - 1)] > newGScore) {
            gScore[get1DIdx(row, col - 1)] = newGScore;
            fScore[get1DIdx(row, col - 1)] = getManhattanDistance(row, col - 1, endR, endC) + newGScore;
            prev[get1DIdx(row, col - 1)] = current.idx;
            // pq.push({ idx: get1DIdx(row, col - 1), weight: fScore[get1DIdx(row, col - 1)], gScore: newGScore });
            if (!tmp.some(e => e.idx == get1DIdx(row, col - 1)))
                tmp.push({ idx: get1DIdx(row, col - 1), weight: fScore[get1DIdx(row, col - 1)] });
        }
        astarHelper(tmp, endIdx, endR, endC, fScore, gScore, prev);
    }, 20);

}

const animatePath = (prev, end) => {
    const stack = [];
    let current = end;
    while (prev[current] != current) {
        stack.push(current);
        current = prev[current];
    }
    stack.push(current);
    animatePathHelper(stack);
}

const animatePathHelper = (stack) => {
    setTimeout(() => {
        if (stack.length == 0) {
            running = false;
            return;
        }
        const current = stack.pop();
        const row = Math.floor(current / cols);
        const col = current % cols;
        $(`td[id=${row}-${col}]`).addClass('path');
        animatePathHelper(stack);
    }, 50);

}

const addEventListeners = () => {
    let mouseDown = false;
    let selected = -1;
    $('td[id]').on({
        mousedown: (e) => {
            if (!running) {
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
            }
        },
        mouseup: (e) => {
            if (!running) {
                let id = $(e.target).attr('id').split('-');
                let row = id[0];
                let col = id[1];
                if (selected == 3 || selected == 4) {
                    $(e.target).removeClass('wall');
                    cells[row][col] = selected;
                }
                mouseDown = false;
                selected = -1;
            }
        },
        mouseenter: (e) => {
            if (!running) {
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
            }
        },
        mouseleave: (e) => {
            if (!running) {
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
        }
    });
}



//MISC functions & classes
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

const getManhattanDistance = (x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}