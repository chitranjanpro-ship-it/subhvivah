"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useThemeStore, THEME_CONFIGS } from "@/store/theme.store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { mode, primaryColor } = useThemeStore();

  useEffect(() => {
    // Apply theme mode class to html element
    document.documentElement.classList.remove('light', 'dark', 'glass', 'royal', 'traditional', 'sunset', 'forest', 'ocean', 'minimal', 'vintage');
    document.documentElement.classList.add(mode);
    
    // Apply theme config variables
    const config = THEME_CONFIGS[mode];
    document.documentElement.style.setProperty('--background', config.bg);
    document.documentElement.style.setProperty('--foreground', config.fg);
    document.documentElement.style.setProperty('--card', config.card);
    document.documentElement.style.setProperty('--border', config.border);
    
    // Apply primary color and calculated foreground
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    const fg = (yiq >= 128) ? '#000000' : '#ffffff';
    document.documentElement.style.setProperty('--primary-foreground', fg);
  }, [mode, primaryColor]);

  return (
    <html lang="en" className={mode}>
      <body className={`${inter.className} transition-all duration-300`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
