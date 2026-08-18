import { createContext, useContext } from "react";

export const NewAdDesktopLayoutContext = createContext(false);

export function useNewAdDesktopLayout() {
  return useContext(NewAdDesktopLayoutContext);
}
