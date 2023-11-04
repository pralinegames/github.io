//#region GetElementById
const canvas = document.getElementById("canvas");
const timer = document.getElementById("timer");
const score = document.getElementById("score");
const highScore = document.getElementById("high-score");
const pause = document.getElementById("pause");
const win = document.getElementById("win");
const lose = document.getElementById("lose");
const resetBut = document.querySelector(".reset");
const resume = document.getElementById("resume");
const restart = document.getElementById("restart");
const playBut = document.getElementById("play");
const gameTitle = document.getElementById("gameTitle");
const leaveBut = document.getElementById("leave");
const levelText = document.querySelector(".level");
const notice = document.getElementById("notice");
let highScoreInt = parseInt(localStorage.getItem('highScore'));

function initializeHS() {
    if (isNaN(highScoreInt)) {
        highScoreInt = 0;
        localStorage.setItem('highScore', highScoreInt);
    }
}
initializeHS();
//#endregion

//#region Canvas conf
const context = canvas.getContext('2d');
canvas.height = 720;
canvas.width = 720;
//#endregion

//#region keyListener
document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);
resetBut.addEventListener('click', () => {
    highScoreInt = 0;
    localStorage.setItem("highScore", 0);
});
resume.addEventListener('click', () => {
    pauseGame();
});
restart.addEventListener('click', () => {
    pauseGame();
    reset();
});
leaveBut.addEventListener('click', () => {
    pauseGame();
    isPlaying = false;
    reset();
    playBut.hidden = false;
    gameTitle.hidden = false;
    levelText.innerHTML = "Level " + level;
});
playBut.addEventListener('click', () => {
    playBut.hidden = true;
    gameTitle.hidden = true;
    notice.hidden = false;
    highScore.innerHTML = "Best Score<br>" + highScoreInt;
    showLevel();
    isPlaying = true;
    generateBricks();
    play();
});

let right = false;
let left = false;
let gameStarted = false;
let gamePaused = false;
let lost = false;
let won = false;
let startPauseTime = 0;
let endPauseTime = 0;

function keyListener(event) {
    var key_state = (event.type == "keydown") ? true : false;
    if(isPlaying) {
        if (event.keyCode == 65 || event.key == "q" || event.key == "Q") {
            left = key_state;
            if(key_state)
                right = !key_state;
        } else if (event.keyCode == 68) {
            right = key_state;
            if(key_state)
                left = !key_state;
        } else if (event.keyCode == 32) {
            if(key_state && !gameStarted && isPlaying) {
                startGame();
            }
        } else if (event.keyCode == 27 || event.keyCode == 80) {
            if(key_state && isPlaying && !lost && !won) {
                pauseGame();
            }
        } else if (event.keyCode == 82) {
            if(key_state && lost || key_state && won) {
                reset();
            }
        }
    }
}
//#endregion

//#region Paddle methods
let paddle_width = 100;
let paddleSpeed = 7;

let paddle = {
    height: 13,
    width: paddle_width,
    y: canvas.width / 2 - paddle_width / 2,
    draw: function() {
        context.beginPath();
        context.fillStyle = "#0079BA";
        context.fillRect(this.y, canvas.height - this.height, this.width/4, this.height);
        context.closePath();
        context.beginPath();
        context.fillStyle = "#4EAFD6";
        context.fillRect(this.y + this.width/4, canvas.height - this.height, this.width/2, this.height);
        context.closePath();
        context.beginPath();
        context.fillStyle = "#0079BA";
        context.fillRect(this.y + (this.width/4)*3, canvas.height - this.height, this.width/4, this.height);
        context.closePath();
        context.beginPath();
        context.strokeStyle = "#4EAFD6";
        context.strokeRect(this.y, canvas.height - this.height, this.width, this.height,);
        context.closePath();
    }
};

function movePaddle() {
    if (right) {
        paddle.y += paddleSpeed;
        if (paddle.y + paddle.width >= canvas.width) {
            paddle.y = canvas.width - paddle.width;
        }
    } else if (left) {
        paddle.y -= paddleSpeed;
        if (paddle.y <= 0) {
            paddle.y = 0;
        }
    }
}
//#endregion

//#region Ball methods
let ballSpeed = 5;
let ballMaxSpeed = 6;
let ballMinSpeed = 3;

let ball = {
    x: canvas.width/2,
    y: canvas.height - paddle.height - 15,
    dx: 0,
    dy: 0,
    radius: 7,
    draw: function() {
        context.beginPath();
        context.fillStyle = "#F2F3F4";
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
        context.beginPath();
        context.fillStyle = "#4EAFD6";
        context.arc(this.x, this.y, this.radius/1.5, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();
    }
};

function bounceWall() {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    } else if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
}

function bounchPaddle() {
    let area = ((paddle.width + paddle.y) - ball.x) / paddle.width;
    if (ball.y + ball.radius >= canvas.height - paddle.height && ball.y < canvas.height) 
    {
        //from right to left /
        if (ball.dx < 0) {
            if (ball.x >= paddle.y && ball.x <= paddle.y + (paddle.width - paddle.width/4)) {
                changeAngle(area, "strait", "right")
            } else if (ball.x >= paddle.y + (paddle.width - paddle.width/4) && ball.x <= paddle.y + paddle.width) {
                changeAngle(area, "reverse", "right")
            }
        //from left to right \
        } else if (ball.dx > 0) {
            if (ball.x >= paddle.y + paddle.width/4 && ball.x <= paddle.y + paddle.width) {
                changeAngle(area, "strait", "left")
            } else if (ball.x >= paddle.y && ball.x <= paddle.y + paddle.width/4) {
                changeAngle(area, "reverse", "left")
            }
        }
    }
}

function changeAngle(area, direction, from) {
    let acceleration = 0;

    if (area <= 0.5) {
        acceleration = 0.5 - area;
    } else {
        acceleration = 0.5 - (1 - area);
    }

    if (acceleration < 0.25) {
        if (ball.dy + (0.5) - acceleration < ballMaxSpeed) {
            ball.dy += (0.5) - acceleration;
            decelerateDX((0.5) - acceleration);
        } else {
            ball.dy = ballMaxSpeed;
            decelerateDX((0.5) - acceleration);
        }
        console.log((0.5) - acceleration)
    } else {
        if (ball.dy - acceleration > ballMinSpeed) {
            ball.dy -= acceleration;
        } else {
            ball.dy = ballMinSpeed;
        }
        accelerateDX(acceleration)
        console.log(acceleration)
    }

    if (direction == "reverse") {
        ball.dx *= -1;
    }
    ball.dy *= -1;
}

function decelerateDX(acceleration) {
    if (ball.dx > 0) {
        if (ball.dx - acceleration > ballMinSpeed) {
            ball.dx -= acceleration;
        } else {
            ball.dx = ballMinSpeed;
        }
    } else {
        if (ball.dx + acceleration < -ballMinSpeed) {
            ball.dx += acceleration;
        } else {
            ball.dx = -ballMinSpeed;
        }
    }
    console.log("dx -> " + ball.dx + "\ndy -> " + ball.dy);
}

function accelerateDX(acceleration) {
    if (ball.dx > 0) {
        if (ball.dx + acceleration < ballMaxSpeed) {
            ball.dx += acceleration;
        } else {
            ball.dx = ballMaxSpeed;
        }
    } else {
        if (ball.dx - acceleration > -ballMaxSpeed) {
            ball.dx -= acceleration;
        } else {
            ball.dx = -ballMaxSpeed;
        }
    }
    console.log("dx -> " + ball.dx + "\ndy -> " + ball.dy);
}

function collisionDetection() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (ball.y + ball.radius >= b.y && ball.y <= b.y + brick.height) 
                {
                    if (ball.x + ball.radius >= b.x && ball.x <= b.x + brick.width) {
                        if (ball.x < b.x || ball.x + ball.radius > b.x + brick.width) {
                            ball.dx *= -1;
                        } else { 
                            ball.dy *= -1;
                        }
                        b.status = 0;
                        scoreInt += 150;
                        blockDestroyed++;
                    }
                }
            }
        }
    }
}
//#endregion

//#region Bricks methods
let brick = {
    rowCount: 5,
    columnCount: 7,
    width: 75,
    height: 20,
    padding: 20,
    offsetTop: 30,
    offsetLeft: 37.5
}
let bricks = [];

function generateBricks() {
    for (let c = 0; c < brick.columnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brick.rowCount; r++) {
            bricks[c][r] = {x: 0, y:0 , status: 1}
        }
    }
}

var brickImage = new Image();
brickImage.src = "../../res/greenbricks.png"

function drawBricks() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
                let brickY = r * (brick.height + brick.padding) + brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.drawImage(brickImage, brickX, brickY, brick.width, brick.height);
                context.closePath();
                context.beginPath();
                context.strokeStyle = "#ffffff";
                context.strokeRect(brickX, brickY, brick.width, brick.height);
                context.closePath();
            }
        }
    }
}
//#endregion

let Timer = {
    seconds: 0,
    minutes: 0,
}

function MyTimer() {
    let time = performance.now() - lastTimer;
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    Timer.seconds = seconds;
    Timer.minutes = minutes;
    if (seconds != lastsecond && gameStarted) {
        scoreInt -= 5;
        lastsecond = seconds;
    }
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
    notice.hidden = true;
    scoreInt = 500;
    showLevel();
    if ((paddle.y + paddle.width/2) < canvas.width/2) {
        ball.dx = -ballSpeed;
    } else {
        ball.dx = ballSpeed;
    }
    ball.dy = ballSpeed - 1;
    lastTimer = performance.now();
    gameStarted = true;
}

function nextLevel() {
    let speedBoost = 2;
    if (blockDestroyed % (brick.columnCount * brick.rowCount) == 0 
        && blockDestroyed != 0) 
    {
        if (canLevelUp) {
            if (ball.dy > 0) {
                ball.dy += speedBoost;
            } else if (ball.dy < 0) {
                ball.dy -= speedBoost;
            }
            ballMaxSpeed += speedBoost;
            ballMinSpeed += speedBoost;
            paddleSpeed += speedBoost;
            level++;
            showLevel();
            canLevelUp = false;
        }

        if (ball.y > canvas.height / 2) {
            generateBricks();
        }
    }
    if(blockDestroyed % (brick.columnCount * brick.rowCount) != 0)
            canLevelUp = true;
}

function showLevel() {
    levelText.innerHTML = "Level " + (level+1);
}

function reset() {
    lose.hidden = true;
    lost = false;
    win.hidden = true;
    won = false;
    gamePaused = false;
    gameStarted = false;

    storeHighScore();
    generateBricks();

    //reset ball speed
    ballSpeed = 5;
    ballMaxSpeed = 6;
    ballMinSpeed = 3;

    //reset timer
    lastTimer = performance.now();
    startPauseTime = 0;
    endPauseTime = 0;
    MyTimer();

    //reset level
    level = 0;
    blockDestroyed = 0;
    
    
    //reset ball position
    ball.dx = 0;
    ball.dy = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.height - paddle.height - 15;

    //reset paddle position
    paddle.y = canvas.width / 2 - paddle_width / 2;
}

function storeHighScore() {
    if (scoreInt > parseInt(localStorage.getItem('highScore'))) {
        localStorage.setItem('highScore', scoreInt.toString());
        highScoreInt = parseInt(localStorage.getItem('highScore'));
    }
    highScore.innerHTML = "Best Score<br>" + highScoreInt;
    scoreInt = 0;
}

function play() {
    if (!gamePaused) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (gameStarted) {
            MyTimer();
        }
        ball.draw();
        paddle.draw();
        drawBricks();
        movePaddle();
        collisionDetection();
        nextLevel()
        
        // Win game
        if (level == 2) {
            scoreInt += 500;
            storeHighScore();
            won = true;
            gamePaused = true;
            win.hidden = false;
        }

        // Lose game
        if (ball.y + ball.radius > canvas.height) {
            lost = true;
            gamePaused = true;
            lose.hidden = false;
        }

        //Follow paddle while not launched
        if (!gameStarted) {
            ball.x = paddle.y + paddle.width/2;
        }

        // update score
        score.innerHTML = "Score<br>" + scoreInt;
        if (Timer.seconds < 10)
            timer.innerHTML ="Time<br>" + Timer.minutes + ":0" + Timer.seconds;
        else
            timer.innerHTML ="Time<br>" + Timer.minutes + ":" + Timer.seconds;

        // Makes the ball move
        ball.x += ball.dx;
        ball.y += ball.dy;
        bounceWall();
        bounchPaddle();
    }

    if (isPlaying)
        requestAnimationFrame(play);
    else 
        context.clearRect(0, 0, canvas.width, canvas.height);
}

let isPlaying = false;
let canLevelUp = true;
let lastsecond = 0;
let lastTimer = 0;
let scoreInt = 0;
let blockDestroyed = 0;
let level = 0;
