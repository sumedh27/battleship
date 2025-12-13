export default function spawnShips(cells, board, hidden = false) {
    cells.forEach((cell) => {
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);
        let box = board[row][col];

        cell.className = 'cell';
        if (!hidden && typeof box === 'object') {
            cell.classList.add('ship');
        }
        if (box === 'X') {
            cell.classList.add('hit');
            cell.textContent = 'X';
        }
        if (box === '-') {
            cell.classList.add('miss');
            cell.textContent = '-';
        }
    });
}
