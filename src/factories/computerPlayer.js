import Gameboard from './gameboard';
import { getRandomCoords } from './utils/getRandomCoords';

export default function computerPlayer() {
    const name = 'clanker';
    const gameboard = Gameboard();
    const board = gameboard.getBoard();

    const inRange = (row, col) => row >= 0 && row < 10 && col >= 0 && col < 10;

    const smartComp = (row, col, board) => {
        const smartCoords = [
            [-1, 0], // 0 1
            [0, 1], // 1 2
            [1, 0], // 2 1
            [0, -1], // 1 0
        ];

        for (let i = 0; i < smartCoords.length; i++) {
            const [smartRow, smartCol] = smartCoords[i];

            if (inRange(row + smartRow, col + smartCol)) {
                if (board[row + smartRow][col + smartCol] === 'X') {
                    return true;
                }
            }
        }
        return false;
    };

    const findMoves = (enemyBoard) => {
        const board = enemyBoard.getBoard();

        const isAttackValid = (row, col) =>
            board[row][col] !== 'X' && board[row][col] !== '-';

        const moves = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                if (isAttackValid(row, col)) {
                    if (smartComp(row, col, board)) {
                        return [[row, col]];
                    }
                    moves.push([row, col]);
                }
            }
        }
        return moves;
    };

    const compPlayer = {
        name,
        gameboard,
        board,
        findMoves(board) {
            return findMoves(board);
        },
        attack(enemyBoard) {
            const moves = compPlayer.findMoves(enemyBoard);

            const randomMove = Math.floor(Math.random() * moves.length);

            if (moves.length === 1) {
                return enemyBoard.receiveAttack(moves[0]);
            }

            return enemyBoard.receiveAttack(moves[randomMove]);
        },
    };

    return compPlayer;
}
