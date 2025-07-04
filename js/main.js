const helpfulImages = ["kebab.png", "frites.png", "kapsalon.png"];
class Player {

    constructor() {
        this.width = 5;
        this.height = 5;
        this.positionX = 5;
        this.positionY = 0;
        this.velocityY = 8;
        this.gravity = -0.4;
        this.lives = 5;
        this.updateLivesUI();
        this.isJumping = false;


        this.playerElm = document.getElementById("player");
        this.playerElm.style.width = this.width + "vw";
        this.playerElm.style.height = this.height + "vw";
        this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        this.playerElm.style.left = this.positionX + "vw";
        this.playerElm.style.bottom = this.positionY + "vw";

    }

    moveRight() {
        if (this.positionX + this.width < 100) {
            this.positionX++;
            this.updatePlayerPosition();
        }
    }

    moveLeft() {
        if (this.positionX > 0) {
            this.positionX--;
            this.updatePlayerPosition();
        }
    }

    moveJump() {
        if (!this.isJumping && this.positionY === 0) {
            this.velocityY = 5;
            this.isJumping = true;
        }
    }

    moveDown() {
        if (this.positionY > 0) {
            this.positionY--;
            this.updatePlayerPosition();
        }
    }

    updateLivesUI() {
        const livesElm = document.getElementById("lives");
        if (livesElm) {
            livesElm.textContent = `Lives: ${this.lives}`;
        }

    }

}




class Obstacle {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.positionX = 100;
        const maxJumpHeight = 20;
        this.positionY = Math.floor(Math.random() * (maxJumpHeight - this.height));
        this.type = Math.random() < 0.7 ? "harmful" : "helpful";
        this.speed = obstacleSpeed;

        this.createObjects();
        this.updateObjectPosition();

    }

    updateObjectPosition() {

        this.obstacleElm.style.left = this.positionX + "vw"
        this.obstacleElm.style.bottom = this.positionY + "vw"
        this.obstacleElm.style.width = this.width + "vw"
        this.obstacleElm.style.height = this.height + "vw"
    }


    createObjects() {
        this.obstacleElm = document.createElement("div");
        this.obstacleElm.classList.add("obstacle", this.type);

        if (this.type === "helpful") {
            const randomImage = helpfulImages[Math.floor(Math.random() * helpfulImages.length)]
            this.obstacleElm.style.backgroundImage = `url(./media/food/${randomImage})`;
            this.obstacleElm.style.backgroundSize = "contain";
            this.obstacleElm.style.backgroundRepeat = "no-repeat";
            this.obstacleElm.style.backgroundPosition = "center";

        }
        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.obstacleElm);
    }



    horizontalMovement() {
        this.positionX -= obstacleSpeed;
        this.updateObjectPosition();

    }

}




let score = 0;
const scoreElm = document.getElementById("score");

function updateScore(points) {
    score += points;
    if (score < 0) score = 0;
    scoreElm.textContent = `Score: ${score}`;
}

let obstacleSpeed = 1;
const player = new Player()
const obstacle = [];


setInterval(() => {
    if (player.isJumping || player.velocityY !== 0) {
        player.positionY += player.velocityY;
        player.velocityY += player.gravity;

        if (player.positionY <= 0) {
            player.positionY = 0;
            player.velocityY = 0;
            player.isJumping = false;
        }

        player.updatePlayerPosition();
    }
}, 50);

let spawnDelay = 4000;
function spawnObstacleRandomly() {
    const newObstacle = new Obstacle(obstacleSpeed);
    obstacle.push(newObstacle);

    obstacleSpeed = Math.min(obstacleSpeed + 0.05, 10);
    spawnDelay = Math.max(400, spawnDelay * 0.98);
    setTimeout(spawnObstacleRandomly, spawnDelay);
}

spawnObstacleRandomly();



setInterval(() => {
    obstacle.forEach((obInstance) => {
        obInstance.horizontalMovement();

        if (obInstance.positionX + obInstance.width < 0) {
            obInstance.obstacleElm.remove();
            obstacle.splice(obstacle.indexOf(obInstance), 1);
        }


        if (
            player.positionX < obInstance.positionX + obInstance.width &&
            player.positionX + player.width > obInstance.positionX &&
            player.positionY < obInstance.positionY + obInstance.height &&
            player.positionY + player.height > obInstance.positionY
        ) {
            if (obInstance.type === "harmful") {
                player.lives--;

            } else if (obInstance.type === "helpful") {
                const bgImage = obInstance.obstacleElm.style.backgroundImage;

                if (bgImage.includes("frites")) {
                    updateScore(1);
                } else if (bgImage.includes("kebab")) {
                    updateScore(5);
                } else if (bgImage.includes("kapsalon")) {
                    updateScore(10);
                }
            }

            player.updateLivesUI();
            obInstance.obstacleElm.remove();
            obstacle.splice(obstacle.indexOf(obInstance), 1);


            if (player.lives <= 0) {
                localStorage.setItem ("finalScore",score);
                location.href = "gameover.html";
            }


        };
    });


}, 100);



const keys = {};

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});


setInterval(() => {
    if (keys["ArrowRight"]) player.moveRight();
    if (keys["ArrowLeft"]) player.moveLeft();
    if (keys["ArrowDown"]) player.moveDown();
    if (keys["ArrowUp"]) player.moveJump();
}, 50);


const startSound = new Audio('./module1\OOP GAME\media\food\cortinilla.mp3/food/');

document.getElementById("play-again-button").addEventListener("click", () => {
    startSound.play();
});
