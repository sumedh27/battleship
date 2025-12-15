import GameController from '../factories/gameController';
import {
    afterAll,
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test,
} from '@jest/globals';
import * as randomCoords from '../factories/utils/getRandomCoords';
import Ship from '../factories/ship';
import realPlayer from '../factories/realPlayer';
import computerPlayer from '../factories/computerPlayer';

describe('Game Controller tests', () => {
    let game, players, realShip, compShip;
    let ships = [2];

    function createController(ships) {
        game = GameController(ships);
        players = game.getPlayers();

        realShip = Ship(2);
        compShip = Ship(2);
    }

    beforeEach(() => {
        createController(ships);
        jest.spyOn(game, 'init').mockImplementation(() => {
            const real = realPlayer();
            const comp = computerPlayer();

            real.gameboard.spawnShipAt([1, 1], realShip);
            comp.gameboard.spawnShipAt([1, 1], compShip);

            turn = 0;

            players[0] = real;
            players[1] = comp;
        });

        game.init();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('init controller', () => {
        beforeEach(() => {
            game.init();
        });

        test('create players on init', () => {
            expect(players.length).toEqual(2);
        });

        test('create computer player on init', () => {
            expect(players[1].name).toEqual('clanker');
        });

        test('create real player on init', () => {
            expect(players[0].name).toEqual('Joshua');
        });

        test('first turn should be of real player', () => {
            expect(game.getPlayerTurn()).toMatchObject(players[0]);
        });
    });

    describe('handle attacks', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('handle real player attacks and win on all computer ships sunk', () => {
            let currentTurn;
            expect(typeof players[0].board[1][1] === 'object').toBeTruthy();
            expect(typeof players[1].board[1][1] === 'object').toBeTruthy();

            currentTurn = game.playTurn([1, 1]);

            expect(currentTurn.hit).toBeTruthy();

            expect(players[1].board[1][1]).toStrictEqual('X');
            expect(typeof players[1].board[1][1] === 'object').toBeFalsy();
            expect(typeof players[1].board[1][2] === 'object').toBeTruthy();
            expect(game.getPlayerTurn()).toMatchObject(players[0]);

            currentTurn = game.playTurn([1, 2]);

            expect(players[1].board[1][2]).toStrictEqual('X');
            expect(currentTurn.win).toBeTruthy();
        });

        test('change turn on missed attack', () => {
            expect(typeof players[0].board[1][1] === 'object').toBeTruthy();
            expect(typeof players[1].board[1][1] === 'object').toBeTruthy();

            expect(game.getPlayerTurn()).toMatchObject(players[0]);

            const currentTurn = game.playTurn([0, 0]);

            expect(currentTurn.hit).toBeFalsy();
            expect(currentTurn.win).toBeFalsy();

            expect(game.getPlayerTurn()).toMatchObject(players[1]);
        });

        test('computer player attacks on its turn', () => {
            const getRandom = jest
                .spyOn(players[1], 'findMoves')
                .mockReturnValueOnce([[1, 1]]);

            // Real Player hits enemy board at [0,0]
            let currentTurn = game.playTurn([0, 0]);

            expect(currentTurn.hit).toBeFalsy();
            expect(players[1].board[0][0]).toStrictEqual('-');

            expect(game.getPlayerTurn()).toMatchObject(players[1]);

            // Computer Player hits enemy board at [1,1]

            currentTurn = game.playTurn();
            console.log(getRandom.mock.results);

            console.log(currentTurn);

            expect(currentTurn.hit).toBeTruthy();
            expect(players[0].board[1][1]).toStrictEqual('X');
            expect(game.getPlayerTurn()).toMatchObject(players[1]);

            // Computer Player hits enemy board at [0,1]

            currentTurn = game.playTurn();
            console.log(currentTurn);
            expect(currentTurn.hit).toBeFalsy();
            expect(players[0].board[0][1]).toStrictEqual('-');

            expect(game.getPlayerTurn()).toMatchObject(players[0]);
        });
    });

    describe('simulate a game where real player wins', () => {
        test('simulation', () => {
            const getRandom = jest
                .spyOn(players[1], 'findMoves')
                .mockReturnValueOnce([[1, 1]]);

            expect(typeof players[0].board[1][1] === 'object').toBeTruthy();
            expect(typeof players[1].board[1][1] === 'object').toBeTruthy();

            // Real Player attacks Computer Board at [1,1]
            let currentTurn = game.playTurn([1, 1]);

            expect(currentTurn.hit).toBeTruthy();
            expect(players[1].board[1][1]).toStrictEqual('X');
            expect(game.getPlayerTurn()).toMatchObject(players[0]);

            // Real Player attacks Computer Board at [5,1]
            currentTurn = game.playTurn([5, 1]);

            expect(currentTurn.hit).toBeFalsy();
            expect(players[1].board[5][1]).toStrictEqual('-');
            expect(game.getPlayerTurn()).toMatchObject(players[1]);

            // Computer Player attacks Player Board at [1,1]
            currentTurn = game.playTurn();

            expect(currentTurn.hit).toBeTruthy();
            expect(players[0].board[1][1]).toStrictEqual('X');
            expect(game.getPlayerTurn()).toMatchObject(players[1]);

            // Computer Player attacks Player Board at [0,1]
            currentTurn = game.playTurn();

            expect(currentTurn.hit).toBeFalsy();
            expect(players[0].board[0][1]).toStrictEqual('-');
            expect(game.getPlayerTurn()).toMatchObject(players[0]);

            // // Real Player attacks Computer Board at [4,2]
            currentTurn = game.playTurn([4, 2]);

            expect(currentTurn.hit).toBeFalsy();
            expect(players[1].board[4][2]).toStrictEqual('-');
            expect(game.getPlayerTurn()).toMatchObject(players[1]);

            // Computer Player attacks Player Board at [1,0]
            currentTurn = game.playTurn();

            expect(currentTurn.hit).toBeFalsy();
            expect(players[0].board[1][0]).toStrictEqual('-');
            expect(game.getPlayerTurn()).toMatchObject(players[0]);

            // Real Player attacks Computer Board at [6,2]
            currentTurn = game.playTurn([6, 2]);

            expect(currentTurn.hit).toBeFalsy();
            expect(players[1].board[6][2]).toStrictEqual('-');
            expect(game.getPlayerTurn()).toMatchObject(players[1]);

            // Computer Player attacks Player Board at [1,2] and wins the game
            currentTurn = game.playTurn();

            console.log(currentTurn);
            expect(currentTurn.hit).toBeTruthy();
            expect(players[0].board[1][2]).toStrictEqual('X');
            expect(game.getPlayerTurn()).toMatchObject(players[1]);
            expect(currentTurn.win).toBeTruthy();
        });
    });
});
