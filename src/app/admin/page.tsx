"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Users, ShieldCheck, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Heart } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data.stats);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Heart className="w-12 h-12 text-primary animate-pulse fill-primary" />
        <p className="opacity-50 font-bold">Fetching Analytics...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "blue", change: "+12%", trend: "up" },
    { label: "Total Profiles", value: stats?.totalProfiles || 0, icon: ShieldCheck, color: "green", change: "+5%", trend: "up" },
    { label: "Pending Verifications", value: stats?.pendingVerifications || 0, icon: Activity, color: "orange", change: "-2%", trend: "down" },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Admin Overview</h1>
          <p className="opacity-50 font-bold">Monitor platform growth and verification requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-slate-200" />
            ))}
          </div>
          <div className="text-sm font-bold opacity-60">+12 online now</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-style p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black mb-1">{stats?.totalUsers || 0}</div>
            <div className="text-xs font-black opacity-40 uppercase tracking-widest">Total Members</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>

        <div className="card-style p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black mb-1">{stats?.pendingVerifications || 0}</div>
            <div className="text-xs font-black opacity-40 uppercase tracking-widest">Pending Verification</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>

        <div className="card-style p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-4xl font-black mb-1">94%</div>
            <div className="text-xs font-black opacity-40 uppercase tracking-widest">Success Rate</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card-style p-10 rounded-[3rem] shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black">Recent Verification Requests</h2>
              <Link href="/admin/verifications" className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-200 flex-shrink-0" />
                    <div>
                      <div className="font-black text-lg">User Request #{i}294</div>
                      <div className="text-xs font-bold opacity-40 uppercase tracking-widest">Submitted 2 hours ago</div>
                    </div>
                  </div>
                  <Link 
                    href="/admin/verifications"
                    className="px-6 py-3 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-lg shadow-primary/20"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-style p-8 rounded-[3rem] shadow-sm">
            <h2 className="text-xl font-black mb-8">System Health</h2>
            <div className="space-y-6">
              {[
                { label: 'Database', status: 'Healthy', color: 'bg-green-500' },
                { label: 'AI Engine', status: 'Active', color: 'bg-green-500' },
                { label: 'Auth Service', status: 'Online', color: 'bg-green-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="text-sm font-bold opacity-60">{item.label}</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                    <span className="text-xs font-black uppercase tracking-widest">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
