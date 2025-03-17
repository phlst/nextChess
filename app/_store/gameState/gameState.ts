import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createPosition } from "@/app/helper";

export enum GameState {
  Active = "ACTIVE",
  Running = "RUNNING",
}

interface GameStateType {
  gameState: GameState;
  position: ReturnType<typeof createPosition>;
}

const initialState: GameStateType = {
  gameState: GameState.Active,
  position: createPosition(),
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
      // Using Immer under the hood, this syntax is safe for immutable updates
      state.position[rank as number][file as number] = "";
    },
  },
});

// Export the action creators
export const { clearPosition } = gameSlice.actions;

export default gameSlice.reducer;
