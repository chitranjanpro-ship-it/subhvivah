"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Search as SearchIcon, MapPin, GraduationCap, Heart, Filter, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: "",
    ageMin: "",
    ageMax: "",
    religion: "",
    location: "",
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/profiles/search", { params: filters });
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error("Failed to fetch profiles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <Heart className="fill-primary-600" />
            <span>Subhvivah</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Features</Link>
            <Link href="/#premium" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Premium</Link>
            <Link href="/#about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">About Us</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-primary-600 font-medium">Login</Link>
            <Link href="/register" className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors">
              Join Free
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24">
        {/* Search Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Browse Profiles</h1>
          <p className="text-lg text-gray-600 font-medium">Find your perfect life partner from thousands of verified profiles.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-xl">
                <Filter className="w-6 h-6 text-primary-600" />
                <span>Filters</span>
              </div>
              
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Looking for</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  >
                    <option value="">Any Gender</option>
                    <option value="MALE">Groom</option>
                    <option value="FEMALE">Bride</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Min Age</label>
                    <input 
                      type="number" 
                      placeholder="18"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                      value={filters.ageMin}
                      onChange={(e) => setFilters({...filters, ageMin: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Max Age</label>
                    <input 
                      type="number" 
                      placeholder="50"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                      value={filters.ageMax}
                      onChange={(e) => setFilters({...filters, ageMax: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Religion</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                    value={filters.religion}
                    onChange={(e) => setFilters({...filters, religion: e.target.value})}
                  >
                    <option value="">Any Religion</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Christian">Christian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="City or State"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all active:scale-[0.98] shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                >
                  <SearchIcon className="w-5 h-5" />
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* Profiles Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse h-[450px]">
                    <div className="h-2/3 bg-gray-100" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-100 rounded w-1/2" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : profiles.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {profiles.map((profile, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group relative border border-gray-100"
                  >
                    <div className="aspect-[3/4] bg-gray-100 relative">
                      {profile.photos?.[0]?.url ? (
                        <img src={profile.photos[0].url} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
                          <User className="w-20 h-20 text-primary-200" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-primary-600 shadow-sm flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 fill-primary-600" />
                          Verified
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{profile.name}, {profile.age}</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                          <MapPin className="w-4 h-4 text-primary-400" />
                          <span>{profile.religion}, {profile.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                          <GraduationCap className="w-4 h-4 text-secondary-400" />
                          <span className="truncate">{profile.education}</span>
                        </div>
                      </div>
                      <Link 
                        href={`/profiles/${profile.id}`}
                        className="mt-6 w-full inline-flex items-center justify-center bg-gray-50 hover:bg-primary-600 hover:text-white text-primary-600 py-3.5 rounded-2xl font-bold transition-all"
                      >
                        View Profile
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchIcon className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No profiles found</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">Try adjusting your filters to find more matches.</p>
                <button 
                  onClick={() => setFilters({ gender: "", ageMin: "", ageMax: "", religion: "", location: "" })}
                  className="mt-8 text-primary-600 font-bold hover:text-primary-500 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
