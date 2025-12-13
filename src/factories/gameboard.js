import Ship from './ship';
import { getRandomCoords } from './utils/getRandomCoords';

export default function Gameboard() {
    const ATTACK_HIT = 'X';
    const ATTACK_MISS = '-';

    let ships = [];

    let board = Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => 'null')
    );

    function getBoard() {
        return board;
    }

    function placeShipAt(row, col, ship) {
        if (row >= 10 || col >= 10) return false;
        if (typeof board[row][col] === 'object') return false;

        board[row][col] = ship;

        return true;
    }

    function spawnShipAt(coords, ship, axis = 'horizontal') {
        if (!ship || !ship.size) return false;
        const [row, col] = coords;
        if (row >= 10 || col >= 10) return false;
        if (axis === 'horizontal') {
            if (validHorizontal(row, col)) {
                ship.setCoords(coords, axis);
                for (let i = col; i < ship.size + col; i++) {
                    placeShipAt(row, i, ship);
                }
                ships.push(ship);
                return true;
            }
            return false;
        } else if (axis === 'vertical') {
            if (validVertical(row, col)) {
                ship.setCoords(coords, axis);
                for (let i = row; i < ship.size + row; i++) {
                    placeShipAt(i, col, ship);
                }
                ships.push(ship);
                return true;
            }
            return false;
        }

        function validHorizontal(row, col) {
            for (let i = col; i < ship.size + col; i++) {
                if (i >= board.length) return false;
                if (typeof board[row][i] === 'object') return false;
                if (!isAdjacentEmpty(row, i)) return false;
            }
            return true;
        }

        function validVertical(row, col) {
            for (let i = row; i < ship.size + row; i++) {
                if (i >= board.length) return false;
                if (typeof board[i][col] === 'object') return false;
                if (!isAdjacentEmpty(i, col)) return false;
            }
            return true;
        }

        return true;
    }

    function isAdjacentEmpty(row, col) {
        const ADJACENT_COORDS = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];
        let index = 0;
        while (index < ADJACENT_COORDS.length) {
            const adjCoords = ADJACENT_COORDS[index];

            const adjRow = row - adjCoords[0];
            const adjCol = col - adjCoords[1];
            if (
                adjRow >= board.length ||
                adjCol >= board.length ||
                adjRow < 0 ||
                adjCol < 0
            ) {
                index += 1;
                continue;
            }
            if (typeof board[adjRow][adjCol] === 'object') return false;

            index += 1;
        }

        return true;
    }

    function receiveAttack(coords) {
        const [row, col] = coords;
        if (row >= board.length || col >= board.length) return;

        if (typeof board[row][col] === 'object') {
            if (board[row][col].isSunk()) return;

            if (board[row][col].getHealth() === 1) {
                const coordinates = board[row][col].getCoords().coords;
                const axis = board[row][col].getCoords().axis;
                destroyAdjacentBoxes(coordinates, axis, board[row][col]);
            }

            board[row][col].hit();
            board[row][col] = ATTACK_HIT;

            return true;
        } else {
            board[row][col] = ATTACK_MISS;
            return false;
        }
    }

    function destroyAdjacentBoxes(coords, axis, ship) {
        const ADJACENT_COORDS = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ];

        const [row, col] = coords;

        if (axis === 'horizontal') {
            for (let i = col; i < ship.size + col; i++) {
                let index = 0;

                while (index < ADJACENT_COORDS.length) {
                    const adjCoords = ADJACENT_COORDS[index];

                    const adjRow = row - adjCoords[0];
                    const adjCol = i - adjCoords[1];
                    if (
                        adjRow >= board.length ||
                        adjCol >= board.length ||
                        adjRow < 0 ||
                        adjCol < 0
                    ) {
                        index += 1;
                        continue;
                    }
                    if (typeof board[adjRow][adjCol] === 'object') {
                        index += 1;
                        continue;
                    }

                    if (board[adjRow][adjCol] === 'null') {
                        board[adjRow][adjCol] = '-';
                    }

                    index += 1;
                }
            }
        }

        if (axis === 'vertical') {
            for (let i = row; i < ship.size + row; i++) {
                let index = 0;

                while (index < ADJACENT_COORDS.length) {
                    const adjCoords = ADJACENT_COORDS[index];
                    const adjRow = i - adjCoords[0];
                    const adjCol = col - adjCoords[1];
                    if (
                        adjRow >= board.length ||
                        adjCol >= board.length ||
                        adjRow < 0 ||
                        adjCol < 0
                    ) {
                        index += 1;
                        continue;
                    }
                    if (typeof board[adjRow][adjCol] === 'object') {
                        index += 1;
                    }

                    if (board[adjRow][adjCol] === 'null') {
                        board[adjRow][adjCol] = '-';
                    }
                    index += 1;
                }
            }
        }
    }

    function randomize(shipsToSpawn) {
        reset();
        shipsToSpawn.forEach((shipLen) => {
            const ship = Ship(shipLen);
            let coords, axis;
            let placed = false;

            while (!placed) {
                coords = getRandomCoords();
                axis = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                placed = spawnShipAt(coords, ship, axis);
            }
        });
    }

    function reset() {
        ships = [];
        board.forEach((row, rowIndex) =>
            row.forEach((col, colIndex) => (board[rowIndex][colIndex] = 'null'))
        );
    }

    function allShipsSunk() {
        return ships.every((ship) => ship.isSunk());
    }

    return {
        getBoard,
        spawnShipAt,
        placeShipAt,
        receiveAttack,
        allShipsSunk,
        reset,
        randomize,
        getShips: () => ships,
    };
}
