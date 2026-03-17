const n = 8;
let step = 0, prevRow = -1, prevCol = -1, firstRow = 0, firstCol = 0;
let board = [];

function Load() {
    for (let i = 0; i < n; i++) {
        board[i] = []
        for (let j = 0; j < n; j++) {
            document.getElementById(i + "" + j).disabled = true;
            document.getElementById(i + "" + j).innerHTML = "";
            board[i][j] = 0;
        }
    }
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
    document.getElementById("solveBtn").disabled = true;
}

function IsValidMove(prevRow, prevCol, currRow, currCol) {
    if (prevRow === -1 && prevCol === -1) {
        return true;
    }
    return (Math.abs(currRow - prevRow) === 1 && Math.abs(currCol - prevCol) === 2) || (Math.abs(currRow - prevRow) === 2 && Math.abs(currCol - prevCol) === 1);
}

function NoValidMoves(n, board, row, col) {
    let dy = [-2, -1, 1, 2, 2, 1, -1, -2];
    let dx = [1, 2, 2, 1, -1, -2, -2, -1];
    for (let i = 0; i < 8; i++) {
        if (row + dy[i] >= 0 && row + dy[i] <= n - 1 && col + dx[i] >= 0 && col + dx[i] <= n - 1) {
            if (board[row + dy[i]][col + dx[i]] === 0) {
                return false;
            }
        }
    }
    return true;
}

function Start() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            document.getElementById(i + "" + j).disabled = false;
        }
    }
    document.getElementById("startBtn").disabled = true;
    document.getElementById("solveBtn").disabled = false;
}

function Restart() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            document.getElementById(i + "" + j).innerHTML = "";
            board[i][j] = 0;
        }
    }
    step = 0;
    prevRow = -1;
    prevCol = -1;
    firstRow = 0;
    firstCol = 0;
    document.getElementById("startBtn").disabled = false;
    document.getElementById("restartBtn").disabled = true;
    document.getElementById("solveBtn").disabled = true;
}

function Heuristics(n, board, row, col) {
    let minValidMovesIdx = [], minValidMovesCnt = 1000;
    let dy = [-2, -1, 1, 2, 2, 1, -1, -2];
    let dx = [1, 2, 2, 1, -1, -2, -2, -1];
    for (let i = 0; i < 8; i++) {
        if (row + dy[i] >= 0 && row + dy[i] <= n - 1 && col + dx[i] >= 0 && col + dx[i] <= n - 1) {
            if (board[row + dy[i]][col + dx[i]] === 0) {
                let r = row + dy[i], c = col + dx[i];
                let validMovesCnt = 0;
                for (let j = 0; j < 8; j++) {
                    if (r + dy[j] >= 0 && r + dy[j] <= n - 1 && c + dx[j] >= 0 && c + dx[j] <= n - 1) {
                        if (board[r + dy[j]][c + dx[j]] === 0) {
                            validMovesCnt++;
                        }
                    }
                }
                if (validMovesCnt < minValidMovesCnt) {
                    minValidMovesCnt = validMovesCnt;
                    minValidMovesIdx = [i];
                }
                else if (validMovesCnt === minValidMovesCnt) {
                    minValidMovesIdx.push(i);
                }
            }
        }
    }
    return minValidMovesIdx;
}

let success;
function SolveKT(step, row, col) {
    if (step === n * n) {
        success = true;
    }
    else {
        let dy = [-2, -1, 1, 2, 2, 1, -1, -2];
        let dx = [1, 2, 2, 1, -1, -2, -2, -1];
        let move = 0, minValidMovesIdx = Heuristics(n, board, row, col);
        success = false;
        while (move < minValidMovesIdx.length && !success) {
            board[row + dy[minValidMovesIdx[move]]][col + dx[minValidMovesIdx[move]]] = step + 1;
            if (!SolveKT(step + 1, row + dy[minValidMovesIdx[move]], col + dx[minValidMovesIdx[move]])) {
                board[row + dy[minValidMovesIdx[move]]][col + dx[minValidMovesIdx[move]]] = 0;
            }
            move++;
        }
    }
    return success;
}

function Solve() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            board[i][j] = 0;
        }
    }
    board[firstRow][firstCol] = 1;
    SolveKT(1, firstRow, firstCol);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (board[i][j] === n * n) {
                document.getElementById(i + "" + j).innerHTML = '<img src="Knight.gif" width="100%" height="80%">';
            }
            else {
                document.getElementById(i + "" + j).innerText = board[i][j];
            }
            document.getElementById(i + "" + j).disabled = true;
        }
    }
    document.getElementById("restartBtn").disabled = false;
    document.getElementById("solveBtn").disabled = true;
}

function GameOver() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            document.getElementById(i + "" + j).disabled = true;
        }
    }
    document.getElementById("restartBtn").disabled = false;
    document.getElementById("solveBtn").disabled = true;
}

function KnightMove(row, col) {
    if (IsValidMove(prevRow, prevCol, row, col)) {
        if (prevRow !== -1 && prevCol !== -1) {
            document.getElementById(prevRow + "" + prevCol).innerText = step;
        }
        else {
            firstRow = row;
            firstCol = col;
        }
        step++;
        document.getElementById(row + "" + col).innerHTML = '<img src="Knight.gif" width="100%" height="80%">';
        document.getElementById(row + "" + col).disabled = true;
        board[row][col] = step;
        prevRow = row;
        prevCol = col;
        if (step === n * n) {
            GameOver();
            alert("Solved!");
        }
        else if (NoValidMoves(n, board, row, col)) {
            GameOver();
            alert("Game Over!");
        }
    }
}

Load();