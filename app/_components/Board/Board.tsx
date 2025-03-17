import Files from "./Files";
import Pieces from "../Pieces/Pieces";
import Ranks from "./Ranks";
import { useDispatch, useSelector } from "react-redux";
import {
  makeMove,
  resetGame,
  resignGame,
} from "@/app/_store/gameState/gameState";
import { PieceType } from "@/app/helper";
import { RootState } from "@/app/_store/store";
import {
  isValidMove,
  getPieceColor,
  simulateMove,
  isKingInCheck,
} from "@/app/utils/chessMoves";
import React, { useState } from "react";
import PromotionModal from "../Promotion/PromotionModal";

function getClassName(i: number, j: number) {
  let c = "tile ";
  c += (i + j) % 2 === 0 ? " bg-dark-tile " : " bg-light-tile ";
  return c;
}

// Add this function to your Board component
const getSquareFromCoordinates = (x: number, y: number) => {
  const boardElement = document.querySelector("#grid");
  if (!boardElement) return { file: 0, rank: 0 };

  const rect = boardElement.getBoundingClientRect();
  const squareSize = rect.width / 8;

  // Calculate relative position within board
  const relativeX = x - rect.left;
  const relativeY = y - rect.top;

  // Determine file and rank based on position
  const file = Math.floor(relativeX / squareSize) + 1;
  const rank = 8 - Math.floor(relativeY / squareSize);

  return { file, rank };
};

function Board() {
  const dispatch = useDispatch();
  const currentPosition = useSelector(
    (state: RootState) => state.gameState.position
  );
  const currentTurn = useSelector(
    (state: RootState) => state.gameState.currentTurn
  );
  const checkStatus = useSelector((state: RootState) => state.gameState.check);
  const gameStatus = useSelector(
    (state: RootState) => state.gameState.gameStatus
  );
  // Remove the highlighted squares state
  const ranks = Array(8)
    .fill("")
    .map((x, i) => 8 - i);
  const files = Array(8)
    .fill("")
    .map((x, i) => i + 1);

  // Add state for promotion modal
  const [promotionState, setPromotionState] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    sourceRank: number;
    sourceFile: number;
    targetRank: number;
    targetFile: number;
    color: "w" | "b";
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    sourceRank: 0,
    sourceFile: 0,
    targetRank: 0,
    targetFile: 0,
    color: "w",
  });

  // Add state for chat panel
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Add state for notification
  const [showNotification, setShowNotification] = useState(true);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Check if a pawn move is a promotion
  const isPawnPromotion = (piece: string, rank: number): boolean => {
    // If it's a pawn and it's on the first or last rank
    return (
      piece[1] === "p" &&
      ((piece[0] === "w" && rank === 7) || (piece[0] === "b" && rank === 0))
    );
  };

  const handlePawnPromotion = (
    piece: PieceType,
    srcRank: number,
    srcFile: number,
    targetRank: number,
    targetFile: number,
    clientX: number,
    clientY: number
  ) => {
    // Show promotion modal
    setPromotionState({
      isVisible: true,
      position: {
        x: clientX - 50, // Adjust position to center the modal
        y: clientY - 100, // Position above the cursor
      },
      sourceRank: srcRank,
      sourceFile: srcFile,
      targetRank: targetRank,
      targetFile: targetFile,
      color: piece[0] as "w" | "b",
    });
  };

  const handlePromotionSelect = (selectedPiece: PieceType) => {
    const { sourceRank, sourceFile, targetRank, targetFile } = promotionState;

    // Use the new makeMove action for promotion as well
    dispatch(
      makeMove({
        fromRank: sourceRank,
        fromFile: sourceFile,
        toRank: targetRank,
        toFile: targetFile,
        piece: selectedPiece,
      })
    );

    // Hide the modal
    setPromotionState((prev) => ({ ...prev, isVisible: false }));
  };

  const handleDragStart = (piece: PieceType) => {
    // Only allow dragging pieces of the current player's color
    const pieceColor = getPieceColor(piece);

    if (pieceColor !== currentTurn) {
      // Cancel the drag operation if it's not this player's turn
      return false;
    }

    // Remove the code to calculate and set highlighted squares
    return true;
  };

  const handleDragEnd = () => {
    // No need to clear highlighted squares anymore
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (gameStatus.isOver) {
      return;
    }

    // Get square from drop coordinates
    const { file: targetFile, rank: targetRank } = getSquareFromCoordinates(
      e.clientX,
      e.clientY
    );

    const data = e.dataTransfer.getData("text/plain");
    const [piece, sourceFile, sourceRank] = data.split(",");

    // Convert to numbers for comparison
    const srcFile = Number(sourceFile);
    const srcRank = Number(sourceRank);

    // Check if it's this player's turn
    if (getPieceColor(piece) !== currentTurn) {
      return;
    }

    // FIX: Adjust coordinates to correct the offset
    const adjustedTargetFile = targetFile - 1;
    const adjustedTargetRank = targetRank - 1;

    // Check if the move is valid according to chess rules
    const isValid = isValidMove(
      currentPosition,
      [srcRank, srcFile],
      [adjustedTargetRank, adjustedTargetFile]
    );

    if (isValid) {
      // Simulate the move to check if it would leave the king in check
      const simulatedBoard = simulateMove(
        currentPosition,
        [srcRank, srcFile],
        [adjustedTargetRank, adjustedTargetFile]
      );

      const kingColor = getPieceColor(piece) as "w" | "b";
      if (isKingInCheck(simulatedBoard, kingColor)) {
        return;
      }

      // Check for pawn promotion
      if (isPawnPromotion(piece, adjustedTargetRank)) {
        handlePawnPromotion(
          piece as PieceType,
          srcRank,
          srcFile,
          adjustedTargetRank,
          adjustedTargetFile,
          e.clientX,
          e.clientY
        );
      } else {
        // Use the new makeMove action that handles turn switching
        dispatch(
          makeMove({
            fromRank: srcRank,
            fromFile: srcFile,
            toRank: adjustedTargetRank,
            toFile: adjustedTargetFile,
            piece: piece as PieceType,
          })
        );
      }
    } else {
    }
  };

  // Add a reset game handler
  const handleResetGame = () => {
    dispatch(resetGame());
  };

  // Add a resign handler
  const handleResign = () => {
    dispatch(resignGame(currentTurn));
  };

  // Handle draw offer
  const handleDrawOffer = () => {
    if (
      window.confirm(
        `${currentTurn === "w" ? "White" : "Black"} offers a draw. Accept?`
      )
    ) {
      dispatch({
        type: "game/acceptDraw",
      });
    }
  };

  // Get game result message
  let gameResultMessage = "";
  if (gameStatus.isOver) {
    if (gameStatus.result === "checkmate") {
      gameResultMessage = `Checkmate! ${
        gameStatus.winner === "w" ? "White" : "Black"
      } wins!`;
    } else if (gameStatus.result === "stalemate") {
      gameResultMessage = "Stalemate! The game is a draw.";
    } else if (gameStatus.result === "resignation") {
      gameResultMessage = `${
        gameStatus.winner === "w" ? "White" : "Black"
      } wins by resignation!`;
    } else if (gameStatus.result === "draw") {
      gameResultMessage = "The game is a draw.";
    }
  }

  // Helper to get appropriate medal icon based on result
  const getMedalIcon = () => {
    if (!gameStatus.isOver) return null;

    if (
      gameStatus.result === "checkmate" ||
      gameStatus.result === "resignation"
    ) {
      const isWinner = gameStatus.winner === currentTurn;
      return isWinner
        ? "🏆" // Trophy for winner
        : "🥈"; // Silver medal for loser
    } else if (
      gameStatus.result === "stalemate" ||
      gameStatus.result === "draw"
    ) {
      return "🤝"; // Handshake for draw
    }
    return "🎮"; // Default game icon
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // Reset show notification when game status changes
  React.useEffect(() => {
    if (gameStatus.isOver) {
      setShowNotification(true);
    }
  }, [gameStatus.isOver]);

  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-center p-4 select-none">
      {/* Replace the full screen game result with a notification badge */}
      {gameStatus.isOver && showNotification && (
        <div className="game-notification">
          <div className="medal-icon">{getMedalIcon()}</div>
          <div className="notification-content">
            <h3>{gameResultMessage}</h3>
            <div className="notification-actions">
              <button
                onClick={handleResetGame}
                className="notification-btn primary"
              >
                New Game
              </button>
              <button
                onClick={handleCloseNotification}
                className="notification-btn secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main game area with premium styling */}
      <div className="main-board-container relative">
        <div className="board-wrapper relative">
          {/* Chess board with enhanced styling */}
          <div
            id="grid"
            className={`grid h-[var(--board-size)] w-[var(--board-size)] relative grid-cols-8 grid-rows-8 select-none will-change-transform rounded-md shadow-xl ${
              gameStatus.isOver ? "opacity-90" : ""
            }`}
            style={{ transform: "translateZ(0)" }}
            onDragOver={gameStatus.isOver ? undefined : handleDragOver}
            onDrop={gameStatus.isOver ? undefined : handleDrop}
          >
            <Ranks ranks={ranks} />
            <>
              {ranks.map((rank, i) =>
                files.map((file, j) => {
                  const arrayRank = 8 - rank;
                  const arrayFile = file - 1;

                  // Check if this square has the king that is in check
                  const piece = currentPosition[arrayRank][arrayFile];
                  const isKingInCheckSquare =
                    piece &&
                    piece[1] === "k" &&
                    ((piece[0] === "w" && checkStatus.white) ||
                      (piece[0] === "b" && checkStatus.black));

                  return (
                    <div
                      key={file + "-" + rank}
                      draggable={false}
                      className={`${getClassName(7 - i, j)} ${
                        isKingInCheckSquare ? "king-check-square" : ""
                      }`}
                      data-rank={arrayRank}
                      data-file={arrayFile}
                    />
                  );
                })
              )}
            </>
            <Pieces onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
            <Files files={files} />

            {/* Remove the turn indicator at bottom of board */}

            {/* Promotion Modal */}
            <PromotionModal
              isVisible={promotionState.isVisible}
              position={promotionState.position}
              color={promotionState.color}
              onSelect={handlePromotionSelect}
            />
          </div>
        </div>
      </div>

      {/* Enhanced side panel with game controls */}
      <div className="chess-side-panel mt-8 lg:mt-0 lg:ml-8">
        <div className="game-info mb-6 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-indigo-500">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Game Status
          </h2>

          <div className="player-status space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-white mr-2"></span>
                <span className="font-medium">White</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 ${
                    currentTurn === "w"
                      ? "bg-blue-100 text-blue-700 rounded-md"
                      : ""
                  }`}
                >
                  {currentTurn === "w" ? "Playing" : ""}
                </span>
                <span
                  className={`ml-2 ${
                    checkStatus.white ? "text-red-600 font-bold" : ""
                  }`}
                >
                  {checkStatus.white ? "Check!" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-gray-800 mr-2"></span>
                <span className="font-medium">Black</span>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 py-1 ${
                    currentTurn === "b"
                      ? "bg-blue-100 text-blue-700 rounded-md"
                      : ""
                  }`}
                >
                  {currentTurn === "b" ? "Playing" : ""}
                </span>
                <span
                  className={`ml-2 ${
                    checkStatus.black ? "text-red-600 font-bold" : ""
                  }`}
                >
                  {checkStatus.black ? "Check!" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="game-controls space-y-3">
          <button
            onClick={handleResign}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition shadow-md flex items-center justify-center"
          >
            <span className="mr-2">🏳️</span> Resign
          </button>

          <button
            onClick={handleDrawOffer}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition shadow-md flex items-center justify-center"
          >
            <span className="mr-2">🤝</span> Offer Draw
          </button>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md flex items-center justify-center"
          >
            <span className="mr-2">{isChatOpen ? "✉️" : "💬"}</span>
            {isChatOpen ? "Close Chat" : "Open Chat"}
          </button>
        </div>

        {/* Enhanced chat interface */}
        {isChatOpen && (
          <div className="chat-panel mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-indigo-600 p-3 text-white">
              <h3 className="font-bold">Chat</h3>
            </div>
            <div className="chat-messages h-48 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-900">
              <div className="chat-message bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500 mb-1">System</div>
                <div>Welcome to the chess game chat!</div>
              </div>
              <div className="chat-message bg-blue-50 dark:bg-blue-900 p-3 rounded-lg shadow-sm ml-4">
                <div className="text-xs text-gray-500 mb-1">You</div>
                <div>Good luck and have fun!</div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition flex items-center">
                  <span className="mr-1">Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
