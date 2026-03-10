import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'glass' | 'royal' | 'traditional' | 'sunset' | 'forest' | 'ocean' | 'minimal' | 'vintage';

interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: string;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setBorderRadius: (radius: string) => void;
}

export const THEME_CONFIGS: Record<ThemeMode, { bg: string, fg: string, card: string, border: string }> = {
  light: {
    bg: '#f0fdf4', // Mint Fresh (Green-50)
    fg: '#14532d', // Green-900
    card: '#dcfce7', // Green-100
    border: '#bbf7d0'  // Green-200
  },
  dark: {
    bg: '#0f172a',
    fg: '#f8fafc',
    card: '#1e293b',
    border: '#334155'
  },
  glass: {
    bg: '#fff7ed', // Peach Mist (Orange-50)
    fg: '#7c2d12', // Orange-900
    card: 'rgba(255, 237, 213, 0.4)', // Frosted Peach
    border: 'rgba(253, 186, 116, 0.5)'
  },
  royal: {
    bg: '#1e1b4b', // Indigo-950
    fg: '#eef2ff', // Indigo-50
    card: '#312e81', // Indigo-900
    border: '#4338ca' // Indigo-700
  },
  traditional: {
    bg: '#450a0a', // Royal Ruby (Red-950)
    fg: '#fef2f2', // Red-50
    card: '#7f1d1d', // Red-900
    border: '#991b1b' // Red-700
  },
  sunset: {
    bg: '#2d1b33', // Deep purple
    fg: '#ffd6cc', // Peach
    card: '#4a2c50', // Medium purple
    border: '#633b6d'
  },
  forest: {
    bg: '#052e16', // Deep forest green
    fg: '#dcfce7', // Light green
    card: '#14532d', // Medium green
    border: '#166534'
  },
  ocean: {
    bg: '#082f49', // Deep blue
    fg: '#e0f2fe', // Light blue
    card: '#0c4a6e', // Medium blue
    border: '#075985'
  },
  minimal: {
    bg: '#171717', // Carbon Gray (Neutral-900)
    fg: '#f5f5f5', // Neutral-100
    card: '#262626', // Neutral-800
    border: '#404040' // Neutral-700
  },
  vintage: {
    bg: '#2d241e', // Old Coffee
    fg: '#ede0d4', // Coffee-100
    card: '#3c2f2f', // Coffee-900
    border: '#4b3832' // Coffee-700
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      primaryColor: '#f43f5e',
      borderRadius: '1rem',
      setMode: (mode) => {
        set({ mode });
        if (typeof window !== 'undefined') {
          const config = THEME_CONFIGS[mode];
          document.documentElement.classList.remove('light', 'dark', 'glass', 'royal', 'traditional', 'sunset', 'forest', 'ocean', 'minimal', 'vintage');
          document.documentElement.classList.add(mode);
          
          document.documentElement.style.setProperty('--background', config.bg);
          document.documentElement.style.setProperty('--foreground', config.fg);
          document.documentElement.style.setProperty('--card', config.card);
          document.documentElement.style.setProperty('--border', config.border);
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
      setBorderRadius: (radius) => {
        set({ borderRadius: radius });
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty('--radius', radius);
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
