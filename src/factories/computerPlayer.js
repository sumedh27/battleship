import Gameboard from './gameboard';
import { getRandomCoords } from './utils/getRandomCoords';

export default function computerPlayer() {
    const name = 'clanker';
    const gameboard = Gameboard();
    const board = gameboard.getBoard();

    let shipFound = new Map();
    let prevAttack = { coords: null, hit: null };

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

        prevAttack.coords = coords;
        
        const attackResponse = enemyBoard.receiveAttack(coords);

        console.log(attackResponse);

        return attackResponse;
    };

    return { name, gameboard, board, attack };
}
