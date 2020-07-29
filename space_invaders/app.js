document.addEventListener('DOMContentLoaded', () => {
    let cells = document.querySelectorAll('.grid .cell');
    let playerPosition = 202;
    let invaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];
    let invadersPosition = 0;
    let direction = 'RIGHT';
    let score = 0;
    cells[playerPosition].classList.add('player');

    drawInvaders();
    let invaderMovement = setInterval(moveInvaders, 1000);

    function moveInvaders() {
        if (direction === 'LEFT') {
            if (invaderTouchingLeftEdge()) {
                moveInvadersDown();
                direction = 'RIGHT';
            } else {
                moveInvadersLeft();
            }
        } else if (direction === 'RIGHT') {
            if (invaderTouchingRightEdge()) {
                moveInvadersDown();
                direction = 'LEFT';
            } else {
                moveInvadersRight();
            }
        }
        playAlienCreak();
        checkGameOver();
    }

    function moveInvadersDown() {
        undrawInvaders();
        invadersPosition += 15;
        drawInvaders();
    }

    function moveInvadersRight() {
        undrawInvaders();
        invadersPosition += 1;
        drawInvaders();
    }

    function moveInvadersLeft() {
        undrawInvaders();
        invadersPosition -= 1;
        drawInvaders();
    }

    function invaderTouchingLeftEdge() {
        return invaders.some(relativePosition => (relativePosition + invadersPosition) % 15 === 0)
    }

    function invaderTouchingRightEdge() {
        return invaders.some(relativePosition => (relativePosition + invadersPosition) % 15 === 14)
    }

    function drawInvaders() {
        invaders.forEach(relativePosition => {
            if (relativePosition < 10) {
                cells[relativePosition + invadersPosition].classList.add('invader-1');
            } else if (relativePosition < 25) {
                cells[relativePosition + invadersPosition].classList.add('invader-2');
            } else {
                cells[relativePosition + invadersPosition].classList.add('invader-3');
            }
        });
    }

    function undrawInvaders() {
        invaders.forEach(relativePosition => {
            cells[relativePosition + invadersPosition].classList.remove('invader-1');
            cells[relativePosition + invadersPosition].classList.remove('invader-2');
            cells[relativePosition + invadersPosition].classList.remove('invader-3');
        })
    }

    document.addEventListener('keydown', function keyDownListener(e) {
        if (e.keyCode === 39) { // arrow right
            moveRight();
        } else if (e.keyCode === 37) { // arrow left
            moveLeft();
        } else if (e.keyCode === 32) {
            shootLaser();
        }
    });

    function touchingRightEdge() {
        return playerPosition % 15 === 14;
    }

    function moveRight() {
        if (!touchingRightEdge()) {
            cells[playerPosition].classList.remove('player');
            playerPosition += 1;
            cells[playerPosition].classList.add('player');
        }
    }

    function touchingLeftEdge() {
        return playerPosition % 15 === 0;
    }

    function moveLeft() {
        if (!touchingLeftEdge()) {
            cells[playerPosition].classList.remove('player');
            playerPosition -= 1;
            cells[playerPosition].classList.add('player');
        }
    }

    function checkGameOver() {
        if (invaders.some(realtivePosition => realtivePosition + invadersPosition === playerPosition)) {
            alert("An invader got you");
            clearInterval(invaderMovement);
            playGameOver();
        }
    }

    function shootLaser() {
        playLaser();
        let laserPosition = playerPosition;
        function moveLaser() {
            cells[laserPosition].classList.remove("laser");
            laserPosition -= 15;
            if (laserPosition < 0) {
                clearInterval(laserId);
            }
            cells[laserPosition].classList.add("laser");

            let hitByLaser = invaders.find(invaderRelativePosition => invaderRelativePosition + invadersPosition === laserPosition);
            if (hitByLaser != null) {
                cells[hitByLaser + invadersPosition].classList.remove("invader");
                cells[hitByLaser + invadersPosition].classList.remove("laser");
                invaders = invaders.filter(invader => invader !== hitByLaser);
                score += 1;
                document.querySelector(".score").innerHTML = score;
                clearInterval(laserId);
            }
        }
        let laserId = setInterval(moveLaser, 500);
    }

});

function playAlienCreak() {
    let audio = new Audio('assets/alien.wav');
    audio.play();
}

function playLaser() {
    let audio = new Audio('assets/laser1.wav');
    audio.play();
}

function playGameOver() {
    let audio = new Audio('assets/game-over.mp3');
    audio.play();
}