import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const THEME_KEY = 'theme-mode';

export type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  ready: boolean;
  setMode: (mode: ThemeMode) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    muted: string;
    border: string;
  };
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'dark' || stored === 'light') {
        setModeState(stored);
      }
      setReady(true);
    });
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(THEME_KEY, next);
  };

  const value = useMemo<ThemeContextValue>(() => {
    const dark = mode === 'dark';
    return {
      mode,
      ready,
      setMode,
      colors: {
        background: dark ? '#111111' : '#FFFFFF',
        card: dark ? '#1C1C1E' : '#F6F3FC',
        text: dark ? '#FFFFFF' : '#1C1C1E',
        muted: dark ? '#C7C7CC' : '#6F6888',
        border: dark ? '#2C2C2E' : '#E6E6EA',
      },
    };
  }, [mode, ready]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return value;
}
