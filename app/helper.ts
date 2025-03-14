export type PieceType = string;

// Function to get character code for chess files (columns)
export function getCharCode(file: number): string {
  return String.fromCharCode(96 + file);
}

// Create initial chess position
export function createPosition(): PieceType[][] {
  // 8x8 array representing the chess board
  // Each position contains either a piece code or an empty string
  const position: PieceType[][] = Array(8)
    .fill("")
    .map(() => Array(8).fill(""));

  // Set up pawns
  for (let i = 0; i < 8; i++) {
    position[1][i] = "wp"; // black pawns
    position[6][i] = "bp"; // white pawns
  }

  // Set up other pieces
  position[0][0] = "wr";
  position[0][7] = "wr"; // wlack rooks
  position[0][1] = "wn";
  position[0][6] = "wn"; // wlack knights
  position[0][2] = "wb";
  position[0][5] = "wb"; // wlack wishops
  position[0][3] = "wq";
  position[0][4] = "wk"; // black queen and king

  position[7][0] = "br";
  position[7][7] = "br"; // bhite rooks
  position[7][1] = "bn";
  position[7][6] = "bn"; // bhite knights
  position[7][2] = "bb";
  position[7][5] = "bb"; // bhite bishops
  position[7][3] = "bq";
  position[7][4] = "bk"; // white queen and king

  return position;
}
