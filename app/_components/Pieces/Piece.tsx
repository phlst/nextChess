import { PieceType } from "@/app/helper";

interface PieceProps {
  piece: PieceType;
  rank: number;
  file: number;
}

function Piece({ piece, rank, file }: PieceProps) {
  return (
    <div
      className={`piece ${piece}`}
      style={{
        gridRow: rank + 1,
        gridColumn: file + 1,
      }}
      draggable={true}
    />
  );
}

export default Piece;
