"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { Home, Search, MessageSquare, User, CreditCard, LogOut, Heart } from "lucide-react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary-600 text-xl font-bold">
            <Heart className="fill-primary-600" />
            <span>Subhvivah</span>
          </Link>
        </div>
        <nav className="flex-grow px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/search" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
            <User className="w-5 h-5" />
            <span>My Profile</span>
          </Link>
          <Link href="/premium" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
            <CreditCard className="w-5 h-5" />
            <span>Premium</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => { logout(); router.push("/login"); }}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
}
