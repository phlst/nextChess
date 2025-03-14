import { PieceType } from "@/app/helper";

interface PieceProps {
  piece: PieceType;
  rank: number;
  file: number;
}

function Piece({ piece, rank, file }: PieceProps) {
  return (
    <div className={`piece ${piece}  p-${file}${rank}`} draggable={true} />
  );
}

export default Piece;
