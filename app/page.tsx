"use client";
import { Provider } from "react-redux";
import Board from "./_components/Board/Board";
import { store } from "./_store/store";

export default function Home() {
  return (
    <Provider store={store}>
      <div className="h-screen w-screen flex justify-center items-center">
        <Board />
      </div>
    </Provider>
  );
}
