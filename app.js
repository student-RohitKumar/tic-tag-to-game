let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let count = 0; // To Track Draw

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// HUMAN = "O", COMPUTER (Grand Master) = "X"

const resetGame = () => {
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
};

// Get current board from UI
const getCurrentBoard = () => {
  return Array.from(boxes).map((box) => box.innerText);
};

// Check winner on a given board array (for both UI & minimax)
const checkWinnerOnBoard = (board) => {
  for (let pattern of winPatterns) {
    let pos1Val = board[pattern[0]];
    let pos2Val = board[pattern[1]];
    let pos3Val = board[pattern[2]];

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        return pos1Val; // "X" or "O"
      }
    }
  }
  return null;
};

// Handle winner/draw using current DOM board
const handleGameStatus = () => {
  const board = getCurrentBoard();
  const winner = checkWinnerOnBoard(board);

  if (winner) {
    showWinner(winner);
    return true;
  }

  if (count === 9) {
    gameDraw();
    return true;
  }

  return false;
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// ---------- GRAND MASTER AI (MINIMAX) ----------

// Minimax evaluation function
const minimax = (board, isMaximizing) => {
  const winner = checkWinnerOnBoard(board);

  if (winner === "X") return 10;  // Computer wins
  if (winner === "O") return -10; // Human wins

  if (board.every((cell) => cell !== "")) {
    return 0; // Draw
  }

  if (isMaximizing) {
    // Computer's move (X)
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, false);
        board[i] = "";
        if (score > bestScore) bestScore = score;
      }
    }

    return bestScore;
  } else {
    // Human's move (O)
    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, true);
        board[i] = "";
        if (score < bestScore) bestScore = score;
      }
    }

    return bestScore;
  }
};

// Choose best move for computer (Grand Master)
const getBestMove = () => {
  let board = getCurrentBoard();
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "X";
      let score = minimax(board, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const computerMove = () => {
  let move = getBestMove();

  if (move === -1) return; // No move possible (shouldn't happen normally)

  boxes[move].innerText = "X";
  boxes[move].disabled = true;
  count++;

  // After computer move, check game status
  handleGameStatus();
};

// ---------- HUMAN CLICK HANDLER ----------
// Human always plays "O" and goes FIRST.

boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return; // Already filled, ignore

    // Human move
    box.innerText = "O";
    box.disabled = true;
    count++;

    // Check if human already won or draw
    const gameOver = handleGameStatus();
    if (gameOver) return;

    // If moves are left, computer (Grand Master) plays
    if (count < 9) {
      computerMove();
    }
  });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
