import { createContext } from "react";

export const state = {
  menuId: undefined,
};

export interface GlobalState {
  menuId: number | undefined | string;
}

const GlobalContext = createContext<GlobalState>(state);

export default GlobalContext;
