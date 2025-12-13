export default function createGrid(container, player) {
    player === 'computer' ? (player = 'computer') : player;
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${player}-cell`;
            cell.dataset.row = row;
            cell.dataset.col = col;
            container.appendChild(cell);
        }
    }
}
