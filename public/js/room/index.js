//====================================
//DOM ELEMENTS
//====================================
const room = document.getElementById("game-room");
const boxes = document.querySelectorAll(".box");
const playerLight = document.getElementById("player-light");
const playerBlack = document.getElementById("player-black");
const waitingMessage = document.getElementById("waiting-message");
const playerLightTimer = playerLight.querySelector(".timer");
const playerBlackTimer = playerBlack.querySelector(".timer");
const lightCapturedPieces = document.getElementById("light-captured-pieces");
const blackCapturedPieces = document.getElementById("black-captured-pieces");
//const piecesToPromoteContainer = document.getElementById("pieces-to-promote-container") Ovu ce valjda ubaciti u ejs, kaze da ce ovde praviti error ali hoce da ih ima sve na jednom mestu
//const piecesToPromote = document.getElementById("pieces-to-promote")
//const gameOverMessageContainer = document.getElementById("game-over-message-container")
// const winnerUserName = gameOverMessageContainer.querySelector("p strong")
// const myScoreElement = document.getElementById("my-score")
// const enemyScoreElement = document.getElementById("enemy-score")

//====================================
//GAME VARIABLES
//====================================

let user = null;
let search = window.location.search.split("&");
let roomId = null;
let password = null;
let gameDetails = null;
let gameHasTimer = false;
//class timer
let timer = null;
let myTurn = false;
let kingIsAttacked = false;
let pawnToPromotePosition = null;
let castling = null;

let gameOver = false;
let myScore = 0;
let enemyScore = 0;

let gameStartedAtTimestamp = null;

//Ako imamo password bice 2 elementa u nisu search, jer ce password biti odvojen sa & od imena sobe
if (search.length > 1) {
  roomId = search[0].split("=")[1];
  password = search[1].split("=")[1];
} else {
  roomId = search[0].split("=")[1];
}

//====================================
//FUNCTIONS
//====================================

const fetchUserCallback = (data) => {
  user = data;
  if (password) {
    socket.emit("user-connected", user, roomId, password);
  } else {
    socket.emit("user-connected", user, roomId);
  }
  socket.emit("get-game-details", roomId, user);
};

fetchData("/api/user-info", fetchUserCallback);

//Display chess board logic
const displayChessPieces = () => {
  boxes.forEach((box) => {
    box.innerHTML = "";
  });

  lightPieces.forEach((piece) => {
    let box = document.getElementById(piece.position);
    box.innerHTML += `
            <div class="piece light" data-piece="${piece.piece}" data-points="${piece.points}">
                <img src="${piece.icon}" alt="Chess Piece">
            </div>
            `;
  });
  blackPieces.forEach((piece) => {
    let box = document.getElementById(piece.position);
    box.innerHTML += `
            <div class="piece black" data-piece="${piece.piece}" data-points="${piece.points}">
                <img src="${piece.icon}" alt="Chess Piece">
            </div>
            `;
  });
  addPieceListeners();
};

const onClickPiece = (e) => {
  if (!myTurn || gameOver) {
    return;
  }
  hidePossibleMoves();

  let element = e.target.closest(".piece");
  //pozicija se skladisti kao id u divu
  let position = element.parentNode.id;
  let piece = element.dataset.piece; //element.dataset: predstavlja specijalni objekat u JavaScript-u koji sadrži sve podatke definisane putem HTML atributa koji počinju sa data-. Na primer, ako HTML element ima atribut data-piece, onda se tom atributu može pristupiti kroz dataset.piece.

  //Ako kliknemo na neku figuru, hocemo da vidimo sve moguce poteze, a ako kliknemo opet onda hocemo da sakrijemo poteze i odselektujemo figuru
  if (
    selectedPiece &&
    selectedPiece.piece === piece &&
    selectedPiece.position === position
  ) {
    hidePossibleMoves();
    selectedPiece = null;
    return;
  }

  selectedPiece = { position, piece };

  let possibleMoves = findPossibleMoves(position, piece);

  showPossibleMoves(possibleMoves);
};
const addPieceListeners = () => {
  //player ce biti ili beli ili crni
  document.querySelectorAll(`.piece.${player}`).forEach((piece) => {
    piece.addEventListener("click", onClickPiece);
  });

  document.querySelectorAll(`.piece.${enemy}`).forEach((piece) => {
    //Da ne bi imali hover na kursoru na protivnickim figurama
    piece.style.cursor = "default";
  });
};

//-----------------------------------------

//Possible Moves Logic

const showPossibleMoves = (possibleMoves) => {
  possibleMoves.forEach((box) => {
    let possibleMoveBox = document.createElement("div");
    possibleMoveBox.classList.add("possible-move");

    possibleMoveBox.addEventListener("click", move);

    box.appendChild(possibleMoveBox); //Dodaje novi html element kao dete postojecem box
  });
};

const hidePossibleMoves = () => {
  document.querySelectorAll(".possible-move").forEach((possibleMoveBox) => {
    let parent = possibleMoveBox.parentNode;
    possibleMoveBox.addEventListener("click", move);
    parent.removeChild(possibleMoveBox);
  });
};

const findPossibleMoves = (position, piece) => {
  let splittedPos = position.split("-");
  let yAxisPos = parseInt(splittedPos[1]);

  let xAxisPos = splittedPos[0];
  //A-8 -> y=8, x=A

  let yAxisIndex = yAxis.findIndex((y) => y === yAxisPos); //yAxis je iz chessBoarda niz sa svim mogucim vrednostima, i on trazi onaj indeks za koji je y===yAxisPos

  let xAxisIndex = xAxis.findIndex((x) => x === xAxisPos);

  switch (piece) {
    case "pawn":
      return getPawnPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex); // Ova fja ce vratiti niz sa svim mogucim potezima
    case "rook":
      return getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex);
    case "bishop":
      return getBishopPossibleMoves(xAxisIndex, yAxisIndex);
    case "knight":
      return getKnightPossibleMoves(xAxisIndex, yAxisIndex);
    //za kraljicu je zapravo unija lovca i topa
    case "queen":
      return Array.prototype.concat(
        getRookPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex),
        getBishopPossibleMoves(xAxisIndex, yAxisIndex)
      );
    case "king":
      return getKingPossibleMoves(xAxisPos, yAxisPos, xAxisIndex, yAxisIndex);
    default:
      return [];
  }
};
//-----------------------------------------

//Timer Logic

const updateTimer = () => {};

const timerEndedCallback = () => {};

//-----------------------------------------

//Game Logic
const setCursor = (cursor) => {
  document.querySelectorAll(`.piece.${player}`).forEach((piece) => {
    piece.getElementsByClassName.cursor = cursor;
  });
};

const startGame = (user) => {
  playerBlack.querySelector(".username").innerText = playerTwo.username;

  waitingMessage.classList.add("hidden");
  playerBlack.classList.remove("hidden");
  displayChessPieces();
};

//PROVERITI STA CEMO OD OVIH FUNCKIJA DA RADIMOO!!!! ROKADA, PROMOCIJA I EL PASANT
const endMyTurn = (
  newPieceBox,
  pawnPromoted = false,
  castlingPerformed = false,
  elPassantPerformed = false
) => {
  if (kingIsAttacked) {
    //setKingisAttacked(false);
  }

  myTurn = false;
  setCursor("default");

  //moracemo ovde da saljemo preko socketa drugom koristiku sta se odigralo
  // saveMove(newPieceBox,pawnPromoted,castlingPerformed,elPassantPerformed);

  // checkIfKingIsAttacked(enemy);
};

//--------------------------------------
//Move logic
const move = (e) => {
  let currentBox = document.getElementById(selectedPiece.position);
  let boxToMove = e.target.parentNode;
  let piece = currentBox.querySelector(".piece");

  hidePossibleMoves();
  let pieceToRemove = null;
  let pieceToRemovePieceImg = null;

  if (boxToMove.children > 0) {
    if (boxToMove.children[0].classList.contains(player)) {
      //TODO: Perform castling

      return;
    }
    pieceToRemove = boxToMove.children[0];
    pieceToRemovePieceImg = pieceToRemove.children[0];
  } else {
    //TODO: Check for castling
  }

  currentBox.innerHTML = "";

  if (pieceToRemove) {
    //TODO: Capture piece

    // capturePiece(pieceToRemove);

    boxToMove.innerHTML = "";
  }

  boxToMove.appendChild(piece);

  let boxesNeededForCheck = {
    currentBox,
    boxToMove,
  };

  let piecesNeededForCheck = {
    piece,
    pieceToRemove,
    pieceToRemovePieceImg,
  };

  let isMovePossible = canMakeMove(boxesNeededForCheck, piecesNeededForCheck);

  if (!isMovePossible) {
    return;
  }

  //TODO: Check for piece promotion and el passant

  //TODO: Check for draw

  endMyTurn(boxToMove);
};

const canMakeMove = (
  { currentBox, boxToMove },
  { piece, pieceToRemove, pieceToRemovePieceImg }
) => {
  //TODO: Checkif move is valid
  let moveIsNotValid = checkIfKingIsAttacked(player);

  if (moveIsNotValid) {
    selectedPiece = null;
    if (pieceToRemove) {
      pieceToRemove.appendChild(pieceToRemovePieceImg);
      boxToMove.removeChild(piece);
      boxToMove.appendChild(pieceToRemove);

      if (pieceToRemove.classList.contains("black")) {
        blackCapturedPieces.removeChild(blackCapturedPieces.lastChild);
      } else {
        lightCapturedPieces.removeChild(lightCapturedPieces.lastChild);
      }
    }
    currentBox.appendChild(piece);
    //displayToast("You can't make this move. Your king is under attack")

    return false;
  }

  return true;
};

const capturePiece = (pieceToRemove) => {
  let pawnImg = pieceToRemove.children[0];

  let li = document.createElement("li");
  li.appendChild(pawnImg);

  if (pieceToRemove.classList.contains("black")) {
    blackCapturedPieces.appendChild(li);

    if (!gameOver) {
      if (player === "light") {
        myScore += parseInt(pieceToRemove.dataset.points);
      } else {
        enemyScore += parseInt(pieceToRemove.dataset.points);
      }
    }
  } else {
    lightCapturedPieces.appendChild(li);

    if (!gameOver) {
      if (player === "black") {
        myScore += parseInt(pieceToRemove.dataset.points);
      } else {
        enemyScore += parseInt(pieceToRemove.dataset.points);
      }
    }
  }
};

const checkIfKingIsAttacked = (playerToCheck) => {
  //funkciju getKingPosition napravili smo u chessBoard
  let kingPossiton = getKingPosition(playerToCheck);

  let check = isCheck(kingPossiton, playerToCheck === player);

  if (check) {
    //proveramo da li smo mi taj igrac pod sahom
    if (player !== playerToCheck) {
      if (isCheckmate(kingPossiton)) {
        socket.emit(
          "checkmate",
          roomId,
          user.username,
          myScore,
          gameStartedAtTimestamp
        );
        // endGame(user.username)
      } else {
        socket.emit("check", roomId);
      }
    }

    return true;
  }
  return false;
};

const saveMove = (
  newPieceBox,
  pawnPromoted,
  castlingPerformed,
  elPassantPerformed
) => {
  let move = {
    from: selectedPiece.position,
    to: newPieceBox.id,
    piece: selectedPiece.piece,
    pieceColor: player,
  };

  selectedPiece = null;

  pawnToPromotePosition = null;

  if (gameHasTimer) {
    let currentTime;

    if (player === "light") {
      currentTime = playerLightTimer.innerText;
    } else {
      currentTime = playerBlackTimer.innerText;
    }

    move.time = currentTime;
    timer.stop();
  }

  if (pawnPromoted) {
    // TODO: pass the pawn promotion also
  } else if (castlingPerformed) {
    //TODO:  pass the castling also
  } else if (elPassantPerformed) {
    //TODO: pass elPassant also
  } else {
    //emitujemo da je potez odigran
    socket.emit("move-made", roomId, move);
  }
};

const moveEnemy = (
  move,
  pawnPromotion = null,
  elPassantPerformed = false
) => {};

//-----------------------------------------------------

displayChessPieces();

//====================================
//Socket Listeners
//===============================

socket.on("receive-game-details", (details) => {
  gameDetails = details;

  let playerOne = gameDetails.players[0];

  gameHasTimer = gameDetails.time > 0;

  if (!gameHasTimer) {
    playerLightTimer.classList.add("hidden");
    playerBlackTimer.classList.add("hidden");
  } else {
    playerBlackTimer.innerText = gameDetails.time + ":00";
    playerLightTimer.innerText = gameDetails.time + ":00";
  }

  playerLight.querySelector(".username").innerText = playerOne.username;

  if (playerOne.username === user.username) {
    player = "light";
    enemy = "black";

    myTurn = true;
  } else {
    gameStartedAtTimestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    player = "black";
    enemy = "light";

    //Svaki put kad krene partija kursor se postavlja na default
    ("default");
    startGame(user);
  }

  if (gameHasTimer) {
    timer = new Timer(
      player,
      roomId,
      gameDetails.time,
      0,
      updateTimer,
      timerEndedCallback
    );
  }

  hideSpinner();
  room.classList.remove("hidden");
});

//if we are first player and someone joins then this event is emitted
socket.on("game-started", (playerTwo) => {
  gameStartedAtTimestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  startGame(playerTwo);

  if (gameHasTimer) {
    timer.start();
  }
});
