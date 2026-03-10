"use client";

import { useThemeStore, ThemeMode, THEME_CONFIGS } from "@/store/theme.store";
import { Palette, Moon, Sun, Sparkles, Crown, Flower, Check, RefreshCw, Sunset, Trees, Waves, Zap, History } from "lucide-react";
import { useState } from "react";

const PRESET_COLORS = [
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Orange', hex: '#f59e0b' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Violet', hex: '#7c3aed' },
];

const THEMES: { mode: ThemeMode; label: string; icon: any; desc: string }[] = [
  { mode: 'light', label: 'Classic Light', icon: Sun, desc: 'Clean and professional' },
  { mode: 'dark', label: 'Modern Dark', icon: Moon, desc: 'Easy on the eyes' },
  { mode: 'glass', label: 'Glass Morphic', icon: Sparkles, desc: 'Modern translucent look' },
  { mode: 'royal', label: 'Royal Indigo', icon: Crown, desc: 'Premium deep experience' },
  { mode: 'traditional', label: 'Heritage Gold', icon: Flower, desc: 'Traditional aesthetic' },
  { mode: 'sunset', label: 'Evening Sunset', icon: Sunset, desc: 'Warm and atmospheric' },
  { mode: 'forest', label: 'Deep Forest', icon: Trees, desc: 'Natural and grounded' },
  { mode: 'ocean', label: 'Deep Ocean', icon: Waves, desc: 'Calm and steady' },
  { mode: 'minimal', label: 'True Black', icon: Zap, desc: 'Maximum focus mode' },
  { mode: 'vintage', label: 'Antique Paper', icon: History, desc: 'Classic aged look' },
];

export default function AdminSettingsPage() {
  const { mode, primaryColor, setMode, setPrimaryColor } = useThemeStore();
  const [customColor, setCustomColor] = useState(primaryColor);

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-bold">Customize the platform appearance and global styles.</p>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        {/* Theme Mode Selector */}
        <div className="card-style p-8 rounded-[2rem] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black">Platform Theme</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((t) => (
              <button
                key={t.mode}
                onClick={() => setMode(t.mode)}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start gap-3 text-left ${mode === t.mode ? 'border-primary bg-primary/10' : 'border-inherit bg-primary/5 hover:border-primary/20'}`}
              >
                <div className={`p-3 rounded-2xl ${mode === t.mode ? 'bg-primary text-primary-foreground' : 'bg-card text-inherit border border-inherit'}`}>
                  <t.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className={`text-sm font-black ${mode === t.mode ? 'text-primary' : 'text-inherit'}`}>{t.label}</div>
                  <div className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{t.desc}</div>
                </div>
                {mode === t.mode && (
                  <div className="mt-2 w-full h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Global Style / Primary Color */}
          <div className="card-style p-8 rounded-[2rem] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Palette className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black">Global Style</h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black opacity-40 uppercase tracking-widest">Preset Colors</p>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => {
                    setPrimaryColor(color.hex);
                    setCustomColor(color.hex);
                  }}
                  className="group relative aspect-square rounded-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center border-4 border-card shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {primaryColor === color.hex && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <p className="text-xs font-black opacity-40 uppercase tracking-widest">Custom Mixing</p>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl border-4 border-card shadow-md flex-shrink-0"
                style={{ backgroundColor: customColor }}
              />
              <div className="flex-grow space-y-2">
                <input 
                  type="color" 
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setPrimaryColor(e.target.value);
                  }}
                  className="w-full h-10 rounded-xl cursor-pointer bg-primary/5 border border-inherit p-1"
                />
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{customColor}</span>
                  <button 
                    onClick={() => {
                      setPrimaryColor('#f43f5e');
                      setCustomColor('#f43f5e');
                    }}
                    className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground rounded-[2rem] p-10 shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2">Live Preview</h2>
          <p className="font-bold opacity-80 max-w-lg mb-8">This is how your primary action buttons and highlights will look across the platform.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-card text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-black/10 hover:scale-105 transition-all">Primary Action</button>
            <button className="bg-primary-foreground/20 backdrop-blur-md text-primary-foreground border border-primary-foreground/30 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-foreground/30 transition-all">Secondary</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-card/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-card/20 transition-all duration-700" />
      </div>
    </div>
  );
}
