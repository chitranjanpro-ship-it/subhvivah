"use client";

import { useThemeStore, ThemeMode } from "@/store/theme.store";
import { Palette, Moon, Sun, Monitor, Check, RefreshCw } from "lucide-react";
import { useState } from "react";

const PRESET_COLORS = [
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Green', hex: '#10b981' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Orange', hex: '#f59e0b' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Slate', hex: '#475569' },
];

export default function AdminSettingsPage() {
  const { mode, primaryColor, setMode, setPrimaryColor } = useThemeStore();
  const [customColor, setCustomColor] = useState(primaryColor);

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-bold">Customize the platform appearance and global styles.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Theme Mode */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Sun className="w-5 h-5 dark:hidden" />
              <Moon className="w-5 h-5 hidden dark:block" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Appearance</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('light')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${mode === 'light' ? 'border-primary-600 bg-primary-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
            >
              <Sun className={`w-8 h-8 ${mode === 'light' ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className={`text-sm font-black ${mode === 'light' ? 'text-primary-600' : 'text-slate-500'}`}>Light Mode</span>
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${mode === 'dark' ? 'border-primary-600 bg-primary-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
            >
              <Moon className={`w-8 h-8 ${mode === 'dark' ? 'text-primary-600' : 'text-slate-400'}`} />
              <span className={`text-sm font-black ${mode === 'dark' ? 'text-primary-600' : 'text-slate-500'}`}>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Global Style / Primary Color */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Palette className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Global Style</h2>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Preset Colors</p>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => {
                    setPrimaryColor(color.hex);
                    setCustomColor(color.hex);
                  }}
                  className="group relative aspect-square rounded-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center border-4 border-white shadow-sm"
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
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Custom Mixing (MS Paint Style)</p>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl border-4 border-white shadow-md flex-shrink-0"
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
                  className="w-full h-10 rounded-xl cursor-pointer bg-slate-50 border border-slate-100 p-1"
                />
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{customColor}</span>
                  <button 
                    onClick={() => {
                      setPrimaryColor('#f43f5e');
                      setCustomColor('#f43f5e');
                    }}
                    className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
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

      <div className="bg-primary-600 rounded-[2rem] p-10 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2">Live Preview</h2>
          <p className="font-bold text-white/80 max-w-lg mb-8">This is how your primary action buttons and highlights will look across the platform.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-black/10 hover:scale-105 transition-all">Primary Action</button>
            <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/30 transition-all">Secondary</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
      </div>
    </div>
  );
}
