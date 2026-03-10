"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore, ThemeMode } from "@/store/theme.store";
import { Heart, Loader2, Eye, EyeOff, Sun, Moon, Sparkles, Crown, Flower, Sunset, Trees, Waves, Zap, History } from "lucide-react";
import toast from "react-hot-toast";

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
          className={`p-1.5 rounded-lg transition-all ${mode === t.mode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-primary opacity-40 hover:opacity-100'}`}
          title={t.mode}
        >
          <t.icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      toast.success("Login successful!");
      
      // Check if user is admin
      const user = useAuthStore.getState().user;
      if (user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login Error UI:", error.response?.data);
      const data = error.response?.data;
      const errorMessage = data?.error || data?.message || "Login failed";
      const hint = data?.hint ? `\nHint: ${data.hint}` : "";
      toast.error(`${errorMessage}${hint}`);
    }
  };

  return (
    <div className="min-h-screen bg-inherit flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Top right theme toggle */}
      <div className="absolute top-8 right-8 z-20 flex flex-col items-end gap-2">
        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Global Theme</span>
        <ThemeToggle />
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full space-y-8 card-style backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 relative z-10 transition-all duration-300">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-primary text-3xl font-bold hover:scale-105 transition-transform">
            <Heart className="fill-primary w-8 h-8" />
            <span>Subhvivah</span>
          </Link>
          <h2 className="mt-8 text-3xl font-extrabold text-inherit tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-sm text-inherit opacity-70 font-medium">
            Find your life partner with trust & tradition.
          </p>
        </div>
        
        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-inherit mb-1.5 ml-1">Email address <span className="text-primary">*</span></label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3.5 border border-inherit bg-inherit placeholder-inherit opacity-80 text-inherit rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-inherit mb-1.5 ml-1">Password <span className="text-primary">*</span></label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-4 py-3.5 border border-inherit bg-inherit placeholder-inherit opacity-80 text-inherit rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-inherit opacity-40 hover:opacity-100 transition-opacity"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-inherit rounded-lg cursor-pointer bg-inherit"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-inherit opacity-70 cursor-pointer font-medium">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-semibold text-primary hover:opacity-80 transition-all">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            New to Subhvivah?{" "}
            <Link href="/register" className="text-primary-600 font-bold hover:text-primary-500 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
      
      {/* Footer link */}
      <div className="absolute bottom-8 text-center w-full">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
