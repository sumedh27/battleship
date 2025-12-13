import Gameboard from './gameboard';

export default function realPlayer() {
    const name = 'Joshua';
    const gameboard = Gameboard();
    const board = gameboard.getBoard();

    const attack = (enemyBoard, coords) => {
        const board = enemyBoard.getBoard();
        const [row, col] = coords;

        if (board[row][col] === 'X' || board[row][col] === '-') return;

        return enemyBoard.receiveAttack(coords);
    };

    return { name, gameboard, board, attack };
}
