import Gameboard from './gameboard';
import { getRandomCoords } from './utils/getRandomCoords';

export default function computerPlayer() {
    const name = 'clanker';
    const gameboard = Gameboard();
    const board = gameboard.getBoard();

    let shipFound = new Map();
    let prevAttack = { coords: null, hit: null };

    const attack = (enemyBoard) => {
        const coords = getRandomBox(enemyBoard);

        const attackResponse = enemyBoard.receiveAttack(coords);

        prevAttack.coords = attackResponse.attackedCoord;
        prevAttack.hit = attackResponse.shipHit;

        console.log(prevAttack);

        return attackResponse;
    };

    function getRandomBox(enemyBoard) {
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
        return coords;
    }

    return { name, gameboard, board, attack };
}
