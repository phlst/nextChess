import React from "react";
import { PieceType } from "@/app/helper";
import "./PromotionModal.css";

interface PromotionModalProps {
  isVisible: boolean;
  position: { x: number; y: number };
  color: "w" | "b";
  onSelect: (piece: PieceType) => void;
}

const PromotionModal: React.FC<PromotionModalProps> = ({
  isVisible,
  position,
  color,
  onSelect,
}) => {
  if (!isVisible) return null;

  const pieces: PieceType[] = [
    `${color}q`, // Queen
    `${color}r`, // Rook
    `${color}b`, // Bishop
    `${color}n`, // Knight
  ];

  return (
    <div
      className="promotion-modal"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {pieces.map((piece) => (
        <div
          key={piece}
          className={`promotion-piece ${piece}`}
          onClick={() => onSelect(piece)}
        />
      ))}
    </div>
  );
};

export default PromotionModal;
