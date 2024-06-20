const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 300

//VARIABLES SPRITE
const spriteSheet = new Image();
spriteSheet.src = './sprite.png';

const spriteExplosion = new Image();
spriteExplosion.src = './explosion.png';

const spriteEnemy = new Image();
spriteEnemy.src = './obstacle.png';

const SPRITE_WIDTH = 64;
const SPRITE_HEIGHT = 64;

let spriteX = 64;
let spriteY = 64;

let frameIndex = 0;
const WALK_FRAMES = [0 , 1, 2, 3, 4, 5];
const JUMP_FRAMES = 3;

let lastUpdateTime = Date.now();
const frameDuration = 100; 

//VARIABLES PLAYER
const PLAYER_POS_X = 15
const PLAYER_WIDHT = 50
const PLAYER_HEIGHT =  50
const MARGIN_BOTTOM_PLAYER = 55

let playerPosY = canvas.height - MARGIN_BOTTOM_PLAYER

//VARIABLES OBSTACLE
const OBSTACLE_POS_Y = canvas.height - 50
const OBSTACLE_WIDHT = 45
const OBSTACLE_HEIGHT = 45
const obstacles = [];

let obstaclePosX = canvas.width - 10
let speedObstacle = 2
let obstacleSpawnInterval = 2000;

//VARIABLE KEYWOARD
let arrowUpPressed = false
let arrowDownPressed = false

//VARIABLES SALTO
const GRAVITY = 0.20;
const jumpStrength = -8.5 ;

let speedJumpY = 0;
let isJumping = false;

//VARIABLE SCORE
const blinkInterval = 1000;

let score = 0
let lastTime = 0

//VARIABLE WALKING
let caminando = false

//VARIABLES GAME
let gameOver = false

function drawScene() {
    ctx.fillStyle = '#fff'
    ctx.fillRect(
        0,
        canvas.height / 2 + 125,
        canvas.width,
        1,
    )
}

function drawPlayer() {
    if (gameOver) {
        ctx.drawImage(
            spriteExplosion, // imagen
            0, // clipX: coordenadas de recorte
            0, // clipY: coordenadas de recorte
            SPRITE_WIDTH, // el tamaño del recorte
            SPRITE_HEIGHT, // tamaño del recorte
            PLAYER_POS_X, // posición X del dibujo
            playerPosY, // posición Y del dibujo
            PLAYER_WIDHT, // ancho del dibujo
            PLAYER_HEIGHT // alto del dibujo
        )
    } else if (isJumping) {
        ctx.drawImage(
            spriteSheet, // imagen
            spriteX * JUMP_FRAMES, // clipX: coordenadas de recorte
            spriteY, // clipY: coordenadas de recorte
            SPRITE_WIDTH, // el tamaño del recorte
            SPRITE_HEIGHT, // tamaño del recorte
            PLAYER_POS_X, // posición X del dibujo
            playerPosY, // posición Y del dibujo
            PLAYER_WIDHT, // ancho del dibujo
            PLAYER_HEIGHT // alto del dibujo
        )

    } else {
        const now = Date.now();
        const deltaTime = now - lastUpdateTime;

        if (deltaTime > frameDuration) {
            frameIndex = (frameIndex + 1) % WALK_FRAMES.length;
            lastUpdateTime = now;
        }
        const currentFrame = WALK_FRAMES[frameIndex];
        ctx.drawImage(
            spriteSheet, // imagen
            spriteX * currentFrame, // clipX: coordenadas de recorte
            spriteY, // clipY: coordenadas de recorte
            SPRITE_WIDTH, // el tamaño del recorte
            SPRITE_HEIGHT, // tamaño del recorte
            PLAYER_POS_X, // posición X del dibujo
            playerPosY, // posición Y del dibujo
            PLAYER_WIDHT, // ancho del dibujo
            PLAYER_HEIGHT // alto del dibujo
        )
    }
}

function createObstacle() {
    obstacles.push({
        x: canvas.width - 10,
        y: OBSTACLE_POS_Y,
        width: OBSTACLE_WIDHT,
        height: OBSTACLE_HEIGHT
    });
}

function drawObstacle() {
    for (let obstacle of obstacles) {
        ctx.drawImage(
            spriteEnemy, // imagen
            0, // clipX: coordenadas de recorte
            0, // clipY: coordenadas de recorte
            SPRITE_WIDTH, // el tamaño del recorte
            SPRITE_HEIGHT, // tamaño del recorte
            obstacle.x, // posición X del dibujo
            obstacle.y, // posición Y del dibujo
            obstacle.width, // ancho del dibujo
            obstacle.height // alto del dibujo
        )
    }
}

function drawScore() {
    const zeroPad = String(score).padStart(5, '0')
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = '#fff'
    ctx.fillText(`${zeroPad}`, canvas.width - 65, 25)
}

function obstacleMovement() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speedObstacle;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function colision() {
    for (let i = 0; i < obstacles.length; i++) {
        const isSamePositionY =
            playerPosY < obstacles[i].y &&
            playerPosY > obstacles[i].y - obstacles[i].height

        const isTouchObstacle = 
            PLAYER_POS_X > obstacles[i].x - obstacles[i].width

        if (isSamePositionY && isTouchObstacle) {
            gameOver = true
        }
    }
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function checkIsJumping() {
    if (isJumping) {
        speedJumpY += GRAVITY;
        playerPosY += speedJumpY;
    
        if (playerPosY > canvas.height - MARGIN_BOTTOM_PLAYER) {
            playerPosY = canvas.height - MARGIN_BOTTOM_PLAYER;
            speedJumpY = 0;
            isJumping = false;
        }
    }
}

function jump() {
    if (!isJumping) {
        isJumping = true;
        speedJumpY = jumpStrength;
    }
}

function incrementScore(timestamp) {
    if (timestamp - lastTime > blinkInterval) {
        lastTime = timestamp;
        score++;
    }
}


function setGameOver() {
    speedObstacle = 0
    const MESSAGE = 'GAME OVER'
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = '#fff'
    ctx.fillText(MESSAGE, canvas.width/2 - 50, canvas.height/2)
    document.getElementById('button-reset-game').style.display = 'block'
}

function initEvents() {
    if (!gameOver) {
        document.addEventListener('keydown', keyDownHandler)
        function keyDownHandler(event) {
            const { key } = event
            if (key === 'Up' || key === 'ArrowUp' || event.code === 'Space') {
                jump()
            } else if (key === 'Down' || key === 'ArrowDown') {
                //TODO
            }
        }
    }
}

function game(timestamp) {
    cleanCanvas()
    drawScene()
    drawPlayer()
    drawObstacle()
    drawScore()
    if (gameOver) {
        setGameOver()
    } else {
        checkIsJumping()
        obstacleMovement()
        colision()
        incrementScore(timestamp)
    }
    window.requestAnimationFrame(game)
}

function startGame() {
    game();
    initEvents();
    setInterval(createObstacle, obstacleSpawnInterval);
}

startGame();