const cvs = document.getElementById("snake");
const gameOver = document.getElementById("gameOver");
const pause = document.getElementById("pause");
const resume = document.getElementById("resume");
const restart = document.getElementById("restart");
const gameTitle = document.getElementById("gameTitle");
const playBut = document.getElementById("play");
const leaveBut = document.getElementById("leave");
const win = document.getElementById("Win");
const ctx = cvs.getContext("2d");
cvs.width = 1088;
cvs.height = 704;
const box = 32;

const bg = new Image();
bg.src = "../../res/SnakeBG2.png";

const fruitImage = new Image();
fruitImage.src = "../../res/fraise.png";

let snake = [];
snake[0] = {
    x : cvs.width/2,
    y : cvs.height/2
};

class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * 32 + 1) * box;
        this.y = Math.floor(Math.random() * 18 + 3) * box;
    }
}
fruit = new Fruit();

let score = 0;

let d;
document.addEventListener("keydown", direction);
resume.addEventListener('click', () => {
    pauseGame();
    game = setInterval(render, difficulty)
    gameReset = false;
});
restart.addEventListener('click', () => {
    pauseGame();
    reset()
});
leaveBut.addEventListener('click', () => {
    pauseGame();
    reset();
    playBut.hidden = false;
    gameTitle.hidden = false;
    isPlaying = false;
});
playBut.addEventListener('click', () => {
    playBut.hidden = true;
    gameTitle.hidden = true;
    isPlaying = true;
});

function direction(event) {
    if (!gameStarted) {
        if (event.key === "ArrowLeft" || event.key === "ArrowUp" ||
        event.key === "ArrowRight" || event.key === "ArrowDown") {
            gameStarted = true;
            lastTimer = performance.now();
            console.log("GameStart")
        }
    }
    
    if (event.key === "ArrowLeft" && !changeDirection && d !== "RIGHT") {
        d = "LEFT";
        changeDirection = true;
    } else if (event.key === "ArrowUp" && !changeDirection && d !== "DOWN") {
        d = "UP";
        changeDirection = true;
    } else if (event.key === "ArrowRight" && !changeDirection && d !== "LEFT") {
        d = "RIGHT";
        changeDirection = true;
    } else if (event.key === "ArrowDown" && !changeDirection && d !== "UP") {
        d = "DOWN";
        changeDirection = true;
    }
    if (event.key === " " && gameStarted && !gameReset) {
        pauseGame();
        gameReset = true;
    }
    if(gameReset) {
        if (event.key === "r" || event.key === "R") {
            reset();
        } 
    }
    
}

let difficulty = 100;

//region fruit manager

//draw the fruit
function drawFruit() {
    for (let i = 0; i < snake.length; i++) {
        if (fruit.x === snake[i].x && fruit.y === snake[i].y) {
            fruit = new Fruit();
        }
    }
    ctx.drawImage(fruitImage, fruit.x, fruit.y);
}
//endregion

//region snake manager
let changeDirection = false;

function move() {
    if (d === "LEFT") {
        snakeX -= box;
    } else if (d === "UP") {
        snakeY -= box;
    } else if (d === "RIGHT") {
        snakeX += box;
    } else if (d === "DOWN") {
        snakeY += box;
    }
    if(changeDirection)
        changeDirection = false;
    
    if (d === "SPACE") {

    }
}

//Makes the snake grow when it eats a fruit
function grow() {
    if (snakeX === fruit.x && snakeY === fruit.y) {
        score++;
        fruit = new Fruit();
    } else {
        snake.pop();
    }
}

//Check if the snake is biting its tail or not
function collision(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return false;
}
//endregion

function Win() {
    if (score === 15) {
        gameReset = true;
        clearInterval(game);
        win.style.visibility = "visible";
    }
}

function gameover() {
    if (snakeX < box || snakeX > 32 * box || snakeY < 3 * box || snakeY > 20 * box || collision(newHead, snake)) {
        gameReset = true;
        clearInterval(game);
        gameOver.style.visibility = "visible";
    }
}

function reset() {
    gameReset = false;
    gameStarted = false;
    lastTimer = performance.now();
    score = 0;
    snake = [];
    snake[0] = {
        x : cvs.width/2,
        y : cvs.height/2
    };
    d = "RESET";
    win.style.visibility = "hidden";
    gameOver.style.visibility = "hidden";
    game = setInterval(render, difficulty);
}

let lastTimer = 0;
function MyTimer() {
    let time = performance.now() - lastTimer;
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "40px Changa one";
    ctx.fillText((minutes*60 + seconds), 31 * box, 1.5 * box);
    ctx.closePath();
}
let newHead;
let snakeX = 0;
let snakeY = 0;

function updateSnake() {
    snakeX = snake[0].x;
    snakeY = snake[0].y;
}

function pauseGame() {
    if (!gamePaused) {
        clearInterval(game);
        pause.hidden = false;
        gamePaused = true;
        startPauseTime = performance.now();
    } else {
        pause.hidden = true;
        gamePaused = false;
        endPauseTime = performance.now();
        lastTimer += (endPauseTime - startPauseTime);
    }
}

//draw the game
function render() {
    ctx.drawImage(bg, 0, 0);
    //draw the snake
    if(isPlaying) {
        for (let i = 0; i < snake.length; i++) {

            if (i === 0) {
                ctx.fillStyle = "#1d732f";
            }
            else {
                ctx.fillStyle = "#288f3e";
            }
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        updateSnake()

        if (gameStarted && !gamePaused) {
            grow();
            drawFruit();
            move();
            MyTimer();


            Win();
            newHead = {
                x : snakeX,
                y : snakeY
            }
            //GAME OVER
            gameover();

            //Adding the new head to the snake
            snake.unshift(newHead);
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.font = "40px Changa one";
            ctx.fillText(score, 2 * box, 1.5 * box);
            ctx.closePath();
        }
    }
}

let gamePaused = false;
let gameStarted = false;
let gameReset = false;
let isPlaying = false;
let game = setInterval(render, difficulty);