import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import computerPlayer from '../factories/computerPlayer';
import Ship from '../factories/ship';
import realPlayer from '../factories/realPlayer';
import * as randomCoords from '../factories/utils/getRandomCoords';

describe('computer player tests', () => {
    let computer, enemy, eGameboard, eBoard, board, ship;

    beforeEach(() => {
        computer = computerPlayer();
        enemy = realPlayer();
        eGameboard = enemy.gameboard;
        eBoard = enemy.board;
        board = computer.board;
        ship = Ship(3);
        jest.clearAllMocks();
    });

    test('computer player has their own gameboard', () => {
        expect(board.length).toEqual(10);
    });

    test('they can spawn their own ships', () => {
        computer.gameboard.spawnShipAt([2, 1], ship);

        expect(typeof board[2][1] === 'object').toBeTruthy();
        expect(typeof board[2][2] === 'object').toBeTruthy();
        expect(typeof board[2][3] === 'object').toBeTruthy();
    });

    test('attack an enemy ship', () => {
        enemy.gameboard.spawnShipAt([1, 1], ship);

        const getRandom = jest
            .spyOn(computer, 'findMoves')
            .mockReturnValueOnce([[1, 1]]);

        computer.attack(enemy.gameboard);

        expect(enemy.board[1][1]).toStrictEqual('X');
    });

    test('attack on enemy ship empty box or ship only', () => {
        enemy.gameboard.spawnShipAt([1, 1], ship);

        const getRandom = jest
            .spyOn(computer, 'findMoves')
            .mockReturnValueOnce([[1, 1]]);

        computer.attack(enemy.gameboard);
        computer.attack(enemy.gameboard);

        expect(enemy.board[1][1]).toStrictEqual('X');
        expect(enemy.board[0][1]).toStrictEqual('-');
    });
});
