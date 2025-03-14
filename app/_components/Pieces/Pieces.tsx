import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/_store/store";
import Piece from "./Piece";
import "./Pieces.css";

function Pieces() {
  const ref = useRef<HTMLDivElement>(null);
  const currentPosition = useSelector(
    (state: RootState) => state.gameState.position
  );

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 h-full w-full grid grid-cols-8 grid-rows-8"
    >
      {currentPosition.map((row, rank) =>
        row.map((piece, file) =>
          piece ? (
            <Piece
              key={`${rank}-${file}`}
              rank={rank}
              file={file}
              piece={piece}
            />
          ) : null
        )
      )}
    </div>
  );
}

export default Pieces;
