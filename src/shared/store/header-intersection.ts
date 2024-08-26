import { create } from "zustand";

interface State {
  isHidden: boolean;
  setIsHidden: (isHidden: boolean) => void;
}

export const useHeaderStore = create<State>()((set) => ({
  isHidden: false,
  setIsHidden: (isHidden: boolean) => set({ isHidden }),
}));
