import playerScreen from './playerScreen';
import createGrid from './helpers/createGrid';
import spawnShips from './helpers/spawnShips';

export default function gameScreen(game, player, computer) {
    const playerBoard = player.gameboard;
    const compBoard = computer.gameboard;

    const main = document.querySelector('main');
    main.innerHTML = '';
    main.className = 'game-start';

    const playerSection = document.createElement('section');
    playerSection.classList.add('player-board-game');

    main.appendChild(playerSection);

    const playerBoardContainer = document.createElement('section');
    playerBoardContainer.classList.add('player-board-container');
    playerSection.appendChild(playerBoardContainer);

    const compSection = document.createElement('section');
    compSection.classList.add('computer-board-game');
    main.appendChild(compSection);

    const compBoardContainer = document.createElement('section');
    compBoardContainer.classList.add('comp-board-container');
    compSection.appendChild(compBoardContainer);

    const turnSection = document.createElement('section');
    turnSection.classList.add('turn-indicator');
    main.appendChild(turnSection);

    const turnText = document.createElement('h1');
    turnSection.appendChild(turnText);

    createGrid(playerBoardContainer, 'player');
    createGrid(compBoardContainer, 'computer');

    const playerCells = document.querySelectorAll('#player-cell');
    const compCells = document.querySelectorAll('#computer-cell');
    const boardPlayer = playerBoard.getBoard();
    const boardComp = compBoard.getBoard();

    spawnShips(playerCells, boardPlayer);
    spawnShips(compCells, boardComp, true);

    function handleTurn(player, comp) {
        let currentTurn = game.getPlayerTurn();

        if (currentTurn === player) {
            turnText.textContent = `${player.name}'s Turn`;
            restartGame.addEventListener('click', resetGame);

            compCells.forEach((cell) =>
                cell.addEventListener('click', handlePlayerMove)
            );
        }
        if (currentTurn === comp) {
            turnText.textContent = `${comp.name}'s Turn`;
            restartGame.removeEventListener('click', resetGame);

            compCells.forEach((cell) =>
                cell.removeEventListener('click', handlePlayerMove)
            );
            setTimeout(() => {
                handleComputerMove();
            }, 700);
        }
    }

    function handlePlayerMove(e) {
        const cell = e.target;
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        const turn = game.playTurn([row, col]);
        spawnShips(playerCells, boardPlayer);
        spawnShips(compCells, boardComp, true);

        if (turn.win === true) return handlePlayerWin();

        handleTurn(player, computer);
    }

    function handleComputerMove() {
        const turn = game.playTurn();

        spawnShips(playerCells, boardPlayer);
        spawnShips(compCells, boardComp, true);

        if (turn.win === true) return handleComputerWin();

        handleTurn(player, computer);
    }

    function handlePlayerWin() {
        compCells.forEach((cell) => {
            cell.classList.add('lost');
            cell.removeEventListener('click', handlePlayerMove);
        });

        createWinModal('player');
        showWinModal();
        modalEventListeners();
    }

    function createWinModal(player) {
        let winMsg =
            player === 'player'
                ? 'You Won!'
                : player === 'computer'
                  ? 'You Lost!'
                  : 'Error';

        const body = document.querySelector('body');
        const winDialog = document.createElement('dialog');
        winDialog.classList.add('win-modal');
        body.appendChild(winDialog);
        const winText = document.createElement('h1');
        winText.textContent = winMsg;
        winDialog.appendChild(winText);

        const closeBtn = document.createElement('button');
        closeBtn.classList.add('close-modal-btn');
        closeBtn.textContent = 'X';
        winDialog.appendChild(closeBtn);
    }

    function deleteWinModal() {
        const winDialog = document.querySelector('dialog');

        if (winDialog) {
            winDialog.parentNode.removeChild(winDialog);
        }
    }

    function showWinModal() {
        const modal = document.querySelector('dialog');
        modal.showModal();
    }

    function modalEventListeners() {
        const closeBtn = document.querySelector('.close-modal-btn');
        const winDialog = document.querySelector('dialog');
        closeBtn.addEventListener(
            'click',
            () => {
                resetGame();
                winDialog.close();
                deleteWinModal();
            },
            { once: true }
        );

        document.addEventListener(
            'keydown',
            (e) => {
                if (e.key === 'Escape') {
                    resetGame();
                    winDialog.close();
                    deleteWinModal();
                }
            },
            { once: true }
        );
    }

    function handleComputerWin() {
        compCells.forEach((cell) => {
            cell.classList.add('lost');
            cell.removeEventListener('click', handlePlayerMove);
        });

        createWinModal('computer');
        showWinModal();
        modalEventListeners();
    }

    const header = document.querySelector('header');
    const restartGame = document.createElement('button');
    restartGame.classList.add('restart-btn');
    header.appendChild(restartGame);
    restartGame.textContent = 'Restart Game';

    function resetGame() {
        game.reset();
        restartGame.remove();
        const ships = [5, 4, 3, 2, 2];
        playerScreen(game, player, computer, ships);
    }

    handleTurn(player, computer);
}
