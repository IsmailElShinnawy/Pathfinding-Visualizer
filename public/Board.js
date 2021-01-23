const size = 25;
const cells = []; //0 -> empty, 1 -> wall, 2 -> weight, 3 -> start, 4 -> end
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