"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { Home, Search, MessageSquare, User, CreditCard, LogOut, Heart, Sun, Moon, Sparkles, Crown, Flower, Sunset, Trees, Waves, Zap, History } from "lucide-react";
import { useThemeStore, ThemeMode } from "@/store/theme.store";

const ThemeToggle = () => {
  const { mode, setMode } = useThemeStore();
  const themes: { mode: ThemeMode; icon: any }[] = [
    { mode: 'light', icon: Sun },
    { mode: 'dark', icon: Moon },
    { mode: 'glass', icon: Sparkles },
    { mode: 'royal', icon: Crown },
    { mode: 'traditional', icon: Flower },
    { mode: 'sunset', icon: Sunset },
    { mode: 'forest', icon: Trees },
    { mode: 'ocean', icon: Waves },
    { mode: 'minimal', icon: Zap },
    { mode: 'vintage', icon: History },
  ];

  return (
    <div className="flex bg-primary/5 p-1 rounded-xl border border-primary/10">
      {themes.map((t) => (
        <button
          key={t.mode}
          onClick={() => setMode(t.mode)}
          className={`p-1.5 rounded-lg transition-all ${mode === t.mode ? 'bg-primary text-white shadow-sm' : 'text-primary/40 hover:text-primary'}`}
          title={t.mode}
        >
          <t.icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen card-style">
      <div className="flex flex-col items-center gap-4">
        <Heart className="w-12 h-12 text-primary animate-pulse fill-primary" />
        <p className="opacity-50 font-bold">Loading Experience...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 card-style border-r flex flex-col transition-all duration-300">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary text-xl font-bold">
            <Heart className="fill-primary" />
            <span>Subhvivah</span>
          </Link>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-primary opacity-10 hover:text-primary rounded-lg transition-all duration-200">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/search" className="flex items-center gap-3 px-4 py-3 hover:bg-primary opacity-10 hover:text-primary rounded-lg transition-all duration-200">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-primary opacity-10 hover:text-primary rounded-lg transition-all duration-200">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-primary opacity-10 hover:text-primary rounded-lg transition-all duration-200">
            <User className="w-5 h-5" />
            <span>My Profile</span>
          </Link>
          <Link href="/premium" className="flex items-center gap-3 px-4 py-3 hover:bg-primary opacity-10 hover:text-primary rounded-lg transition-all duration-200">
            <CreditCard className="w-5 h-5" />
            <span>Premium</span>
          </Link>
          <div className="pt-4 px-4 flex items-center justify-between">
            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
        </nav>
        <div className="p-4 border-t border-inherit">
          <button 
            onClick={() => { logout(); router.push("/login"); }}
            className="flex items-center gap-3 px-4 py-3 w-full hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-inherit">
        {children}
      </main>
    </div>
  );
}
