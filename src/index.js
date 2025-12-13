import './styles.css';
import gameController from './factories/gameController';
import playerScreen from './ui/playerScreen';

(() => {
    const ships = [5, 4, 3, 2, 2];
    const game = gameController(ships);
    const player = game.getPlayers()[0];
    const computer = game.getPlayers()[1];
    playerScreen(game, player, computer, ships);
})();
