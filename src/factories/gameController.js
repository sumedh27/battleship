import realPlayer from './realPlayer.js';
import computerPlayer from './computerPlayer.js';
import Ship from './ship.js';

export default function GameController(ships) {
    let players = [];
    let turn;

    function init() {
        const real = realPlayer();
        const comp = computerPlayer();

        comp.gameboard.randomize(ships);

        turn = 0;

        players[0] = real;
        players[1] = comp;
    }

    function playTurn(coords) {
        const player = getPlayerTurn();
        const enemy = getEnemyTurn();

        return handleAttack(player, enemy, coords);
    }

    function handleAttack(player, enemy, coords) {
        let hit;
        if (coords) {
            hit = player.attack(enemy.gameboard, coords);
        } else {
            hit = player.attack(enemy.gameboard);
        }

        const win = enemy.gameboard.allShipsSunk();

        if (!win && hit === false) {
            switchTurn();
        }

        return { win, hit };
    }

    const getPlayerTurn = () => players[turn];

    const getEnemyTurn = () => (turn === 0 ? players[1] : players[0]);

    const getPlayers = () => players;

    const switchTurn = () => (turn === 0 ? (turn = 1) : (turn = 0));

    const reset = () => {
        players[0].gameboard.reset();
        players[1].gameboard.randomize(ships);
        turn = 0;
    };

    init();

    return { init, getPlayerTurn, getPlayers, handleAttack, playTurn, reset };
}
