import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import Gameboard from '../factories/gameboard';
import Ship from '../factories/ship';

describe('Gameboard tests', () => {
    let ship, ship2, gameboard, board;

    beforeEach(() => {
        gameboard = Gameboard();
        ship = Ship(3);
        ship2 = Ship(4);
        board = gameboard.getBoard();
    });

    test('board has 10 rows and 10 columns', () => {
        expect(board.length).toEqual(10);
        expect(board[0].length).toEqual(10);
    });

    test('do not place a ship if the coords are out of bounds ', () => {
        expect(gameboard.placeShipAt(10, 1, ship)).toBeFalsy();
        expect(gameboard.placeShipAt(10, 1, ship)).not.toBeTruthy();
    });

    test('do not place a ship if a ship exists at the coords', () => {
        board[1][1] = ship;
        const placeShip = gameboard.placeShipAt(1, 1, ship);
        expect(placeShip).toBeFalsy();
        expect(placeShip).not.toBeTruthy();
    });

    test.skip('do not place a ship at coords if adjacent coords have a ship', () => {
        board[0][0] = ship;
        const placeShip = gameboard.placeShipAt(1, 1, ship);
        expect(placeShip).toBeFalsy();
        expect(placeShip).not.toBeTruthy();
    });

    test('place a ship at coords if adjacent coords are empty', () => {
        gameboard.placeShipAt(1, 1, ship);
        const shipAt = board[1][1];
        expect(shipAt.size).toEqual(3);
    });

    test('spawn horizontal ship at given coord', () => {
        gameboard.spawnShipAt([1, 1], ship);
        expect(typeof board[1][1] === 'object').toBeTruthy();
        expect(typeof board[1][2] === 'object').toBeTruthy();
        expect(typeof board[1][3] === 'object').toBeTruthy();
    });

    test('do not spawn horizontal ship if adjacent coord is not empty', () => {
        board[2][4] = ship;

        gameboard.spawnShipAt([1, 1], ship);

        expect(typeof board[2][4] === 'object').toBeTruthy();
        expect(typeof board[1][1] === 'object').toBeFalsy();
    });

    test('if other ship is at valid coord from current spawning ship, spawns the ship', () => {
        board[1][5] = ship;
        gameboard.spawnShipAt([1, 1], ship);

        expect(typeof board[1][1] === 'object').toBeTruthy();
        expect(typeof board[1][2] === 'object').toBeTruthy();
        expect(typeof board[1][3] === 'object').toBeTruthy();
    });

    test('do not spawn horizontal ship out of bounds', () => {
        gameboard.spawnShipAt([1, 8], ship);
        expect(typeof board[1][8] === 'object').toBeFalsy;
    });

    // FOR VERTICAL //

    test('spawn vertical ship at given coord', () => {
        gameboard.spawnShipAt([1, 1], ship, 'vertical');
        expect(typeof board[1][1] === 'object').toBeTruthy();
        expect(typeof board[2][1] === 'object').toBeTruthy();
        expect(typeof board[3][1] === 'object').toBeTruthy();
    });

    test('do not spawn vertical ship if adjacent coord is not empty', () => {
        board[3][2] = ship;

        gameboard.spawnShipAt([1, 1], ship, 'vertical');

        expect(typeof board[3][2] === 'object').toBeTruthy();
        expect(typeof board[1][1] === 'object').toBeFalsy();
    });

    test('if other ship is at valid coord from current spawning ship, spawns the ship', () => {
        board[3][3] = ship;
        gameboard.spawnShipAt([1, 1], ship, 'vertical');

        expect(typeof board[1][1] === 'object').toBeTruthy();
        expect(typeof board[2][1] === 'object').toBeTruthy();
        expect(typeof board[3][1] === 'object').toBeTruthy();
    });

    test('do not spawn vertical ship out of bounds', () => {
        gameboard.spawnShipAt([8, 1], ship, 'vertical');
        expect(typeof board[8][1] === 'object').toBeFalsy;
    });

    // RECEIVE ATTACK

    test('receive attack on the board at coords and mark it', () => {
        gameboard.spawnShipAt([4, 1], ship, 'vertical');
        expect(typeof board[4][1] === 'object').toBeTruthy();
        expect(typeof board[5][1] === 'object').toBeTruthy();
        expect(typeof board[6][1] === 'object').toBeTruthy();

        gameboard.receiveAttack([4, 1]);

        expect(board[4][1]).toBe('X');
        expect(typeof board[4][1] === 'object').toBeFalsy();
        expect(typeof board[5][1] === 'object').toBeTruthy();

        gameboard.receiveAttack([6, 1]);

        expect(board[4][1]).toBe('X');

        expect(typeof board[4][1] === 'object').toBeFalsy();
        expect(typeof board[5][1] === 'object').toBeTruthy();

        expect(board[6][1]).toBe('X');
    });

    test('mark - or miss on the board on missed attack', () => {
        gameboard.spawnShipAt([4, 1], ship, 'vertical');
        expect(typeof board[4][1] === 'object').toBeTruthy();
        expect(typeof board[5][1] === 'object').toBeTruthy();
        expect(typeof board[6][1] === 'object').toBeTruthy();

        gameboard.receiveAttack([4, 0]);

        expect(board[4][0]).toBe('-');
        expect(typeof board[4][1] === 'object').toBeTruthy();
    });

    // ALL SHIP SUNK

    test('sink the ship on attacks', () => {
        gameboard.spawnShipAt([4, 1], ship, 'vertical');
        expect(typeof board[4][1] === 'object').toBeTruthy();
        expect(typeof board[5][1] === 'object').toBeTruthy();
        expect(typeof board[6][1] === 'object').toBeTruthy();

        gameboard.receiveAttack([4, 1]);
        expect(board[4][1]).toBe('X');
        gameboard.receiveAttack([5, 1]);
        expect(board[5][1]).toBe('X');
        gameboard.receiveAttack([6, 1]);
        expect(board[6][1]).toBe('X');

        expect(gameboard.allShipsSunk()).toBeTruthy();
    });

    test('not sink all ships on lesser attacks', () => {
        gameboard.spawnShipAt([4, 1], ship, 'vertical');
        expect(typeof board[4][1] === 'object').toBeTruthy();
        expect(typeof board[5][1] === 'object').toBeTruthy();
        expect(typeof board[6][1] === 'object').toBeTruthy();

        gameboard.receiveAttack([4, 1]);
        expect(board[4][1]).toBe('X');
        gameboard.receiveAttack([6, 1]);
        expect(board[6][1]).toBe('X');

        expect(gameboard.allShipsSunk()).toBeFalsy();
    });

    test('sink multiple ships on attacks', () => {
        gameboard.spawnShipAt([4, 1], ship, 'vertical');
        expect(typeof board[4][1] === 'object').toBeTruthy();
        expect(typeof board[5][1] === 'object').toBeTruthy();
        expect(typeof board[6][1] === 'object').toBeTruthy();

        gameboard.spawnShipAt([4, 3], ship2, 'vertical');
        expect(typeof board[4][3] === 'object').toBeTruthy();
        expect(typeof board[5][3] === 'object').toBeTruthy();
        expect(typeof board[6][3] === 'object').toBeTruthy();
        expect(typeof board[7][3] === 'object').toBeTruthy();

        gameboard.receiveAttack([4, 1]);
        expect(board[4][1]).toBe('X');
        gameboard.receiveAttack([5, 1]);
        expect(board[5][1]).toBe('X');
        gameboard.receiveAttack([6, 1]);
        expect(board[6][1]).toBe('X');

        gameboard.receiveAttack([4, 3]);
        expect(board[4][3]).toBe('X');
        gameboard.receiveAttack([5, 3]);
        expect(board[5][3]).toBe('X');
        gameboard.receiveAttack([6, 3]);
        expect(board[6][3]).toBe('X');
        gameboard.receiveAttack([7, 3]);
        expect(board[7][3]).toBe('X');

        expect(gameboard.allShipsSunk()).toBeTruthy();
    });

    test('attack multiple ships but all ships have not sunk yet', () => {
        gameboard.spawnShipAt([4, 1], ship, 'vertical');
        expect(typeof board[4][1] === 'object').toBeTruthy();
        expect(typeof board[5][1] === 'object').toBeTruthy();
        expect(typeof board[6][1] === 'object').toBeTruthy();

        gameboard.spawnShipAt([4, 3], ship2, 'vertical');
        expect(typeof board[4][3] === 'object').toBeTruthy();
        expect(typeof board[5][3] === 'object').toBeTruthy();
        expect(typeof board[6][3] === 'object').toBeTruthy();
        expect(typeof board[7][3] === 'object').toBeTruthy();

        gameboard.receiveAttack([4, 1]);
        expect(board[4][1]).toBe('X');
        gameboard.receiveAttack([5, 1]);
        expect(board[5][1]).toBe('X');
        gameboard.receiveAttack([6, 1]);
        expect(board[6][1]).toBe('X');

        gameboard.receiveAttack([4, 3]);
        expect(board[4][3]).toBe('X');
        gameboard.receiveAttack([6, 3]);
        expect(board[6][3]).toBe('X');

        expect(ship2.getHealth()).toStrictEqual(ship2.size - 2);
        expect(gameboard.allShipsSunk()).toBeFalsy();
    });

    // RESET WORKS

    test('reset board works', () => {
        gameboard.spawnShipAt([5, 3], ship);
        expect(typeof board[5][3] === 'object').toBeTruthy();

        gameboard.reset();
        expect(board[5][3]).toStrictEqual('null');

        expect(typeof board[5][3] === 'object').toBeFalsy();
    });

    //RANDOMIZE AND SPAWN ALL SHIPS;

    test('randomly spawn ships', () => {
        let ships = [5, 4, 3, 2, 2];

        gameboard.randomize(ships);
        expect(gameboard.getShips().length === ships.length).toBeTruthy();
    });

    test('spawn only one ship', () => {
        let ship = [5];

        gameboard.randomize(ship);
        expect(gameboard.getShips().length === 1).toBeTruthy();
    });
});
