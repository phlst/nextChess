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
    position[1][i] = "bp"; // black pawns
    position[6][i] = "wp"; // white pawns
  }

  // Set up other pieces
  position[0][0] = "br";
  position[0][7] = "br"; // black rooks
  position[0][1] = "bn";
  position[0][6] = "bn"; // black knights
  position[0][2] = "bb";
  position[0][5] = "bb"; // black bishops
  position[0][3] = "bq";
  position[0][4] = "bk"; // black queen and king

  position[7][0] = "wr";
  position[7][7] = "wr"; // white rooks
  position[7][1] = "wn";
  position[7][6] = "wn"; // white knights
  position[7][2] = "wb";
  position[7][5] = "wb"; // white bishops
  position[7][3] = "wq";
  position[7][4] = "wk"; // white queen and king

  return position;
}
