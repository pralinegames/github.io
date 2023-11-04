const corners = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
const edges = ["topMiddle", "middleLeft", "middleRight", "bottomMiddle"];
let  row1 = "";
let  row2 = "";
let  row3 = "";
let  col1 = "";
let  col2 = "";
let  col3 = "";
let  diag1 = "";
let  diag2 = "";

function updateBoard() {
    row1 = "topLeft" + board.topLeft + " topMiddle" + board.topMiddle + " topRight" + board.topRight;
    row2 = "middleLeft" + board.middleLeft + " center" + board.center + " middleRight" + board.middleRight;
    row3 = "bottomLeft" + board.bottomLeft + " bottomMiddle" + board.bottomMiddle + " bottomRight" + board.bottomRight;
    col1 = "topLeft" + board.topLeft + " middleLeft" + board.middleLeft + " bottomLeft" + board.bottomLeft;
    col2 = "topMiddle" + board.topMiddle + " center" + board.center + " bottomMiddle" + board.bottomMiddle;
    col3 = "topRight" + board.topRight + " middleRight" + board.middleRight + " bottomRight" + board.bottomRight;
    diag1 = "topLeft" + board.topLeft + " center" + board.center + " bottomRight" + board.bottomRight;
    diag2 = "topRight" + board.topRight + " center" + board.center + " bottomLeft" + board.bottomLeft;
};

function ia() {
    // If random is above difficulty then play random
    let randomValue = Math.floor((Math.random() * 100));
    if (randomValue > difficulty) {
        console.log("Random move " + randomValue + " is > than " + difficulty)
        return id[Math.floor(Math.random() * id.length)];
    }
    console.log("I'm smarter than you");

    if (turnCount + 1 == 1) {
        return "center";
    } else if (turnCount + 1 == 2) {
        // If user takes center take one corner else take center
        if (board.center == "X") {
            return corners[Math.floor(Math.random() * corners.length)]; 
        } else {
            return "center"; 
        }
    }
    // Check if cpu can win row1,2,3|col1,2,3|diag,1,2
    if (/.+O(?=(.+O))/.test(row1) && /.+X/.test(row1) == false) {
        return row1.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }
    if (/.+O(?=(.+O))/.test(row2) && /.+X/.test(row2) == false) {
        return row2.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }
    if (/.+O(?=(.+O))/.test(row3) && /.+X/.test(row3) == false) {
        return row3.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }
    if (/.+O(?=(.+O))/.test(col1) && /.+X/.test(col1) == false) {
        return col1.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }
    if (/.+O(?=(.+O))/.test(col2) && /.+X/.test(col2) == false) {
        return col2.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }
    if (/.+O(?=(.+O))/.test(col3) && /.+X/.test(col3) == false) {
        return col3.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }
    if (/.+O(?=(.+O))/.test(diag1) && /.+X/.test(diag1) == false) {
        return diag1.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }
    if (/.+O(?=(.+O))/.test(diag2) && /.+X/.test(diag2) == false) {
        return diag2.match(/\b\w[^O]*(?!O)\S\b/g).toString();
    }

    // Check if opponent can win row1,2,3|col1,2,3|diag,1,2
    if (/.+X(?=(.+X))/.test(row1) && /.+O/.test(row1) == false) {
        return row1.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }
    if (/.+X(?=(.+X))/.test(row2) && /.+O/.test(row2) == false) {
        return row2.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }
    if (/.+X(?=(.+X))/.test(row3) && /.+O/.test(row3) == false) {
        return row3.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }
    if (/.+X(?=(.+X))/.test(col1) && /.+O/.test(col1) == false) {
        return col1.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }
    if (/.+X(?=(.+X))/.test(col2) && /.+O/.test(col2) == false) {
        return col2.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }
    if (/.+X(?=(.+X))/.test(col3) && /.+O/.test(col3) == false) {
        return col3.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }
    if (/.+X(?=(.+X))/.test(diag1) && /.+O/.test(diag1) == false) {
        return diag1.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }
    if (/.+X(?=(.+X))/.test(diag2) && /.+O/.test(diag2) == false) {
        return diag2.match(/\b\w[^X]*(?!X)\S\b/g).toString();
    }

    // Opposite corner strategy
    if (board.center == "X") {
        if (board.bottomLeft == "X") {
            if (board.bottomRight == "") {
                return "bottomRight";
            } if (board.topLeft == "") {
                return "topLeft";
            }
        }
        if (board.bottomRight == "X") {
            if (board.bottomLeft == "") {
                return "bottomLeft";
            } if (board.topRight == "") {
                return "topRight";
            }
        }
        if (board.topLeft == "X") {
            if (board.bottomLeft == "") {
                return "bottomLeft";
            } if (board.topRight == "") {
                return "topRight";
            }
        }
        if (board.topRight == "X") {
            if (board.topLeft == "") {
                return "topLeft";
            } if (board.bottomRight == "") {
                return "bottomRight";
            }
        }
    }

    // "A" strategy
    if (board.topMiddle == "X") {
        if (board.bottomRight == "X" && board.topRight == "") {
            return "topRight";
        } if (board.bottomLeft == "X"&& board.topLeft == "") {
            return "topLeft";
        }
    }
    if (board.middleLeft == "X") {
        if (board.topRight == "X" && board.topLeft == "") {
            return "topLeft";
        } if (board.bottomRight == "X"&& board.bottomLeft == "") {
            return "bottomLeft";
        }
    }
    if (board.middleRight == "X") {
        if (board.topLeft == "X" && board.topRight == "") {
            return "topRight";
        } if (board.bottomLeft == "X"&& board.bottomRight == "") {
            return "bottomRight";
        }
    }
    if (board.bottomMiddle == "X") {
        if (board.topLeft == "X" && board.bottomLeft == "") {
            return "bottomLeft";
        } if (board.topRight == "X"&& board.bottomRight == "") {
            return "bottomRight";
        }
    }

    // Corners stategy
    if (board.topLeft == "X" && board.bottomRight == "X") {
        if (board.topMiddle == "" && board.middleLeft == "" && board.middleRight == "" && board.bottomMiddle == "") {
            return edges[Math.floor(Math.random() * edges.length)];
        }
    }
    if (board.topRight == "X" && board.bottomLeft == "X") {
        if (board.topMiddle == "" && board.middleLeft == "" && board.middleRight == "" && board.bottomMiddle == "") {
            return edges[Math.floor(Math.random() * edges.length)];
        }
    }

    // Edges strategy
    if (board.topMiddle == "X" && board.middleLeft == "X" && board.topLeft == "") {
        return "topLeft";
    }
    if (board.topMiddle == "X" && board.middleRight == "X" && board.topRight == "") {
        return "topRight";
    }
    if (board.bottomMiddle == "X" && board.middleLeft == "X" && board.bottomLeft == "") {
        return "bottomLeft";
    }
    if (board.bottomMiddle == "X" && board.middleRight == "X" && board.bottomRight == "") {
        return "bottomRight";
    }

    // If no strategy are useful choose random
    return id[Math.floor(Math.random() * id.length)];
}