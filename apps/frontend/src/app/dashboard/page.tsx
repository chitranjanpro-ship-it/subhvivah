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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-10 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Hello, {user?.email.split('@')[0]}!</h1>
        <p className="text-primary-50 text-lg opacity-90">Find your perfect match today.</p>
        <div className="mt-8 flex gap-4">
          <Link href="/search" className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-sm">
            Search Now
          </Link>
          <Link href="/profile/edit" className="bg-primary-700/30 backdrop-blur-sm border border-primary-400/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700/50 transition-colors">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-gray-900">New Matches</div>
            <div className="text-gray-500 text-sm">12 new today</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Likes Received</div>
            <div className="text-gray-500 text-sm">5 pending</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Verification</div>
            <div className="text-gray-500 text-sm">Verified</div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
          <Link href="/search" className="text-primary-600 font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((profile, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                <div className="aspect-[3/4] bg-gray-200 relative">
                  {profile.photos?.[0]?.url ? (
                    <img src={profile.photos[0].url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold">
                      View Profile
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900">{profile.name}, {profile.age}</div>
                  <div className="text-gray-500 text-sm">{profile.religion}, {profile.location}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-2xl">
              No recommendations found. Complete your profile to get matches.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
