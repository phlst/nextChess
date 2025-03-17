import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createPosition } from "@/app/helper";
import {
  isCheckmate,
  isKingInCheck,
  isStalemate,
} from "@/app/utils/chessMoves";

export enum GameState {
  Active = "ACTIVE",
  Running = "RUNNING",
}

export type PlayerColor = "w" | "b";

interface GameStateType {
  gameState: GameState;
  position: ReturnType<typeof createPosition>;
  currentTurn: PlayerColor; // Added current turn tracking
  moveHistory: string[]; // Optional: track move history
  check: {
    white: boolean; // true if white king is in check
    black: boolean; // true if black king is in check
  };
  gameStatus: {
    isOver: boolean;
    result: string; // "checkmate" | "stalemate" | "resignation" | "draw" | ""
    winner: PlayerColor | null; // "w" | "b" | null (if draw)
  };
}

const initialPosition = createPosition();

const initialState: GameStateType = {
  gameState: GameState.Active,
  position: initialPosition,
  currentTurn: "w", // White starts first
  moveHistory: [],
  check: {
    white: isKingInCheck(initialPosition, "w"),
    black: isKingInCheck(initialPosition, "b"),
  },
  gameStatus: {
    isOver: false,
    result: "",
    winner: null,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    clearPosition: (
      state,
      action: PayloadAction<{ rank: number | string; file: number | string }>
    ) => {
      const { rank, file } = action.payload;
      state.position[rank as number][file as number] = "";
    },
    setPiece: (
      state,
      action: PayloadAction<{ rank: number; file: number; piece: string }>
    ) => {
      const { rank, file, piece } = action.payload;
      state.position[rank][file] = piece;
    },
    // Add new action to switch turns
    switchTurn: (state) => {
      // Toggle between "w" and "b"
      state.currentTurn = state.currentTurn === "w" ? "b" : "w";
    },
    // Make a chess move (combines clearPosition, setPiece, and switchTurn)
    makeMove: (
      state,
      action: PayloadAction<{
        fromRank: number;
        fromFile: number;
        toRank: number;
        toFile: number;
        piece: string;
      }>
    ) => {
      const { fromRank, fromFile, toRank, toFile, piece } = action.payload;

      // Record the move in algebraic notation (optional)
      const fromSquare = `${String.fromCharCode(97 + fromFile)}${8 - fromRank}`;
      const toSquare = `${String.fromCharCode(97 + toFile)}${8 - toRank}`;
      state.moveHistory.push(`${piece} ${fromSquare}-${toSquare}`);

      // Clear source square
      state.position[fromRank][fromFile] = "";

      // Set piece at destination
      state.position[toRank][toFile] = piece;

      // Switch turns
      const nextTurn = state.currentTurn === "w" ? "b" : "w";
      state.currentTurn = nextTurn;

      // Check if either king is in check
      state.check.white = isKingInCheck(state.position, "w");
      state.check.black = isKingInCheck(state.position, "b");

      // Check for checkmate or stalemate
      const isNextPlayerInCheck =
        nextTurn === "w" ? state.check.white : state.check.black;

      if (isNextPlayerInCheck) {
        if (isCheckmate(state.position, nextTurn)) {
          // The previous player (who just moved) wins
          state.gameStatus = {
            isOver: true,
            result: "checkmate",
            winner: nextTurn === "w" ? "b" : "w",
          };
        }
      } else if (isStalemate(state.position, nextTurn)) {
        state.gameStatus = {
          isOver: true,
          result: "stalemate",
          winner: null,
        };
      }
    },
    // Add a new action to update check status
    updateCheckStatus: (state) => {
      state.check.white = isKingInCheck(state.position, "w");
      state.check.black = isKingInCheck(state.position, "b");
    },
    // Add a reset game action
    resetGame: (state) => {
      state.position = createPosition();
      state.currentTurn = "w";
      state.moveHistory = [];
      state.check = {
        white: false,
        black: false,
      };
      state.gameStatus = {
        isOver: false,
        result: "",
        winner: null,
      };
    },
    // Add a resign action
    resignGame: (state, action: PayloadAction<PlayerColor>) => {
      const resigningPlayer = action.payload;

      state.gameStatus = {
        isOver: true,
        result: "resignation",
        winner: resigningPlayer === "w" ? "b" : "w",
      };
    },
    // Add an accept draw action
    acceptDraw: (state) => {
      state.gameStatus = {
        isOver: true,
        result: "draw",
        winner: null,
      };
    },
  },
});

// Export the action creators
export const {
  clearPosition,
  setPiece,
  switchTurn,
  makeMove,
  updateCheckStatus,
  resetGame,
  resignGame,
  acceptDraw,
} = gameSlice.actions;

export default gameSlice.reducer;
