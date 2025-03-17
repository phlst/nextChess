import { PieceType } from "@/app/helper";
import { useRef } from "react";

interface PieceProps {
  piece: PieceType;
  rank: number; // Array index 0-7 (rank 8 to rank 1)
  file: number; // Array index 0-7 (file a to file h)
  onPieceDragStart?: (
    piece: PieceType,
    rank: number,
    file: number
  ) => boolean | void;
  onPieceDragEnd?: () => void;
}

function Piece({
  piece,
  rank,
  file,
  onPieceDragStart,
  onPieceDragEnd,
}: PieceProps) {
  const pieceRef = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Call the parent's drag start handler, which returns false if the move is not allowed
    if (onPieceDragStart && onPieceDragStart(piece, rank, file) === false) {
      // Cancel the drag operation if not allowed
      e.preventDefault();
      return false;
    }

    // Set the drag image to a clone of the piece to avoid the "ghost" effect
    if (pieceRef.current) {
      const rect = pieceRef.current.getBoundingClientRect();
      const ghostPiece = pieceRef.current.cloneNode(true) as HTMLDivElement;

      // Style the ghost to match the original piece
      ghostPiece.style.width = `${rect.width}px`;
      ghostPiece.style.height = `${rect.height}px`;
      ghostPiece.style.opacity = "0.8";
      ghostPiece.style.position = "absolute";
      ghostPiece.style.top = "-1000px"; // Hide it off-screen
      document.body.appendChild(ghostPiece);

      // Set custom drag image
      e.dataTransfer.setDragImage(ghostPiece, rect.width / 2, rect.height / 2);

      // Remove the ghost element after a delay
      setTimeout(() => {
        document.body.removeChild(ghostPiece);
      }, 0);
    }

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${file},${rank}`);

    // Instead of hiding the original piece, add a class to reduce its opacity
    if (pieceRef.current) {
      pieceRef.current.classList.add("dragging");
    }
  };

  const onDragEnd = () => {
    // Remove the dragging class
    if (pieceRef.current) {
      pieceRef.current.classList.remove("dragging");
    }

    if (onPieceDragEnd) {
      onPieceDragEnd();
    }
  };

  // Add this handler to prevent text selection on rapid clicks
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent text selection behavior
    if (e.detail > 1) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={pieceRef}
      className={`piece ${piece} p-${file}${rank}`}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseDown={handleMouseDown}
      draggable={true}
      data-piece={piece}
      data-array-rank={rank}
      data-array-file={file}
      data-color={piece[0]}
    />
  );
}

export default Piece;
