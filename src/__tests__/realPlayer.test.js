import { beforeEach, describe, expect, test } from '@jest/globals';
import realPlayer from '../factories/realPlayer';
import Ship from '../factories/ship';

describe('real player tests', () => {
    let player, enemy, board, ship;

    beforeEach(() => {
        player = realPlayer();
        board = player.board;
        enemy = realPlayer();
        enemyBoard = enemy.board;
        ship = Ship(3);
    });

    test('real player has their own gameboard', () => {
        expect(board.length).toEqual(10);
    });

    test('they can spawn their own ships', () => {
        player.gameboard.spawnShipAt([1, 1], ship);

        expect(typeof board[1][1] === 'object').toBeTruthy();
        expect(typeof board[1][2] === 'object').toBeTruthy();
        expect(typeof board[1][3] === 'object').toBeTruthy();
    });

    test('attack an enemy ship', () => {
        enemy.gameboard.spawnShipAt([1, 1], ship);

        player.attack(enemy.gameboard, [1, 1]);

        expect(enemyBoard[1][1]).toStrictEqual('X');
    });

    test('miss an attack on enemy ship', () => {
        enemy.gameboard.spawnShipAt([1, 1], ship);

        player.attack(enemy.gameboard, [0, 0]);

        expect(enemyBoard[0][0]).toStrictEqual('-');
    });
});
