"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore, ThemeMode } from "@/store/theme.store";
import Link from "next/link";
import { LayoutDashboard, Users, ShieldCheck, ShieldAlert, Settings, LogOut, Heart, Palette, Moon, Sun, Monitor, Briefcase, UserPlus, Sparkles, Crown, Flower, Sunset, Trees, Waves, Zap, History } from "lucide-react";

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    // Only redirect if we are sure the user is NOT an admin or sub-admin
    if (!isLoading && user && user.role !== "ADMIN" && user.role !== "SUB_ADMIN") {
      router.push("/dashboard");
    } else if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen card-style">
      <div className="flex flex-col items-center gap-4">
        <Heart className="w-12 h-12 text-primary animate-pulse fill-primary" />
        <p className="opacity-50 font-bold">Verifying Admin Session...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen transition-all duration-300">
      {/* Sidebar */}
      <aside className="w-72 card-style border-r flex flex-col shadow-sm relative z-20 transition-all duration-300">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-3 text-primary text-2xl font-black tracking-tighter">
            <Heart className="fill-primary w-8 h-8" />
            <span>SUBHVIVAH</span>
          </Link>
          <div className="mt-2 px-3 py-1 bg-primary/10 rounded-full inline-block text-[10px] font-black text-primary uppercase tracking-widest">
            {user?.role === 'ADMIN' ? 'Admin Control Panel' : `Team Dashboard`}
          </div>
        </div>
        
        <nav className="flex-grow px-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 pb-2 text-[10px] font-black opacity-40 uppercase tracking-widest">Main Menu</div>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all font-bold group">
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all font-bold group">
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>User Management</span>
          </Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all font-bold group">
            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Verifications</span>
          </Link>
          <Link href="/admin/chat-moderation" className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all font-bold group">
            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform text-red-500" />
            <span>Chat Safety</span>
          </Link>

          {user?.role === 'ADMIN' && (
            <>
              <div className="px-4 pt-6 pb-2 text-[10px] font-black opacity-40 uppercase tracking-widest">Team Control</div>
              <Link href="/admin/team" className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all font-bold group">
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Admin Team</span>
              </Link>
              <Link href="/admin/tasks" className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all font-bold group">
                <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Vertical Tasks</span>
              </Link>
            </>
          )}

          <div className="px-4 pt-6 pb-2 text-[10px] font-black opacity-40 uppercase tracking-widest">System</div>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3.5 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all font-bold group">
            <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Settings</span>
          </Link>
          <div className="pt-4 px-4 flex items-center justify-between">
            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={async () => { 
              await logout(); 
              router.push("/login"); 
            }}
            className="flex items-center gap-3 px-6 py-4 w-full text-red-600 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto bg-inherit transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
