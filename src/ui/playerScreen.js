import Ship from '../factories/ship';
import gameScreen from './gameScreen';
import createGrid from './helpers/createGrid';
import spawnShips from './helpers/spawnShips';

export default function playerScreen(game, player, computer, ships) {
    let controller = new AbortController();
    let { signal } = controller;
    const playerShips = new Map();

    function createPlayerObj(ships) {
        for (let i = 0; i < ships.length; i++) {
            playerShips.set(i, Ship(ships[i]));
        }
    }

    createPlayerObj(ships);

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

    createGrid(boardContainer, 'player');
    const playerCells = document.querySelectorAll('#player-cell');

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
            for (let [key, ship] of playerShips) {
                const div = document.createElement('div');
                div.draggable = true;
                div.dataset.key = key;
                div.dataset.size = ship.size;
                div.dataset.axis = 'vertical';
                div.classList.add('dragShip');
                if (!vertical) {
                    div.classList.add('horizontal');
                    div.dataset.axis = 'horizontal';
                }
                div.style = `--size: ${ship.size}`;
                dragShipsDiv.appendChild(div);
            }

            // const sizeTwoOne = document.createElement('div');
            // sizeTwoOne.draggable = true;
            // sizeTwoOne.dataset.size = 2;
            // sizeTwoOne.dataset.axis = 'vertical';

            // sizeTwoOne.classList.add('dragShip');
            // if (!vertical) {
            //     sizeTwoOne.classList.add('horizontal');
            //     sizeTwoOne.dataset.axis = 'horizontal';
            // }
            // sizeTwoOne.style = '--size: 2';
            // dragShipsDiv.appendChild(sizeTwoOne);

            // const sizeTwoTwo = document.createElement('div');
            // sizeTwoTwo.draggable = true;
            // sizeTwoTwo.dataset.size = 2;
            // sizeTwoTwo.dataset.axis = 'vertical';

            // sizeTwoTwo.classList.add('dragShip');
            // if (!vertical) {
            //     sizeTwoTwo.classList.add('horizontal');
            //     sizeTwoTwo.dataset.axis = 'horizontal';
            // }
            // sizeTwoTwo.style = '--size: 2';
            // dragShipsDiv.appendChild(sizeTwoTwo);

            // const sizeThree = document.createElement('div');
            // sizeThree.draggable = true;
            // sizeThree.dataset.size = 3;
            // sizeThree.dataset.axis = 'vertical';

            // sizeThree.classList.add('dragShip');
            // if (!vertical) {
            //     sizeThree.classList.add('horizontal');
            //     sizeThree.dataset.axis = 'horizontal';
            // }
            // sizeThree.style = '--size: 3';
            // dragShipsDiv.appendChild(sizeThree);

            // const sizeFour = document.createElement('div');
            // sizeFour.draggable = true;
            // sizeFour.dataset.size = 4;
            // sizeFour.dataset.axis = 'vertical';
            // sizeFour.classList.add('dragShip');
            // if (!vertical) {
            //     sizeFour.classList.add('horizontal');
            //     sizeFour.dataset.axis = 'horizontal';
            // }
            // sizeFour.style = '--size: 4';
            // dragShipsDiv.appendChild(sizeFour);

            // const sizeFive = document.createElement('div');
            // sizeFive.draggable = true;
            // sizeFive.dataset.size = 5;
            // sizeFive.dataset.axis = 'vertical';

            // sizeFive.classList.add('dragShip');
            // if (!vertical) {
            //     sizeFive.classList.add('horizontal');
            //     sizeFive.dataset.axis = 'horizontal';
            // }
            // sizeFive.style = '--size: 5';
            // dragShipsDiv.appendChild(sizeFive);
        }
        spawnDragShips(vertical);
        dragShipEvents();
    }

    createSpawnShips();

    function dragShipEvents() {
        const dragShips = document.querySelectorAll('.dragShip');
        let data = { ship: null, vertical: null };
        let dragged = null;

        dragShips.forEach((ship) => {
            ship.addEventListener('dragstart', handleDragStart, { signal });
            ship.addEventListener('dragend', handleDragEnd, { signal });
        });

        function handleDragStart(e) {
            dragged = e.target;
            const size = Number(e.target.dataset.size);
            const axis = e.target.dataset.axis;
            data = { ship: Ship(size), axis };
            e.target.classList.add('dragging');
        }

        function handleDragEnd(e) {
            data = { ship: null, axis: null };

            e.target.classList.remove('dragging');
        }

        function handleDragEnter(e) {
            e.stopPropagation();
            const { ship, axis } = data;
            if (e.target.classList.contains('cell')) {
                const row = Number(e.target.dataset.row);
                const col = Number(e.target.dataset.col);
                const spawnAble = playerGameboard.canShipsSpawn(
                    [row, col],
                    ship,
                    axis
                );
                if (axis === 'vertical' && spawnAble) {
                    for (let i = row; i < row + ship.size; i++) {
                        const div = document.querySelector(
                            `[data-row='${i}'][data-col='${col}']`
                        );
                        setTimeout(() => {
                            div.classList.add('valid-placement');
                        }, 1);
                    }
                } else if (axis === 'horizontal' && spawnAble) {
                    for (let i = col; i < col + ship.size; i++) {
                        const div = document.querySelector(
                            `[data-row='${row}'][data-col='${i}']`
                        );
                        setTimeout(() => {
                            div.classList.add('valid-placement');
                        }, 1);
                    }
                } else if (axis === 'vertical' && !spawnAble) {
                    for (let i = row; i < row + ship.size && i < 10; i++) {
                        const div = document.querySelector(
                            `[data-row='${i}'][data-col='${col}']`
                        );
                        setTimeout(() => {
                            div.classList.add('invalid-placement');
                        }, 1);
                    }
                } else if (axis === 'horizontal' && !spawnAble) {
                    for (let i = col; i < col + ship.size && i < 10; i++) {
                        const div = document.querySelector(
                            `[data-row='${row}'][data-col='${i}']`
                        );
                        setTimeout(() => {
                            div.classList.add('invalid-placement');
                        }, 1);
                    }
                }
            }
        }

        function handleDragLeave(e) {
            e.stopPropagation();
            const { ship, axis } = data;
            if (e.target.classList.contains('cell')) {
                const row = Number(e.target.dataset.row);
                const col = Number(e.target.dataset.col);

                if (e.target.classList.contains('invalid-placement')) {
                    if (axis === 'vertical') {
                        for (let i = row; i < row + ship.size && i < 10; i++) {
                            const div = document.querySelector(
                                `[data-row='${i}'][data-col='${col}']`
                            );

                            div.classList.remove('invalid-placement');
                        }
                    } else if (axis === 'horizontal') {
                        for (let i = col; i < col + ship.size && i < 10; i++) {
                            const div = document.querySelector(
                                `[data-row='${row}'][data-col='${i}']`
                            );

                            div.classList.remove('invalid-placement');
                        }
                    }

                    return;
                }

                if (axis === 'vertical') {
                    for (let i = row; i < row + ship.size; i++) {
                        const div = document.querySelector(
                            `[data-row='${i}'][data-col='${col}']`
                        );

                        div.classList.remove('valid-placement');
                    }
                } else if (axis === 'horizontal') {
                    for (let i = col; i < col + ship.size; i++) {
                        const div = document.querySelector(
                            `[data-row='${row}'][data-col='${i}']`
                        );

                        div.classList.remove('valid-placement');
                    }
                }
            }
        }

        function handleDrop(e) {
            e.preventDefault();
            if (e.target.classList.contains('cell')) {
                const { ship, axis } = data;
                const row = Number(e.target.dataset.row);
                const col = Number(e.target.dataset.col);
                const key = Number(dragged.dataset.key);
                playerGameboard.spawnShipAt([row, col], ship, axis);
                spawnShips(playerCells, board);
                if (ship.getCoords().coords !== null) {
                    dragged.parentNode.removeChild(dragged);
                    playerShips.delete(key);
                }

                if (playerShips.size === 0) {
                    shipsDeployedSuccess();
                }
            }
        }

        boardContainer.addEventListener('dragenter', handleDragEnter, {
            signal,
        });

        boardContainer.addEventListener('dragleave', handleDragLeave, {
            signal,
        });

        boardContainer.addEventListener(
            'dragover',
            (e) => {
                e.preventDefault();
            },
            { signal }
        );

        boardContainer.addEventListener('drop', handleDrop, { signal });
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

    randomizeBtn.addEventListener('click', () => {
        if (userInputSection.childElementCount > 0) {
            shipsDeployedSuccess();
        }
        ships = [5, 4, 3, 2, 2];
        playerGameboard.randomize(ships);
        spawnShips(playerCells, board);
    });

    resetBtn.addEventListener('click', () => {
        ships = [5, 4, 3, 2, 2];
        createPlayerObj(ships);
        if (userInputSection.childElementCount <= 2) {
            shipsYetToBeDeployed();
            createSpawnShips();
        }

        playerGameboard.reset();
        spawnShips(playerCells, board);
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
