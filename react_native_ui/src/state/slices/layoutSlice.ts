import { create } from 'zustand';

export interface IconPosition {
  packageName: string;
  x: number;
  y: number;
}

interface LayoutState {
  iconPositions: IconPosition[];
  updatePosition: (packageName: string, x: number, y: number) => void;
  resetLayout: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  iconPositions: [],
  updatePosition: (packageName, x, y) =>
    set((state) => {
      const existing = state.iconPositions.findIndex((p) => p.packageName === packageName);
      const newPositions = [...state.iconPositions];
      if (existing !== -1) {
        newPositions[existing] = { packageName, x, y };
      } else {
        newPositions.push({ packageName, x, y });
      }
      return { iconPositions: newPositions };
    }),
  resetLayout: () => set({ iconPositions: [] }),
}));
