//====================================
//constant variables (initial values for the game)
//====================================

const xAxis = ["A", "B", "C", "D", "E", "F", "G", "H"];
const yAxis = [1, 2, 3, 4, 5, 6, 7, 8];

let player = "light"; //zbog testiranja u klipu 32. 25:23 je promenio ovo
let enemy = null;

let isLeftCastlingPerformed = false;
let isRightCastlingPerformed = false;

let selectedPiece = null;

const lightPieces = [
  {
    position: "A-8",
    icon: "../assets/chess-icons/light/chess-rook-light.svg",
    points: 5,
    piece: "rook",
  },
  // {
  //   position: "B-8",
  //   icon: "../assets/chess-icons/light/chess-knight-light.svg",
  //   points: 3,
  //   piece: "knight",
  // },
  // {
  //   position: "C-8",
  //   icon: "../assets/chess-icons/light/chess-bishop-light.svg",
  //   points: 3,
  //   piece: "bishop",
  // },
  // {
  //   position: "D-8",
  //   icon: "../assets/chess-icons/light/chess-queen-light.svg",
  //   points: 9,
  //   piece: "queen",
  // },
  {
    position: "E-8",
    icon: "../assets/chess-icons/light/chess-king-light.svg",
    points: 10,
    piece: "king",
  },
  // {
  //   position: "F-8",
  //   icon: "../assets/chess-icons/light/chess-bishop-light.svg",
  //   points: 3,
  //   piece: "bishop",
  // },
  // {
  //   position: "G-8",
  //   icon: "../assets/chess-icons/light/chess-knight-light.svg",
  //   points: 3,
  //   piece: "knight",
  // },
  {
    position: "H-8",
    icon: "../assets/chess-icons/light/chess-rook-light.svg",
    points: 5,
    piece: "rook",
  },
  // {
  //   position: "A-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
  // {
  //   position: "B-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
  // {
  //   position: "C-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
  // {
  //   position: "D-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
  // {
  //   position: "E-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
  // {
  //   position: "F-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
  // {
  //   position: "G-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
  // {
  //   position: "H-7",
  //   icon: "../assets/chess-icons/light/chess-pawn-light.svg",
  //   points: 5,
  //   piece: "pawn",
  // },
];

const blackPieces = [
  {
    position: "A-1",
    icon: "../assets/chess-icons/black/chess-rook-black.svg",

    points: 5,
    piece: "rook",
  },
  {
    position: "B-1",
    icon: "../assets/chess-icons/black/chess-knight-black.svg",
    points: 3,
    piece: "knight",
  },
  {
    position: "C-1",
    icon: "../assets/chess-icons/black/chess-bishop-black.svg",
    points: 3,
    piece: "bishop",
  },
  {
    position: "D-1",
    icon: "../assets/chess-icons/black/chess-queen-black.svg",
    points: 9,
    piece: "queen",
  },
  {
    position: "E-1",
    icon: "../assets/chess-icons/black/chess-king-black.svg",
    points: 10,
    piece: "king",
  },
  {
    position: "F-1",
    icon: "../assets/chess-icons/black/chess-bishop-black.svg",
    points: 3,
    piece: "bishop",
  },
  {
    position: "G-1",
    icon: "../assets/chess-icons/black/chess-knight-black.svg",
    points: 3,
    piece: "knight",
  },
  {
    position: "H-1",
    icon: "../assets/chess-icons/black/chess-rook-black.svg",
    points: 5,
    piece: "rook",
  },
  {
    position: "A-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
  {
    position: "B-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
  {
    position: "C-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
  {
    position: "D-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
  {
    position: "E-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
  {
    position: "F-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
  {
    position: "G-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
  {
    position: "H-2",
    icon: "../assets/chess-icons/black/chess-pawn-black.svg",
    points: 5,
    piece: "pawn",
  },
];

const getPawnPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex) => {
  //console.log(yAxisIndex)
  //console.log(xAxisIndex)

  //Proveravamo da li je beli ili crni jer se drugacije krecu
  let possibleMoves = [];

  let forwardMoves = 1;

  let yAxisIndexForCapture = null;
  let canMoveForward = false;

  if (player === "light") {
    if (yAxisPos === 7) {
      forwardMoves = 2;
    }

    yAxisIndexForCapture = yAxisIndex - 1;
    canMoveForward = yAxisIndex > 0; // Mozemo napred ako je ovo vece od 0

    for (let y = yAxisIndex - 1; y >= yAxisIndex - forwardMoves; y--) {
      if (y < 0) {
        break;
      }

      let box = document.getElementById(`${xAxisPos}-${yAxis[y]}`);

      if (box.childElementCount === 0) {
        // Ako na tom polju ne postoji nijedna druga figura, ubaci to u moguce poteze jer pesak ide napred
        possibleMoves.push(box);
      } else {
        break;
      }
    }
  } else {
    if (yAxisPos === 2) {
      forwardMoves = 2;
    }

    yAxisIndexForCapture = yAxisIndex + 1;
    canMoveForward = yAxisIndex > 0; // Mozemo napred ako je ovo vece od 0

    for (let y = yAxisIndex + 1; y >= yAxisIndex + forwardMoves; y++) {
      if (y > yAxis.length) {
        break;
      }

      let box = document.getElementById(`${xAxisPos}-${yAxis[y]}`);

      if (box.childElementCount === 0) {
        // Ako na tom polju ne postoji nijedna druga figura, ubaci to u moguce poteze jer pesak ide napred
        possibleMoves.push(box);
      } else {
        break;
      }
    }
  }

  //ukoliko mozemo da pojedemo levo ili desno, a da je protivnikov pijun
  if (canMoveForward) {
    if (xAxisIndex > 0) {
      let pieceToCaptureLeft = document.getElementById(
        `${xAxis[xAxisIndex - 1]}-${yAxis[yAxisIndexForCapture]}`
      );

      if (
        pieceToCaptureLeft.childrenElementCount > 0 &&
        pieceToCaptureLeft.children[0].classList.contains(enemy)
      ) {
        possibleMoves.push(pieceToCaptureLeft);
      }
    }

    if (xAxisIndex < xAxis.length - 1) {
      let pieceToCaptureRight = document.getElementById(
        `${xAxis[xAxisIndex + 1]}-${yAxis[yAxisIndexForCapture]}`
      );

      if (
        pieceToCaptureRight.childrenElementCount > 0 &&
        pieceToCaptureRight.children[0].classList.contains(enemy)
      ) {
        possibleMoves.push(pieceToCaptureRight);
      }
    }
  }
  //TODO: CHECK FOR EL PASSANT (NE RADIMO GA)
  return possibleMoves;
};

const getRookPossibleMoves = (xAxisPos, yAxisPos, xAxisIndex, yAxisIndex) => {
  let possibleMoves = [];

  let topCollision = false;
  let bottomCollision = false;
  let rightCollision = false;
  let leftCollision = false;
  let yInc = 1;
  let xInc = 1;

  while (
    !topCollision ||
    !bottomCollision ||
    !leftCollision ||
    !rightCollision
  ) {
    if (!topCollision || !bottomCollision) {
      if (yAxisIndex + yInc < yAxis.length) {
        if (!topCollision) {
          let topBlock = document.getElementById(
            `${xAxisPos}-${yAxis[yAxisIndex + yInc]}`
          );

          if (topBlock.childElementCount > 0) {
            if (topBlock.children[0].classList.contains(enemy)) {
              possibleMoves.push(topBlock);
            }

            topCollision = true;
          } else {
            possibleMoves.push(topBlock);
          }
        }
      } else {
        topCollision = true;
      }

      if (yAxisIndex - yInc > -1) {
        if (!bottomCollision) {
          let bottomBlock = document.getElementById(
            `${xAxisPos}-${yAxis[yAxisIndex - yInc]}`
          );

          if (bottomBlock.childElementCount > 0) {
            if (bottomBlock.children[0].classList.contains(enemy)) {
              possibleMoves.push(bottomBlock);
            }

            topCollision = true;
          } else {
            possibleMoves.push(bottomBlock);
          }
        }
      } else {
        bottomCollision = true;
      }

      yInc++;
    }

    if (!leftCollision || !rightCollision) {
      if (xAxisIndex + xInc < xAxis.length) {
        if (!rightCollision) {
          let rightBlock = document.getElementById(
            `${xAxis[xAxisIndex + xInc]}-${yAxisPos}`
          );

          if (rightBlock.childElementCount > 0) {
            if (rightBlock.children[0].classList.contains(enemy)) {
              possibleMoves.push(rightBlock);
            } else {
              if (!isLeftCastlingPerformed) {
                let pieceCollideWith = rightBlock.children[0];

                if (pieceCollideWith.CDATA_SECTION_NODE.piece === "king") {
                  let myKingPosition = rightBlock.id;

                  if (player === "light") {
                    if (
                      xAxisPos + "-" + yAxisPos === "A-8" &&
                      myKingPosition === "E-8"
                    ) {
                      possibleMoves.push(rightBlock);
                    }
                  } else {
                    if (
                      xAxisPos + "-" + yAxisPos === "A-1" &&
                      myKingPosition === "E-1"
                    ) {
                      possibleMoves.push(rightBlock);
                    }
                  }
                }
              }
            }

            rightCollision = true;
          } else {
            possibleMoves.push(rightBlock);
          }
        }
      } else {
        rightCollision = true;
      }

      if (xAxisIndex - xInc > -1) {
        if (!leftCollision) {
          let leftBlock = document.getElementById(
            `${xAxis[xAxisIndex - xInc]}-${yAxisPos}`
          );

          if (leftBlock.childElementCount > 0) {
            if (leftBlock.children[0].classList.contains(enemy)) {
              possibleMoves.push(leftBlock);
            } else {
              if (!isLeftCastlingPerformed) {
                let pieceCollideWith = leftBlock.children[0];

                if (pieceCollideWith.CDATA_SECTION_NODE.piece === "king") {
                  let myKingPosition = leftBlock.id;

                  if (player === "light") {
                    if (
                      xAxisPos + "-" + yAxisPos === "H-8" &&
                      myKingPosition === "E-8"
                    ) {
                      possibleMoves.push(leftBlock);
                    }
                  } else {
                    if (
                      xAxisPos + "-" + yAxisPos === "H-1" &&
                      myKingPosition === "E-1"
                    ) {
                      possibleMoves.push(leftBlock);
                    }
                  }
                }
              }
            }

            leftCollision = true;
          } else {
            possibleMoves.push(leftBlock);
          }
        }
      } else {
        leftCollision = true;
      }

      xInc++;
    }
  }

  return possibleMoves;
};
