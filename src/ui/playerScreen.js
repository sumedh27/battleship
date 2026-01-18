import Ship from '../factories/ship';
import gameScreen from './gameScreen';
import createGrid from './helpers/createGrid';
import spawnShips from './helpers/spawnShips';

export default function playerScreen(game, player, computer, ships) {
    let controller = new AbortController();
    let { signal } = controller;

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
        let vertical = true;
        controller.abort();
        controller = new AbortController();
        signal = controller.signal;

        const divTitle = document.createElement('div');
        userInputSection.appendChild(divTitle);
        divTitle.classList.add('user-title');

        const dragTitle = document.createElement('p');
        divTitle.appendChild(dragTitle);
        dragTitle.textContent = 'Select a Ship and Drag it at the board';

        const changeOrientationBtn = document.createElement('button');
        changeOrientationBtn.textContent = 'Flip Ships';
        divTitle.appendChild(changeOrientationBtn);

        const dragShipsDiv = document.createElement('div');
        userInputSection.appendChild(dragShipsDiv);
        dragShipsDiv.classList.add('draggableShips');

        changeOrientationBtn.addEventListener('click', () => {
            vertical ? (vertical = false) : (vertical = true);
            dragShipsDiv.replaceChildren();
            controller.abort();
            spawnDragShips(vertical);
            controller = new AbortController();
            signal = controller.signal;
            dragShipEvents();

            if (vertical) {
                dragShipsDiv.style.setProperty('flex-direction', 'row');
            } else {
                dragShipsDiv.style.setProperty('flex-direction', 'column');
            }
        });

        function spawnDragShips(vertical) {
            const sizeTwoOne = document.createElement('div');
            sizeTwoOne.draggable = true;
            sizeTwoOne.dataset.size = 2;
            sizeTwoOne.dataset.vertical = true;

            sizeTwoOne.classList.add('dragShip');
            if (!vertical) {
                sizeTwoOne.classList.add('horizontal');
                sizeTwoOne.dataset.vertical = false;
            }
            sizeTwoOne.style = '--size: 2';
            dragShipsDiv.appendChild(sizeTwoOne);

            const sizeTwoTwo = document.createElement('div');
            sizeTwoTwo.draggable = true;
            sizeTwoTwo.dataset.size = 2;
            sizeTwoTwo.dataset.vertical = true;

            sizeTwoTwo.classList.add('dragShip');
            if (!vertical) {
                sizeTwoTwo.classList.add('horizontal');
                sizeTwoTwo.dataset.vertical = false;
            }
            sizeTwoTwo.style = '--size: 2';
            dragShipsDiv.appendChild(sizeTwoTwo);

            const sizeThree = document.createElement('div');
            sizeThree.draggable = true;
            sizeThree.dataset.size = 3;
            sizeThree.dataset.vertical = true;

            sizeThree.classList.add('dragShip');
            if (!vertical) {
                sizeThree.classList.add('horizontal');
                sizeThree.dataset.vertical = false;
            }
            sizeThree.style = '--size: 3';
            dragShipsDiv.appendChild(sizeThree);

            const sizeFour = document.createElement('div');
            sizeFour.draggable = true;
            sizeFour.dataset.size = 4;
            sizeFour.dataset.vertical = true;
            sizeFour.classList.add('dragShip');
            if (!vertical) {
                sizeFour.classList.add('horizontal');
                sizeFour.dataset.vertical = false;
            }
            sizeFour.style = '--size: 4';
            dragShipsDiv.appendChild(sizeFour);

            const sizeFive = document.createElement('div');
            sizeFive.draggable = true;
            sizeFive.dataset.size = 5;
            sizeFive.dataset.vertical = true;

            sizeFive.classList.add('dragShip');
            if (!vertical) {
                sizeFive.classList.add('horizontal');
                sizeFive.dataset.vertical = false;
            }
            sizeFive.style = '--size: 5';
            dragShipsDiv.appendChild(sizeFive);
        }
        spawnDragShips(vertical);
        dragShipEvents();
    }

    createSpawnShips();

    function dragShipEvents() {
        const ships = document.querySelectorAll('.dragShip');
        let data = { size: null, vertical: null };

        ships.forEach((ship) => {
            ship.addEventListener('dragstart', handleDragStart, { signal });
            ship.addEventListener('dragend', handleDragEnd, { signal });
        });

        function handleDragStart(e) {
            console.log('dragging');
            const size = e.target.dataset.size;
            const vertical = e.target.dataset.vertical;
            console.log(size);
            data = { size, vertical };
            console.log(data);
            e.target.classList.add('dragging');
        }

        function handleDragEnd(e) {
            data = { size: null, vertical: null };
            e.target.classList.remove('dragging');
        }

        function handleDragEnter(e) {
            e.stopPropagation();
            console.log(data.size, data.vertical);
        }
        boardContainer.addEventListener('dragenter', handleDragEnter, {
            signal,
        });
    }

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

    randomizeBtn.addEventListener('click', () => {
        if (userInputSection.childElementCount > 0) {
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
        }

        playerGameboard.reset();
        spawnShips(playerCells, board);
        ships = [5, 4, 3, 2, 2];
    });

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
