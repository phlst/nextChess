import { PieceType } from "../helper";

// Define types for chess positions
export type Position = [number, number]; // [rank, file]
export type ChessBoard = PieceType[][];

// Check if a position is within the board boundaries
export function isValidPosition(position: Position): boolean {
  const [rank, file] = position;
  return rank >= 0 && rank < 8 && file >= 0 && file < 8;
}

// Get the color of a piece ('w' or 'b')
export function getPieceColor(piece: PieceType): string | null {
  if (!piece) return null;
  return piece[0]; // First character is the color (w/b)
}

// Check if a position contains a piece of the opposite color or is empty
export function isValidTarget(
  board: ChessBoard,
  position: Position,
  myColor: string
): boolean {
  const [rank, file] = position;
  const targetPiece = board[rank][file];

  if (!targetPiece) return true; // Empty square is always a valid target
  const targetColor = getPieceColor(targetPiece);
  return targetColor !== myColor; // Can't capture your own pieces
}

// Generate candidate moves for a pawn
export function getPawnMoves(
  board: ChessBoard,
  position: Position,
  color: string
): Position[] {
  const [rank, file] = position;
  const moves: Position[] = [];

  // Direction of movement based on color
  // White pawns (w) move DOWN (rank increasing), black pawns (b) move UP (rank decreasing)
  const direction = color === "w" ? 1 : -1;

  // Forward move (only if square is empty)
  if (
    isValidPosition([rank + direction, file]) &&
    !board[rank + direction][file]
  ) {
    moves.push([rank + direction, file]);

    // Initial double move
    // White pawns start at rank 1, black pawns at rank 6
    const initialRank = color === "w" ? 1 : 6;
    if (rank === initialRank && !board[rank + 2 * direction][file]) {
      moves.push([rank + 2 * direction, file]);
    }
  }

  // Captures (diagonal moves)
  const captureFiles = [file - 1, file + 1];
  for (const captureFile of captureFiles) {
    if (isValidPosition([rank + direction, captureFile])) {
      const targetPiece = board[rank + direction][captureFile];
      if (targetPiece && getPieceColor(targetPiece) !== color) {
        moves.push([rank + direction, captureFile]);
      }
    }
  }

  return moves;
}

// Helper function to check if a pawn is at a promotion rank
export function isPawnPromotion(
  board: ChessBoard,
  from: Position,
  to: Position
): boolean {
  const [fromRank, fromFile] = from;
  const [toRank] = to;
  const piece = board[fromRank][fromFile];

  if (!piece || piece[1] !== "p") return false;

  const color = getPieceColor(piece);
  // With reversed board: white pawns promote at rank 7, black at rank 0
  return (color === "w" && toRank === 7) || (color === "b" && toRank === 0);
}

// Generate candidate moves for a knight
export function getKnightMoves(
  board: ChessBoard,
  position: Position,
  color: string
): Position[] {
  const [rank, file] = position;
  const moves: Position[] = [];

  // Knight's L-shaped moves
  const knightOffsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  for (const [rankOffset, fileOffset] of knightOffsets) {
    const newPos: Position = [rank + rankOffset, file + fileOffset];
    if (isValidPosition(newPos) && isValidTarget(board, newPos, color)) {
      moves.push(newPos);
    }
  }

  return moves;
}

// Helper function to generate moves along directions (for bishops, rooks, queens)
function getDirectionalMoves(
  board: ChessBoard,
  position: Position,
  color: string,
  directions: Position[]
): Position[] {
  const [rank, file] = position;
  const moves: Position[] = [];

  for (const [rankDir, fileDir] of directions) {
    let currentPos: Position = [rank + rankDir, file + fileDir];

    while (isValidPosition(currentPos)) {
      const [newRank, newFile] = currentPos;
      const targetPiece = board[newRank][newFile];

      if (!targetPiece) {
        // Empty square, can move here
        moves.push(currentPos);
        // Continue in the same direction
        currentPos = [newRank + rankDir, newFile + fileDir];
      } else {
        // Hit a piece
        if (getPieceColor(targetPiece) !== color) {
          // Can capture opponent's piece
          moves.push(currentPos);
        }
        // Stop in this direction
        break;
      }
    }
  }

  return moves;
}

// Generate candidate moves for a bishop
export function getBishopMoves(
  board: ChessBoard,
  position: Position,
  color: string
): Position[] {
  // Bishop moves diagonally
  const directions: Position[] = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  return getDirectionalMoves(board, position, color, directions);
}

// Generate candidate moves for a rook
export function getRookMoves(
  board: ChessBoard,
  position: Position,
  color: string
): Position[] {
  // Rook moves horizontally and vertically
  const directions: Position[] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  return getDirectionalMoves(board, position, color, directions);
}

// Generate candidate moves for a queen
export function getQueenMoves(
  board: ChessBoard,
  position: Position,
  color: string
): Position[] {
  // Queen moves like both a bishop and a rook
  return [
    ...getBishopMoves(board, position, color),
    ...getRookMoves(board, position, color),
  ];
}

// Generate candidate moves for a king
export function getKingMoves(
  board: ChessBoard,
  position: Position,
  color: string
): Position[] {
  const [rank, file] = position;
  const moves: Position[] = [];

  // King moves one square in any direction
  const kingOffsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [rankOffset, fileOffset] of kingOffsets) {
    const newPos: Position = [rank + rankOffset, file + fileOffset];
    if (isValidPosition(newPos) && isValidTarget(board, newPos, color)) {
      moves.push(newPos);
    }
  }

  // TODO: Castling (optional, can be added later)

  return moves;
}

// Get all candidate moves for a piece based on its type
export function getCandidateMoves(
  board: ChessBoard,
  position: Position
): Position[] {
  const [rank, file] = position;
  const piece = board[rank][file];

  if (!piece) return [];

  const color = getPieceColor(piece);
  if (!color) return [];

  const pieceType = piece[1]; // Second character represents the piece type
  let moves: Position[] = [];

  switch (pieceType) {
    case "p":
      moves = getPawnMoves(board, position, color);
      break;
    case "n":
      moves = getKnightMoves(board, position, color);
      break;
    case "b":
      moves = getBishopMoves(board, position, color);
      break;
    case "r":
      moves = getRookMoves(board, position, color);
      break;
    case "q":
      moves = getQueenMoves(board, position, color);
      break;
    case "k":
      moves = getKingMoves(board, position, color);
      break;
  }

  return moves;
}

// Check if a move is valid for the given piece
export function isValidMove(
  board: ChessBoard,
  from: Position,
  to: Position
): boolean {
  const candidateMoves = getCandidateMoves(board, from);
  return candidateMoves.some((move) => move[0] === to[0] && move[1] === to[1]);
}

// Find the position of a king on the board
export function findKing(board: ChessBoard, color: string): Position | null {
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece[0] === color && piece[1] === "k") {
        return [rank, file];
      }
    }
  }
  return null;
}

// Check if a king is in check
export function isKingInCheck(board: ChessBoard, kingColor: string): boolean {
  // Find the king's position
  const kingPosition = findKing(board, kingColor);
  if (!kingPosition) return false;

  // Get the opponent's color
  const opponentColor = kingColor === "w" ? "b" : "w";

  // Check all opponent's pieces to see if any can capture the king
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && getPieceColor(piece) === opponentColor) {
        const moves = getCandidateMoves(board, [rank, file]);
        if (
          moves.some(([r, f]) => r === kingPosition[0] && f === kingPosition[1])
        ) {
          return true; // King is in check
        }
      }
    }
  }

  return false;
}

// Simulate a move to see if it removes check
export function simulateMove(
  board: ChessBoard,
  from: Position,
  to: Position
): ChessBoard {
  const newBoard = board.map((row) => [...row]);
  const [fromRank, fromFile] = from;
  const [toRank, toFile] = to;

  // Move piece from source to destination
  newBoard[toRank][toFile] = newBoard[fromRank][fromFile];
  newBoard[fromRank][fromFile] = "";

  return newBoard;
}

// Check if a player can escape check
export function canEscapeCheck(board: ChessBoard, kingColor: string): boolean {
  // Find all pieces of the player
  const playerPieces: { piece: PieceType; position: Position }[] = [];

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && getPieceColor(piece) === kingColor) {
        playerPieces.push({
          piece,
          position: [rank, file],
        });
      }
    }
  }

  // For each piece, check all possible moves to see if any removes the check
  for (const { position } of playerPieces) {
    const moves = getCandidateMoves(board, position);

    for (const move of moves) {
      // Simulate the move
      const simulatedBoard = simulateMove(board, position, move);

      // Check if the king is still in check after this move
      if (!isKingInCheck(simulatedBoard, kingColor)) {
        return true; // Found a move that escapes check
      }
    }
  }

  return false; // No move escapes check - it's checkmate (or stalemate if not in check)
}

// Check if a player is in checkmate
export function isCheckmate(board: ChessBoard, kingColor: string): boolean {
  // First, check if the king is in check
  if (!isKingInCheck(board, kingColor)) {
    return false;
  }

  // Then check if the player can make any move to escape check
  return !canEscapeCheck(board, kingColor);
}

// Check if a player is in stalemate (not in check but no legal moves)
export function isStalemate(board: ChessBoard, kingColor: string): boolean {
  // First check if the king is in check - if so, it's not stalemate
  if (isKingInCheck(board, kingColor)) {
    return false;
  }

  // Check if the player can make any legal move
  return !canEscapeCheck(board, kingColor);
}
