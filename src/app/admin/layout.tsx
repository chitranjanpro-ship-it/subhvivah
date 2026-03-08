"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import Link from "next/link";
import { LayoutDashboard, Users, ShieldCheck, Settings, LogOut, Heart, Palette, Moon, Sun, Monitor, Briefcase, UserPlus } from "lucide-react";

const ThemeToggle = () => {
  const { mode, setMode } = useThemeStore();
  
  return (
    <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 ml-auto">
      <button 
        type="button"
        onClick={() => setMode('light')}
        className={`p-1 rounded-full transition-all ${mode === 'light' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button 
        type="button"
        onClick={() => setMode('dark')}
        className={`p-1 rounded-full transition-all ${mode === 'dark' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Heart className="w-12 h-12 text-primary-600 animate-pulse fill-primary-600" />
        <p className="text-gray-500 font-bold">Verifying Admin Session...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-sm relative z-20">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-3 text-primary-600 text-2xl font-black tracking-tighter">
            <Heart className="fill-primary-600 w-8 h-8" />
            <span>SUBHVIVAH</span>
          </Link>
          <div className="mt-2 px-3 py-1 bg-primary-50 rounded-full inline-block text-[10px] font-black text-primary-600 uppercase tracking-widest">
            {user?.role === 'ADMIN' ? 'Admin Control Panel' : `${user?.vertical} Team Dashboard`}
          </div>
        </div>
        
        <nav className="flex-grow px-4 space-y-1.5">
          <div className="px-4 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Menu</div>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-2xl transition-all font-bold group">
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-2xl transition-all font-bold group">
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>User Management</span>
          </Link>
          <Link href="/admin/verifications" className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-2xl transition-all font-bold group">
            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Verifications</span>
          </Link>

          {user?.role === 'ADMIN' && (
            <>
              <div className="px-4 pt-6 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Team Control</div>
              <Link href="/admin/team" className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-2xl transition-all font-bold group">
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Admin Team</span>
              </Link>
              <Link href="/admin/tasks" className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-2xl transition-all font-bold group">
                <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Vertical Tasks</span>
              </Link>
            </>
          )}

          {user?.role === 'SUB_ADMIN' && (
            <>
              <div className="px-4 pt-6 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">My Work</div>
              <Link href="/admin/tasks" className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-2xl transition-all font-bold group">
                <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>My Tasks</span>
              </Link>
            </>
          )}
          
          <div className="px-4 pt-6 pb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">System</div>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3.5 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-2xl transition-all font-bold group">
            <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Settings</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3.5 text-gray-600 rounded-2xl font-bold group">
            <Palette className="w-5 h-5" />
            <ThemeToggle />
          </div>
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={async () => { 
              await logout(); 
              router.push("/login"); 
            }}
            className="flex items-center gap-3 px-6 py-4 w-full text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
