import { createSlice } from "@reduxjs/toolkit";
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
  reducers: {},
});

export default gameSlice.reducer;
