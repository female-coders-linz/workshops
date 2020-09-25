document.addEventListener('DOMContentLoaded', () => {

    const dino = document.querySelector('.dino');
    const speed = 0.9;
    const dinoJumpSound = new Audio('assets/dino-jump.ogx');
    const gameOverSound = new Audio('assets/game-over.ogx');
    const gameOverImg = document.querySelector('.gameOver');
    const background = document.querySelector('.desert');
    let dinoPosition = 0;
    let gameOver = false

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' && !gameOver) {
            dinoJumpSound.play();
            dinoPosition = 0;
            let upMovement = setInterval(() => {
                dinoPosition += 20;
                dinoPosition = dinoPosition * speed;
                dino.style.bottom = dinoPosition + 'px';
                if (dinoPosition >= 150) {
                    clearInterval(upMovement);
                    let downMovement = setInterval(() => {
                        dinoPosition -= 10;
                        dinoPosition = dinoPosition * speed;
                        dino.style.bottom = dinoPosition + 'px';
                        if (dinoPosition <= 0) {
                            clearInterval(downMovement);
                        }
                    }, 20)
                }
            }, 20);
        }
    });

    const grid = document.querySelector('.grid');

    function generateCacti() {
        if (!gameOver) {
            const cacti = document.createElement('div');
            cacti.classList.add('cacti');
            grid.appendChild(cacti);
            cacti.style.left = '1500px';
            let cactiPosition = 1500;
            let leftMovement = setInterval(() => {
                cactiPosition -= 9;
                cacti.style.left = cactiPosition + 'px';
                if (cactiPosition < 60 && cactiPosition > 0 && dinoPosition < 60) {
                    clearInterval(leftMovement);
                    gameOver = true;
                    gameOverImg.style.display = 'inline-block';
                    gameOverSound.play();
                    background.style.webkitAnimationPlayState = 'paused';
                } else if (gameOver) {
                    clearInterval(leftMovement);
                }

            }, 20);
            let randomTime = 1000 + Math.random() * 2500;
            setTimeout(generateCacti, randomTime);
        }
    }

    const scoreField = document.querySelector('.score');
    let score = 0;
    let increaseScore = setInterval(() => {
        score++;
        scoreField.innerHTML = score.toString().padStart(5, '0');
        if (gameOver) {
            clearInterval(increaseScore);
        }
    }, 100);

    generateCacti();

});