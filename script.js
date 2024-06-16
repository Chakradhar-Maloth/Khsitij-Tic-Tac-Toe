const playerXColor = '#ffcccb';
const playerOColor = '#add8e6';
const defaultCellColor = '#ffffff';

let currentPlayer = 'X';
let boardSize = 3;
let player1 = 'Player 1';
let player2 = 'Player 2';
let mode = 'solo';
let scores = { X: 0, O: 0 };
let gameBoard = [];
let gameFrozen = false;

function startGame() {
    player1 = document.getElementById('player1-name').value || 'Player 1';
    player2 = document.getElementById('player2-name').value || 'Player 2';
    mode = document.getElementById('mode').value;
    boardSize = parseInt(document.getElementById('board-size').value);
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'block';
    document.getElementById('score-player1').textContent = `${player1}: 0`;
    document.getElementById('score-player2').textContent = `${mode === 'solo' ? 'Computer' : player2}: 0`;
    document.getElementById('turn-info').textContent = `Turn for ${player1}`;
    initGameBoard();
}

function initGameBoard() {
    const gameBoardContainer = document.getElementById('game-board');
    gameBoardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 0fr)`;
    gameBoardContainer.innerHTML = '';
    gameBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(''));

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.style.backgroundColor = defaultCellColor; // Set default cell color
            cell.addEventListener('click', () => makeMove(i, j));
            gameBoardContainer.appendChild(cell);
        }
    }
}

function makeMove(i, j) {
    if (gameFrozen || gameBoard[i][j] !== '') return;
    gameBoard[i][j] = currentPlayer;
    drawBoard();
    if (checkWin(i, j)) {
        scores[currentPlayer]++;
        updateScores();
        displayWinnerMessage(`${currentPlayer === 'X' ? player1 : (mode === 'solo' ? 'Computer' : player2)} wins!`);
        setTimeout(resetGameBoard, 2000);
        return;
    }
    if (isDraw()) {
        displayWinnerMessage("It's a draw!");
        setTimeout(resetGameBoard, 2000);
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('turn-info').textContent = `Turn for ${currentPlayer === 'X' ? player1 : (mode === 'solo' ? 'Computer' : player2)}`;
    if (mode === 'solo' && currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    let availableMoves = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameBoard[i][j] === '') {
                availableMoves.push({ i, j });
            }
        }
    }
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(move.i, move.j);
}

function drawBoard() {
    const cells = document.getElementById('game-board').children;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = cells[i * boardSize + j];
            cell.textContent = gameBoard[i][j];
            cell.style.backgroundColor = gameBoard[i][j] === 'X' ? playerXColor : gameBoard[i][j] === 'O' ? playerOColor : defaultCellColor;
        }
    }
}

function checkWin(x, y) {
    let win = true;
    for (let i = 0; i < boardSize; i++) {
        if (gameBoard[x][i] !== currentPlayer) {
            win = false;
            break;
        }
    }
    if (win) return true;
    win = true;
    for (let i = 0; i < boardSize; i++) {
        if (gameBoard[i][y] !== currentPlayer) {
            win = false;
            break;
        }
    }
    if (win) return true;
    win = true;
    for (let i = 0; i < boardSize; i++) {
        if (gameBoard[i][i] !== currentPlayer) {
            win = false;
            break;
        }
    }
    if (win) return true;
    win = true;
    for (let i = 0; i < boardSize; i++) {
        if (gameBoard[i][boardSize - i - 1] !== currentPlayer) {
            win = false;
            break;
        }
    }
    return win;
}

function isDraw() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameBoard[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

function updateScores() {
    document.getElementById('score-player1').textContent = `${player1}: ${scores['X']}`;
    document.getElementById('score-player2').textContent = `${mode === 'solo' ? 'Computer' : player2}: ${scores['O']}`;
}

function displayWinnerMessage(message) {
    gameFrozen = true;
    const winnerMessage = document.getElementById('winner-message');
    winnerMessage.textContent = message;
    winnerMessage.style.display = 'block';
}

function hideWinnerMessage() {
    const winnerMessage = document.getElementById('winner-message');
    winnerMessage.style.display = 'none';
    gameFrozen = false;
}

function resetScores() {
    scores = { X: 0, O: 0 };
    updateScores();
}

function resetGame() {
    hideWinnerMessage();
    resetGameBoard();
}

function resetGameBoard() {
    currentPlayer = 'X';
    document.getElementById('turn-info').textContent = `Turn for ${player1}`;
    hideWinnerMessage();
    initGameBoard();
}

function goHome() {
    document.getElementById('home-page').style.display = 'block';
    document.getElementById('game-page').style.display = 'none';
}

document.getElementById('mode').addEventListener('change', function () {
    document.getElementById('player2-container').style.display = this.value === 'friends' ? 'block' : 'none';
});

