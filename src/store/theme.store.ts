import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: string;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setBorderRadius: (radius: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      primaryColor: '#f43f5e', // Default rose-500
      borderRadius: '1rem',
      setMode: (mode) => {
        set({ mode });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', mode === 'dark');
        }
      },
      setPrimaryColor: (color) => {
        set({ primaryColor: color });
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--primary-color', color);
          // Auto-calculate foreground (white or black) based on luminance
          const fg = getContrastColor(color);
          document.documentElement.style.setProperty('--primary-foreground', fg);
        }
      },
    }),
    {
      name: 'subhvivah-theme-storage',
    }
  )
);

function getContrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}
