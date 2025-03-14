"use client";

import { Provider } from "react-redux";
import { store } from "@/app/_store/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
