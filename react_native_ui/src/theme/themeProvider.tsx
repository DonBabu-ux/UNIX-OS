import * as React from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useSettingsStore } from '../state/store';
import { DarkTheme, LightTheme, ThemeType } from './themes';

const ThemeContext = createContext<ThemeType>(DarkTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeMode = useSettingsStore((state) => state.theme);
  const currentTheme = themeMode === 'light' ? LightTheme : DarkTheme;

  useEffect(() => {
    console.log('[THEME] Applied:', themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={currentTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
