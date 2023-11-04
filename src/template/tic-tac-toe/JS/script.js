// YOU CAN CHANGE NAMES AND ICONS BELOW
let difficulty = 50; // value from 0 to 100 (higher is harder)
const user = "DUCK"; // user name
const cpu = "CPU"; // cpu name
const userIcon = '<img src="./Config/user.png" width="100px" height="100px"/>'; // user icon (default size 100x100)
const cpuIcon = '<img src="./Config/computer.png" width="100px" height="100px"/>'; // cpu  icon (default size 100x100)
let defaultTurn = "user"; // First turn
// YOU CAN CHANGE NAMES AND ICONS ABOVE

// Display both names and the first turn
window.onload = function() {
    document.getElementById("playerScreen").innerHTML = user;
    document.getElementById("cpuScreen").innerHTML = cpu;
    if (defaultTurn == "user") {
        document.getElementById("turnScreen").innerHTML = user + " TURN";
    } else if (defaultTurn == "cpu") {
        document.getElementById("turnScreen").innerHTML = cpu + " TURN";
    }
}

function setUserSymbol(position) {
    // If it's user turn
    if (defaultTurn == "user") {
        // Don't allow if game is win
        if (isWin("X") !== true && isWin("O") !== true) {
            // Don't allow to overwrite
            if (board[position] !== "X" && board[position] !== "O") {
                // Set postion and value of the box
                setValue(position, "X");
                switchPlayer();
            }
        }
    }
}

function setCpuSymbol() {
    let cpuPosition = ia();
    // Set value after few ms then call switchPlayer
    setTimeout(() => { 
        // Set postion and value of the box
        setValue(cpuPosition, "O");
        switchPlayer();
    }, Math.random() * (1000 - 300) + 300);
}

function switchPlayer() {
    // Don't allow if game is win
    if (isWin("X") == false && isWin("O") == false) {
        if (defaultTurn == "user") {
                // Display user turn and change to next player
                document.getElementById("turnScreen").innerHTML = cpu + " TURN"; 
                defaultTurn = "cpu";
                setCpuSymbol();
        } else if (defaultTurn == "cpu") {
                // Display computer turn and change to next player
                document.getElementById("turnScreen").innerHTML = user + " TURN";
                defaultTurn = "user";
        }
    }
}
