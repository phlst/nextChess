import { PieceType } from "@/app/helper";
import { RootState } from "@/app/_store/store";
import { useSelector, useDispatch } from "react-redux";
import { clearPosition } from "@/app/_store/gameState/gameState";

interface PieceProps {
  piece: PieceType;
  rank: number;
  file: number;
}

function Piece({ piece, rank, file }: PieceProps) {
  const dispatch = useDispatch();

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${file},${rank}`);
    setTimeout(() => {
      (e.target as HTMLDivElement).style.display = "none";
    }, 0);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).style.display = "";
    const targetClasses = (e.target as HTMLDivElement).className;
    const filtered = targetClasses.split(" ")[2].split("-")[1].split("");
    const pieceRank = filtered[1];
    const pieceFile = filtered[0];

    // Dispatch action to update position instead of direct mutation
    dispatch(clearPosition({ rank: pieceRank, file: pieceFile }));
  };

  return (
    <div
      className={`piece ${piece} p-${file}${rank}`}
      onDragStart={(e) => onDragStart(e)}
      onDragEnd={(e) => onDragEnd(e)}
      draggable={true}
    />
  );
}

export default Piece;
