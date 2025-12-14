import Gameboard from './gameboard';
import { getRandomCoords } from './utils/getRandomCoords';

export default function computerPlayer() {
    const name = 'clanker';
    const gameboard = Gameboard();
    const board = gameboard.getBoard();

    const attack = (enemyBoard) => {
        let coords;
        let emptyBox = false;
        while (!emptyBox) {
            coords = getRandomCoords();

            const [row, col] = coords;
            const box = enemyBoard.getBoard()[row][col];

            if (box === 'null' || typeof box === 'object') {
                emptyBox = true;
            }
        }

        const attackResponse = enemyBoard.receiveAttack(coords);


        return attackResponse;
    };

    return { name, gameboard, board, attack };
}
