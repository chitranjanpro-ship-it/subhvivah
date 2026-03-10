"use client";

import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Search, MessageSquare, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get("/profiles/search");
        setRecommendations(response.data.profiles);
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-primary rounded-3xl p-10 text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Hello, {user?.email.split('@')[0]}!</h1>
          <p className="text-primary-foreground opacity-80 text-lg font-bold">Find your perfect match today.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/search" className="bg-card text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-black/10">
              Search Now
            </Link>
            <Link href="/profile/edit" className="bg-primary-foreground/20 backdrop-blur-md border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-foreground/30 transition-all">
              Edit Profile
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-card/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-card/20 transition-all duration-700" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-style p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <div className="font-black text-inherit text-xl tracking-tight">New Matches</div>
            <div className="text-inherit opacity-40 text-xs font-black uppercase tracking-widest">12 new today</div>
          </div>
        </div>
        <div className="card-style p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <div className="font-black text-inherit text-xl tracking-tight">Likes Received</div>
            <div className="text-inherit opacity-40 text-xs font-black uppercase tracking-widest">5 pending</div>
          </div>
        </div>
        <div className="card-style p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
          <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="font-black text-inherit text-xl tracking-tight">Verification</div>
            <div className="text-inherit opacity-40 text-xs font-black uppercase tracking-widest">Verified</div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-inherit tracking-tight leading-none">Recommended for You</h2>
          <Link href="/search" className="text-primary font-black text-xs uppercase tracking-widest hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendations.length > 0 ? (
            recommendations.map((profile, i) => (
              <div key={i} className="card-style rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-inherit">
                <div className="aspect-[3/4] bg-primary/5 relative overflow-hidden">
                  {profile.photos?.[0]?.url ? (
                    <img src={profile.photos[0].url} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-inherit opacity-20">No Photo</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                    <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-black text-inherit text-lg tracking-tight mb-1">{profile.name}, {profile.age}</div>
                  <div className="text-inherit opacity-40 text-[10px] font-black uppercase tracking-widest">{profile.religion}, {profile.location}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center text-inherit opacity-40 border-4 border-dashed border-inherit rounded-[3rem] font-black uppercase tracking-widest text-xs">
              No recommendations found. Complete your profile to get matches.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
