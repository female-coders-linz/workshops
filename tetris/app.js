document.addEventListener('DOMContentLoaded', () => {

    const width = 10;
    const height = 20;

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];
    const oTetromino = [
        [0, width, 1, width + 1],
        [0, width, 1, width + 1],
        [0, width, 1, width + 1],
        [0, width, 1, width + 1]
    ];

    const allTetrominos = [lTetromino, zTetromino, tTetromino, iTetromino, oTetromino];

    let cells = Array.from(document.querySelectorAll('.grid div'))

    function draw() {
        currentTetromino.forEach(drawingOffset => {
            cells[currentPosition + drawingOffset].classList.add('falling-tetromino');
        });
    }

    function undraw() {
        currentTetromino.forEach(drawingOffset => {
            cells[currentPosition + drawingOffset].classList.remove('falling-tetromino');
        });
    }

    function moveLeft() {
        if (!touchingLeftEdge() && !wouldTouchFrozenTetromino(currentPosition - 1)) {
            undraw();
            currentPosition -= 1;
            draw();
        }
    }

    function touchingLeftEdge() {
        return currentTetromino.some(offset => (currentPosition + offset) % width === 0);
    }

    function moveRight() {
        if (!touchingRightEdge() && !wouldTouchFrozenTetromino(currentPosition + 1)) {
            undraw();
            currentPosition += 1;
            draw();
        }
    }

    function touchingRightEdge() {
        return currentTetromino.some(offset => (currentPosition + offset) % width === width - 1);
    }

    function rotate() {
        undraw()
        currentRotationIdx = (currentRotationIdx + 1) % 4
        currentTetromino = allTetrominos[currentTetrominoIdx][currentRotationIdx]
        draw()
    }

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
        addScore()
    }

    function freeze() {
        if (touchingBottom() || wouldTouchFrozenTetromino(currentPosition + width)) {
            currentTetromino.forEach(offset => cells[currentPosition + offset].classList.add('frozen-tetromino'));
            setupRandomTetromino();
        }
    }

    function setupRandomTetromino() {
        currentTetrominoIdx = Math.floor(Math.random() * allTetrominos.length)
        currentRotationIdx = Math.floor(Math.random() * allTetrominos[currentTetrominoIdx].length)
        currentTetromino = allTetrominos[currentTetrominoIdx][currentRotationIdx];
        currentPosition = 4;
        draw();
        if (wouldTouchFrozenTetromino(currentPosition)) {
            alert('Game Over!');
            clearInterval(timerId);
        }
    }

    function touchingBottom() {
        return currentTetromino.some(offset => (currentPosition + offset) >= 190);
    }

    function wouldTouchFrozenTetromino(potentialPosition) {
        return currentTetromino.some(offset => cells[potentialPosition + offset].classList.contains('frozen-tetromino'));
    }

    document.addEventListener('keydown', function keyDownListener(e) {
        if (e.keyCode === 39) { // arrow right
            moveRight();
        } else if (e.keyCode === 37) { // arrow left
            moveLeft();
        } else if (e.keyCode === 38) { // arrow up
            rotate();
        } else if (e.keyCode === 40) { // arrow down
            moveDown();
        }
    });

    let currentTetrominoIdx;
    let currentRotationIdx;
    let currentTetromino;
    let currentPosition;
    let timerId;
    let score = 0;

    document.querySelector('.start-button').addEventListener('click', () => {
        setupRandomTetromino();
        timerId = setInterval(moveDown, 1000);
    });

    function addScore() {
        for (currentIndex = 0; currentIndex < 200; currentIndex += width) {
            const row = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6, currentIndex + 7, currentIndex + 8, currentIndex + 9]
            if (row.every(index => cells[index].classList.contains('frozen-tetromino'))) {
                score += 10;
                document.querySelector('.score').innerHTML = score;
                row.forEach(
                    cellIndex => {
                    cells[cellIndex].classList.remove('frozen-tetromino');
                    cells[cellIndex].classList.remove('falling-tetromino');
                    }
                )

                const cellsRemoved = cells.splice(currentIndex, width)
                cells = cellsRemoved.concat(cells)
                cells.forEach(cell => document.querySelector('.grid').appendChild(cell))
            }
        }
    }

});
