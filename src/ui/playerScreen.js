import Ship from '../factories/ship';
import gameScreen from './gameScreen';
import createGrid from './helpers/createGrid';
import spawnShips from './helpers/spawnShips';

export default function playerScreen(game, player, computer, ships) {
    const playerGameboard = player.gameboard;
    const board = playerGameboard.getBoard();
    const main = document.querySelector('main');
    main.innerHTML = '';
    main.className = 'player-choice';

    const boardSection = document.createElement('section');

    main.appendChild(boardSection);
    boardSection.classList.add('player-board'); // check this

    const boardContainer = document.createElement('section');

    boardSection.appendChild(boardContainer);
    boardContainer.classList.add('player-board-container');

    const playerSelectSection = document.createElement('section');
    playerSelectSection.classList.add('player-select');
    main.appendChild(playerSelectSection);

    const gameInfoSection = document.createElement('div');
    gameInfoSection.classList.add('game-info-text');
    playerSelectSection.appendChild(gameInfoSection);

    const gameInfo = document.createElement('p');
    gameInfo.textContent =
        'Play Battleship, a type guessing strategy game against a computer player';
    gameInfoSection.appendChild(gameInfo);

    const userInputSection = document.createElement('div');
    playerSelectSection.appendChild(userInputSection);
    userInputSection.classList.add('user-inputs');

    function createSpawnShips() {
        const formText = document.createElement('p');
        userInputSection.appendChild(formText);
        formText.textContent = 'Select Ship and spawn it at';

        const spawnFormEl = document.createElement('form');

        userInputSection.appendChild(spawnFormEl);
        spawnFormEl.id = 'spawn-ship';

        const labelShip = document.createElement('label');
        labelShip.setAttribute('for', 'ship-sizes');
        labelShip.textContent = 'Ship Length';
        spawnFormEl.appendChild(labelShip);

        const selectShip = document.createElement('select');
        selectShip.id = 'ship-sizes';
        selectShip.name = 'ship-sizes';
        spawnFormEl.appendChild(selectShip);

        const labelRow = document.createElement('label');
        labelRow.setAttribute('for', 'row');
        labelRow.textContent = 'Row';
        spawnFormEl.appendChild(labelRow);

        const inputRow = document.createElement('input');
        inputRow.type = 'number';
        inputRow.id = 'row';
        inputRow.name = 'row';
        inputRow.value = 0;
        inputRow.min = 0;
        inputRow.max = 9;
        spawnFormEl.appendChild(inputRow);

        const labelCol = document.createElement('label');
        labelCol.setAttribute('for', 'row');
        labelCol.textContent = 'Column';
        spawnFormEl.appendChild(labelCol);

        const inputCol = document.createElement('input');
        inputCol.type = 'number';
        inputCol.id = 'col';
        inputCol.name = 'col';
        inputCol.value = 0;
        inputCol.min = 0;
        inputCol.max = 9;
        spawnFormEl.appendChild(inputCol);

        const spawnBtn = document.createElement('button');
        spawnBtn.classList.add('spawn-btn');
        spawnBtn.type = 'submit';
        spawnBtn.textContent = 'Spawn';
        spawnFormEl.appendChild(spawnBtn);
    }

    if (userInputSection.childElementCount === 0) {
        createSpawnShips();
        const selectShip = document.querySelector('#ship-sizes');
        fillDropDown(selectShip);
        const spawnForm = document.querySelector('#spawn-ship');
        createSpawnFormListener(spawnForm);
    }

    function removeSpawnShips() {
        userInputSection.replaceChildren();
    }

    // const formText = document.createElement('p');
    // userInputSection.appendChild(formText);
    // formText.textContent = 'Select Ship and spawn it at';

    // const spawnFormEl = document.createElement('form');

    // userInputSection.appendChild(spawnFormEl);
    // spawnFormEl.id = 'spawn-ship';

    // const labelShip = document.createElement('label');
    // labelShip.setAttribute('for', 'ship-sizes');
    // labelShip.textContent = 'Ship Length';
    // spawnFormEl.appendChild(labelShip);

    // const selectShip = document.createElement('select');
    // selectShip.id = 'ship-sizes';
    // selectShip.name = 'ship-sizes';
    // spawnFormEl.appendChild(selectShip);

    // const labelRow = document.createElement('label');
    // labelRow.setAttribute('for', 'row');
    // labelRow.textContent = 'Row';
    // spawnFormEl.appendChild(labelRow);

    // const inputRow = document.createElement('input');
    // inputRow.type = 'number';
    // inputRow.id = 'row';
    // inputRow.name = 'row';
    // spawnFormEl.appendChild(inputRow);

    // const labelCol = document.createElement('label');
    // labelCol.setAttribute('for', 'row');
    // labelCol.textContent = 'Column';
    // spawnFormEl.appendChild(labelCol);

    // const inputCol = document.createElement('input');
    // inputCol.type = 'number';
    // inputCol.id = 'col';
    // inputCol.name = 'col';
    // spawnFormEl.appendChild(inputCol);

    // const spawnBtn = document.createElement('button');
    // spawnBtn.type = 'submit';
    // spawnBtn.textContent = 'Spawn';
    // spawnFormEl.appendChild(spawnBtn);

    const randomSection = document.createElement('div');
    randomSection.classList.add('random-section');
    playerSelectSection.appendChild(randomSection);

    const randomizeBtn = document.createElement('button');
    randomizeBtn.classList.add('randomize-btn');
    randomSection.appendChild(randomizeBtn);
    randomizeBtn.textContent = 'Randomize Board';

    const resetBtn = document.createElement('button');
    resetBtn.classList.add('reset-btn');
    resetBtn.textContent = 'Reset Board';
    randomSection.appendChild(resetBtn);

    // const userInputContainer = document.querySelector('.user-inputs');

    const startGameBtn = document.createElement('button');
    startGameBtn.textContent = 'Start Game';
    startGameBtn.id = 'start-game';
    playerSelectSection.appendChild(startGameBtn);
    // const resetBtn = document.querySelector('.reset-btn');
    // const randomizeBtn = document.querySelector('.randomize-btn');

    createGrid(boardContainer, 'player');

    const playerCells = document.querySelectorAll('#player-cell');

    function fillDropDown(selectShip) {
        selectShip.replaceChildren();

        ships.forEach((ship) => {
            const optionEl = document.createElement('option');
            optionEl.value = ship;
            optionEl.textContent = ship;
            selectShip.appendChild(optionEl);
        });
    }

    randomizeBtn.addEventListener('click', () => {
        if (userInputSection.childElementCount > 0) {
            removeSpawnShips();
            shipsDeployedSuccess();
        }
        ships = [5, 4, 3, 2, 2];
        playerGameboard.randomize(ships);
        spawnShips(playerCells, board);
    });

    resetBtn.addEventListener('click', () => {
        if (userInputSection.childElementCount <= 1) {
            shipsYetToBeDeployed();
            createSpawnShips();
            const selectShip = document.querySelector('#ship-sizes');
            fillDropDown(selectShip);
            const spawnForm = document.querySelector('#spawn-ship');
            createSpawnFormListener(spawnForm);
        }
        const selectShip = document.querySelector('#ship-sizes');

        playerGameboard.reset();
        spawnShips(playerCells, board);
        ships = [5, 4, 3, 2, 2];
        fillDropDown(selectShip);
    });

    function createSpawnFormListener(spawnForm) {
        spawnForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const row = Number(e.target.row.value);
            const col = Number(e.target.col.value);
            const selectedShip = Number(
                document.querySelector('#ship-sizes').value
            );

            const index = ships.indexOf(selectedShip);

            console.log(`spawningAt(${row},${col},${selectedShip})`);

            const spawnAt = playerGameboard.spawnShipAt(
                [row, col],
                Ship(selectedShip)
            );
            console.log(spawnAt);

            if (spawnAt) {
                const selectShip = document.querySelector('#ship-sizes');

                ships.splice(index, 1);
                fillDropDown(selectShip);
                spawnShips(playerCells, board);
            }

            if (ships.length === 0) {
                if (userInputSection.childElementCount > 0) {
                    removeSpawnShips();
                }
                shipsDeployedSuccess();
            }
        });
    }

    function shipsDeployedSuccess() {
        userInputSection.replaceChildren();
        const shipsDeployed = document.createElement('p');
        shipsDeployed.textContent = 'All ships deployed and ready to battle';
        userInputSection.appendChild(shipsDeployed);
    }

    function shipsYetToBeDeployed() {
        userInputSection.replaceChildren();
    }

    const startGame = document.querySelector('#start-game');

    startGame.addEventListener('click', () => {
        if (playerGameboard.getShips().length !== 5) {
            console.log('please spawn all ships');
            return;
        }
        gameScreen(game, player, computer);
    });
}
