
class Player {

    constructor() {
        this.width = 10;
        this.height = 10;
        this.positionX = 5;
        this.positionY = 0;
        this.velocityY = 8;
        this.gravity = -0.4;
        this.lives = 3;
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
        this.positionY--;
        this.updatePlayerPosition();
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
        this.width = 5;
        this.height = 5;
        this.positionX = 100;
        const maxJumpHeight = 20;
        this.positionY = Math.floor(Math.random() * (maxJumpHeight - this.height));
        this.type = Math.random() < 0.7 ? "harmful" : "helpful";
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
        this.obstacleElm.classList.add("obstacle");
        this.obstacleElm.classList.add(this.type);
        const parentElm = document.getElementById("board");
        parentElm.appendChild(this.obstacleElm);
    }

    

    horizontalMovement() {
        this.positionX--;
        this.updateObjectPosition();

    }

}






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


function spawnObstacleRandomly() {
    const newObstacle = new Obstacle();
    obstacle.push(newObstacle);

    const delay = Math.random() * (1000 - 1500) + 2000;
    setTimeout(spawnObstacleRandomly, delay);
}

spawnObstacleRandomly();



setInterval(() => {
    obstacle.forEach((obInstance) => {
        obInstance.horizontalMovement();

        if (
            player.positionX < obInstance.positionX + obInstance.width &&
            player.positionX + player.width > obInstance.positionX &&
            player.positionY < obInstance.positionY + obInstance.height &&
            player.positionY + player.height > obInstance.positionY
        ) {
            if (obInstance.type === "harmful"){
                player.lives--;
            }else if (obInstance.type === "helpful"){
                if (player.lives < 5) player.lives++;
            }

            player.updateLivesUI();
            obInstance.obstacleElm.remove();
            obstacle.splice(obstacle.indexOf(obInstance),1);

            if (player.lives <=0){
                location.href = "gameover.html"
            }
            
            
        };
    });


}, 300);



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
