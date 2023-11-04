let playerScore = 0;
let tiesScore = 0;
let cpuScore = 0;
const initialTurn = defaultTurn;

function score(value) {
    // Win of Cross|Nought|Tie
    if (value == "X") { 
        playerScore += 1;
        document.getElementById("turnScreen").innerHTML = user + " WIN";
        document.getElementById("playerWin").innerHTML = playerScore + " WIN";
    } else if (value == "O") { 
        cpuScore += 1;
        document.getElementById("turnScreen").innerHTML = cpu + " WIN";
        document.getElementById("cpuWin").innerHTML = cpuScore + " WIN";
    } else {
        tiesScore += 1;
        document.getElementById("turnScreen").innerHTML = "TIE";
        document.getElementById("ties").innerHTML = tiesScore + " TIE";
    }

    // Reset few seconds after
    setTimeout(() => { 
        reset();
    }, 2000);
}

function reset() {
    // Reset board value
    Object.keys(board).map((boardValue) => {
        board[boardValue] = '';
    });

    // Reset displayed value
    Array.from(document.getElementsByClassName("box")).map((item) => {
        item.innerHTML = "";
    });

    // Reset highlighted boxes
    Array.from(document.getElementsByClassName("box")).map((item) => {
        item.classList.remove("highlight");
    });

    // Reset id array
    id.splice(0, id.length);
    id = Object.keys(board);

    // Reset turn count
    turnCount = 0;

    // Set first turn after reset
    defaultTurn = initialTurn;
    if (initialTurn == "user") {
        document.getElementById("turnScreen").innerHTML = user + " TURN";
    } else {
        document.getElementById("turnScreen").innerHTML = cpu + " TURN";
    }
}