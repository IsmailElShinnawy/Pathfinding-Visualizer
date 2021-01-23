export default function Board(selector, size) {
    this.element = $(selector);
    this.size = size;

    this.initialize = () => {
        this.rows = Math.floor(($(window).height() - 300) / this.size);
        this.cols = Math.floor($(window).width() / this.size);
        this.element.html('<table id="board" style="border-collapse: collapse"></table>');
        let tableHTML = '';
        for (let r = 0; r < this.rows; ++r) {
            tableHTML += `<tr id=${r}>`;
            for (let c = 0; c < this.cols; ++c) {
                if (r == Math.floor(this.rows / 2) && c == Math.floor(this.cols / 4)) {
                    tableHTML += `<td id=${c} class="unvisited weightless start" width="${this.size}px" height="${this.size}px"><img src=\"icons/arrow.svg\" alt=\"Start point\"></td>`;
                } else if (r == Math.floor(this.rows / 2) && c == Math.floor(3 * this.cols / 4)) {
                    tableHTML += `<td id=${c} class="unvisited weightless end" width="${this.size}px" height="${this.size}px"><img src=\"icons/pin_point.svg\" alt=\"End point\"></td>`;
                } else {
                    tableHTML += `<td id=${c} class="unvisited weightless" width="${this.size}px" height="${this.size}px"></td>`;
                }
            }
            tableHTML += '</tr>';
        }
        $('table#board').html(tableHTML);
    }

    this.addEventListeners = () => {
        let mouseDown = false;
        $('div#board').mouseleave(() => {
            mouseDown = false;
        });

        $('tr[id] td[id]').on({
            mousedown: function () {
                mouseDown = true;
                $(this)
                    .toggleClass('wall')
            },
            mouseenter: function () {
                if (mouseDown) {
                    $(this)
                        .toggleClass('wall')
                }
            },
            mouseup: function () {
                mouseDown = false;
            }
        });
    }

}