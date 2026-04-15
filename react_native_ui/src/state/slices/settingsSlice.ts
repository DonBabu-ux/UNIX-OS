import { create } from 'zustand';

type ThemeMode = 'dark' | 'light' | 'custom';

interface SettingsState {
  theme: ThemeMode;
  accentColor: string;
  gridColumns: number;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'dark',
  accentColor: '#3d5afe',
  gridColumns: 4,
  setTheme: (theme) => set({ theme }),
  setAccentColor: (color) => set({ accentColor: color }),
}));
