export type PieceType = string;

// Function to get character code for chess files (columns)
export function getCharCode(file: number): string {
  return String.fromCharCode(96 + file);
}

// Helper function to convert between visual board coordinates and array indices
export const convertToArrayIndices = (
  file: number,
  rank: number
): [number, number] => {
  const fileIndex = file - 1; // Files go from 1-8 to 0-7
  const rankIndex = 8 - rank; // Ranks go from 8-1 to 0-7
  return [rankIndex, fileIndex];
};

// Create initial chess position
export function createPosition(): PieceType[][] {
  // 8x8 array representing the chess board
  // Each position contains either a piece code or an empty string
  const position: PieceType[][] = Array(8)
    .fill("")
    .map(() => Array(8).fill(""));

  // REVERSED POSITION: Set up pawns
  for (let i = 0; i < 8; i++) {
    position[6][i] = "bp"; // black pawns on 7th rank (index 6)
    position[1][i] = "wp"; // white pawns on 2nd rank (index 1)
  }

  // REVERSED POSITION: Set up black pieces (top row - 8th rank)
  position[7][0] = "br"; // a8 - black rook
  position[7][1] = "bn"; // b8 - black knight
  position[7][2] = "bb"; // c8 - black bishop
  position[7][3] = "bq"; // d8 - black queen
  position[7][4] = "bk"; // e8 - black king
  position[7][5] = "bb"; // f8 - black bishop
  position[7][6] = "bn"; // g8 - black knight
  position[7][7] = "br"; // h8 - black rook

  // REVERSED POSITION: Set up white pieces (bottom row - 1st rank)
  position[0][0] = "wr"; // a1 - white rook
  position[0][1] = "wn"; // b1 - white knight
  position[0][2] = "wb"; // c1 - white bishop
  position[0][3] = "wq"; // d1 - white queen
  position[0][4] = "wk"; // e1 - white king
  position[0][5] = "wb"; // f1 - white bishop
  position[0][6] = "wn"; // g1 - white knight
  position[0][7] = "wr"; // h1 - white rook

  return position;
}
