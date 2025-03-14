import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./gameState/gameState";

export const store = configureStore({
  reducer: {
    gameState: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
