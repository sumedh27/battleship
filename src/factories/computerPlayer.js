import { transform } from '@babel/core';
import Gameboard from './gameboard';
import { getRandomCoords } from './utils/getRandomCoords';

export default function computerPlayer() {
    const name = 'clanker';
    const gameboard = Gameboard();
    const board = gameboard.getBoard();

    let shipFound = new Map();
    let prevAttack = { coords: null, hit: null };

    const directions = {
        up: {
            transformCoords: (coords) => [coords[0] - 1, [coords[1]]],
            oppositeDir: 'down',
        },
        right: {
            transformCoords: (coords) => [coords[0], coords[1] + 1],
            oppositeDir: 'left',
        },
        down: {
            transformCoords: (coords) => [coords[0] + 1, coords[1]],
            oppositeDir: 'up',
        },
        left: {
            transformCoords: (coords) => [coords[0], coords[1] - 1],
            oppositeDir: 'right',
        },
    };

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
