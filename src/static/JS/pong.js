//#region GetElementById
const canvas = document.getElementById("canvas");
const timer = document.getElementById("timer");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const pause = document.getElementById("pause");
const win = document.getElementById("win");
const win2 = document.getElementById("win2");
const draw = document.getElementById("draw");
const resume = document.getElementById("resume");
const restart = document.getElementById("restart");
const leaveBut = document.getElementById("leave");
const Player_1 = document.getElementById("1player");
const Players_2 = document.getElementById("2players");
const notice = document.getElementById("notice");
//#endregion

//#region Canvas conf
const context = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 1000;
//#endregion

//#region keyListener
document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);
resume.addEventListener('click', () => {
    pauseGame();
});
restart.addEventListener('click', () => {
    pauseGame();
    reset();
});
leaveBut.addEventListener('click', () => {
    pauseGame();
    twoPlayer = false;
    isPlaying = false;
    reset();
    Player_1.hidden = false;
    Players_2.hidden = false;
    gameTitle.hidden = false;
});
Player_1.addEventListener('click', () => {
    launch();
});
Players_2.addEventListener('click', () => {
    twoPlayer = true;
    launch()
});

function launch() {
    Player_1.hidden = true;
    Players_2.hidden = true;
    gameTitle.hidden = true;
    notice.hidden = false;
    isPlaying = true;
    play();
}

let w = false;
let s = false;
let up = false;
let down = false;
let gameStarted = false;
let gamePaused = false;
let won = false;
let isPlaying = false;
let twoPlayer = false;
let startPauseTime = 0;
let endPauseTime = 0;

function keyListener(event) {
    var key_state = (event.type == "keydown") ? true : false;
    if (event.key == "w" || event.key == "W" || event.key == "z" || event.key == "Z") {
        s = key_state;
        if(key_state)
            w = !key_state;
    } else if (event.key == "s" || event.key == "S") {
        w = key_state;
        if(key_state)
            s = !key_state;
    } else if (event.key == "ArrowUp") {
        down = key_state;
        if(key_state)
            up = !key_state;
    } else if (event.key == "ArrowDown") {
        up = key_state;
        if(key_state)
            down = !key_state;
    } else if (event.keyCode == 32) {
        if(key_state && !gameStarted && isPlaying) {
            startGame();
        }
    } else if (event.keyCode == 27 || event.keyCode == 80) {
        if(key_state && !won && isPlaying) {
            pauseGame();
        }
    } else if (event.key == "r" || event.key == "R") {
        if(key_state && won) {
            reset();
        }
    }
}
//#endregion

//#region Paddle methods
let paddle_height = 100;
let paddle_width = 13;
let paddleSpeed = 6.25;

class Paddle {
    constructor(x, color) {
        this.x = x;
        this.y = canvas.height/2 - paddle_height / 2;
        this.height = paddle_height;
        this.width = 13;
        this.color = color;
    }
     
    display() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.width, this.height);
        context.fill();
        context.closePath();
        context.beginPath();
        context.strokeStyle = this.color;
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.stroke();
        context.closePath();
    }

    move(moveUp, moveDown) {
        if (moveUp) {
            this.y += paddleSpeed;
            if (this.y + paddle.height >= canvas.height) {
                this.y = canvas.height - paddle.height;
            }
        } else if (moveDown) {
            this.y -= paddleSpeed;
            if (this.y <= 0) {
                this.y = 0;
            }
        }
    }
}

let paddle = new Paddle(0, "#B8081A");
let paddle2 = new Paddle(canvas.width - paddle_width, "#0B0087");

function movePlayers() {
    paddle.move(w, s);
    paddle2.move(up, down);
}


//#endregion

//#region Ball methods
let ballSpeed = 5;
let ballMaxXSpeed = 14;
let ballMaxYSpeed = 7;
let ballStartMaxSpeed = 6;
let ballStartMinSpeed = 4;

class Ball {

    constructor() {
        this.radius = 7;
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
     
    update() {
        // if it hits the top or bottom change direction
        if (this.y < this.radius || this.y > canvas.height - this.radius) {
            this.ySpeed *= -1;
        }
        // if it goes to the end of the sreen restart the game
        if (this.x + this.radius > canvas.width || this.x < this.radius) {
            if (this.x + this.radius > canvas.width) {
                player1score++;
            } else if (this.x < this.radius) {
                player2score++;
            } 
            this.reset();
            startPauseTime = performance.now();
            gameStarted = false;
        }
         
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    reset() {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
     
    start() {
        this.changeDirection();
    }

    changeDirection() {
        this.xSpeed = random(ballStartMinSpeed, ballStartMaxSpeed);
         
        // determines if it's going left or right
        let isLeft = Math.random() > 0.5;
        if (isLeft) {
            this.xSpeed = -this.xSpeed;
        } 
        
        while(this.ySpeed == 0 || this.ySpeed == 1 || this.ySpeed == -1) {
            this.ySpeed = random(-3, 3);
        }
    }
     
    display() {
        context.beginPath();
        context.fillStyle = "#F2F3F4";
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }

    hasHitPlayer1(player) {
        if (this.x - this.radius <= player.x + player.width && this.x > player.x) {
            if (this.isSameHeight(player)) {
                if(this.xSpeed > -ballMaxXSpeed) {
                    this.xSpeed *= -1.2;
                } else {
                    this.xSpeed = ballMaxXSpeed;
                }
                if (this.ballGoingDown()) {
                    if(this.ySpeed < ballMaxYSpeed) {
                        this.ySpeed *= 1.2;
                    } else {
                        this.ySpeed = ballMaxYSpeed;
                    }
                } else {
                    if(this.ySpeed > -ballMaxYSpeed) {
                        this.ySpeed *= 1.2;
                    } else {
                        this.ySpeed = -ballMaxYSpeed;
                    }
                }
            }
        }
    }
           
    hasHitPlayer2(playerbis) {
        if (this.x + this.radius >= playerbis.x && this.x <= playerbis.x + playerbis.width) {
            if (this.isSameHeight(playerbis)) {
                if(this.xSpeed < ballMaxXSpeed) {
                    this.xSpeed *= -1.2;
                } else {
                    this.xSpeed = -ballMaxXSpeed;
                }
                if (this.ballGoingDown()) {
                    if(this.ySpeed < ballMaxYSpeed) {
                        this.ySpeed *= 1.2;
                    } else {
                        this.ySpeed = ballMaxYSpeed;
                    }
                } else {
                    if(this.ySpeed > -ballMaxYSpeed) {
                        this.ySpeed *= 1.2;
                    } else {
                        this.ySpeed = -ballMaxYSpeed;
                    }
                }
            }
        }
    }

    isSameHeight(player) {
        return this.y >= player.y && this.y <= player.y + player.height
    }

    ballGoingDown() {
        return this.ySpeed > 0;
    }
}

let ball = new Ball();

function random(min, max) {
    return Math.floor(Math.random() * (max - (min-1))) + min;
}
//#endregion

//#region AI
function processAI() {
    let middleOfPaddle = paddle.y + paddle.height / 2;
    if ((Math.floor(middleOfPaddle / 10) * 10) == (Math.floor(((ball.y + ball.radius/2)/10)) * 10)) {
        s = false;
        w = false;
    } else if (middleOfPaddle < ball.y + ball.radius/2) {
        w = true;
        s = false;
    } else if (middleOfPaddle > ball.y + ball.radius/2) {
        s = true;
        w = false;
    } else {
        s = false;
        w = false;
    }
}

function processAI2() {
    let middleOfPaddle = paddle2.y + paddle2.height / 2;
    if ((Math.floor(middleOfPaddle / 10) * 10) == (Math.floor(((ball.y + ball.radius/2)/10)) * 10)) {
        down = false;
        up = false;
    } else if (middleOfPaddle < ball.y + ball.radius/2) {
        up = true;
        down = false;
    } else if (middleOfPaddle > ball.y + ball.radius/2) {
        down = true;
        up = false;
    } else {
        down = false;
        up = false;
    }
}
//#endregion

function MyTimer() {
    if(firstStart) {
        time = 60000*countDown;
    } else {
        time = ((60000*countDown) + lastTimer) - performance.now();
    }
    minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((time % (1000 * 60)) / 1000);
}

function pauseGame() {
    if (!gamePaused) {
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

function startGame() {
    ball.start();
    if(firstStart) {
        lastTimer = performance.now();
        notice.hidden = true;
        firstStart = false;
    } else {
        endPauseTime = performance.now();
        lastTimer += (endPauseTime - startPauseTime);
    }
    gameStarted = true;
}

function reset() {
    //reset ball speed
    ball.reset();

    win.hidden = true;
    win2.hidden = true;
    draw.hidden = true;
    won = false;
    gamePaused = false;
    gameStarted = false;
    
    // timer reset
    time = 60000*countDown;
    minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((time % (1000 * 60)) / 1000);
    
    //reset paddle position
    paddle.y = canvas.height / 2 - paddle_height / 2;
    paddle2.y = canvas.height / 2 - paddle_height / 2;

    //reset scores
    player1score = 0;
    player2score = 0;
}

function displayMap() {
    context.beginPath()
    context.moveTo(canvas.width/2, 0);
    context.lineTo(canvas.width/2, canvas.height);
    context.strokeStyle = "white";
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(canvas.width/2, canvas.height/2, 80, 0, Math.PI * 2, true);
    context.stroke();
    context.closePath();
}

function play() {
    if (!gamePaused) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (gameStarted) {
            MyTimer();
            ball.update();
        }

        //show timer
        if (seconds < 10)
            timer.innerHTML ="Time<br>" + minutes + ":0" + seconds;
        else
            timer.innerHTML ="Time<br>" + minutes + ":" + seconds;

        displayMap();
        paddle.display();
        paddle2.display();
        ball.display();
        movePlayers();
        
        if(!twoPlayer)
            processAI2();

        if(minutes == 0 && seconds == 0 && gameStarted) {
            lastTimer = performance.now();
            startPauseTime = performance.now();
            won = true;
            gamePaused = true;
            if(player1score > player2score) {
                win.hidden = false;
            } else if (player1score < player2score) {
                win2.hidden = false;
            } else {
                draw.hidden = false;
            }
        }
        
        ball.hasHitPlayer1(paddle); 
        ball.hasHitPlayer2(paddle2); 

        // update score
        player1.innerHTML = "Player 1<br>" + player1score;
        player2.innerHTML = "Player 2<br>" + player2score;
    }

    if (isPlaying)
        requestAnimationFrame(play);
    else 
        context.clearRect(0, 0, canvas.width, canvas.height);
}

let countDown = 1; // minutes du timer
let time = 0;
var minutes = 0;
var seconds = 0;
let lastTimer = 0;
let firstStart = true;
let player1score = 0;
let player2score = 0;

MyTimer();