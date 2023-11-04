const board = {
    topLeft: "",
    topMiddle: "",
    topRight: "",
    middleLeft: "",
    center: "",
    middleRight: "",
    bottomLeft: "",
    bottomMiddle: "",
    bottomRight: ""
};

// Every empty boxes
let id = ["topLeft", "topMiddle", "topRight", "middleLeft", "center", "middleRight", "bottomLeft", "bottomMiddle", "bottomRight"];

let turnCount = 0;

function setValue(position, value) {
    // Remove the id from the id array
    id.splice(id.indexOf(position), 1);

    // Set in board the new value
    board[position] = value;

    // Keep track of turns and update the board
    turnCount += 1; 
    updateBoard();

    // Display user/cpu icon
    if (value == "X") {
        document.getElementById(position).innerHTML = userIcon; 
    } else {
        document.getElementById(position).innerHTML = cpuIcon;
    }

    // If win call score with the value
    if (isWin(value)) { 
        if (id.length == 0) {
            score("tie")
        } else {
            score(value)
        }
    }
}

function isWin(value) {
    if (id.length == 0) {
        return true;
    }

    // If win row1,2,3|col1,2,3|diag1,2
    if (board.topLeft == value && board.topMiddle == value && board.topRight == value) {
        Array.from(document.getElementsByClassName("row1")).map((row) => {
            row.classList.add("highlight");
        });
        return true;
    } else if (board.middleLeft == value && board.center == value && board.middleRight == value) {
        Array.from(document.getElementsByClassName("row2")).map((row) => {
            row.classList.add("highlight");
        });
        return true;
    } else if (board.bottomLeft == value && board.bottomMiddle == value && board.bottomRight == value) {
        Array.from(document.getElementsByClassName("row3")).map((row) => {
            row.classList.add("highlight");
        });
        return true;
    } else if (board.topLeft == value && board.middleLeft == value && board.bottomLeft == value) {
        Array.from(document.getElementsByClassName("col1")).map((col) => {
            col.classList.add("highlight");
        });
        return true;
    } else if (board.topMiddle == value && board.center == value && board.bottomMiddle == value) {
        Array.from(document.getElementsByClassName("col2")).map((col) => {
            col.classList.add("highlight");
        });
        return true;
    } else if (board.topRight == value && board.middleRight == value && board.bottomRight == value) {
        Array.from(document.getElementsByClassName("col3")).map((col) => {
            col.classList.add("highlight");
        });
        return true;
    } else if (board.topLeft == value && board.center == value && board.bottomRight == value) {
        Array.from(document.getElementsByClassName("diag1")).map((diag) => {
            diag.classList.add("highlight");
        });
        return true;
    } else if (board.topRight == value && board.center == value && board.bottomLeft == value) {
        Array.from(document.getElementsByClassName("diag2")).map((diag) => {
            diag.classList.add("highlight");
        });
        return true;
    }
    // If no one has won return false
    return false; 
}