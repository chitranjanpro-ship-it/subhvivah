import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { ProfileCard } from "@/react-app/components/ProfileCard";
import { ProfileFilters, type FilterValues } from "@/react-app/components/ProfileFilters";
import { Button } from "@/react-app/components/ui/button";
import { sampleProfiles } from "@/react-app/data/sampleProfiles";
import { getCommunityById } from "@/react-app/data/communities";
import { SlidersHorizontal, Users } from "lucide-react";

export default function BrowsePage() {
  const [searchParams] = useSearchParams();
  const communityParam = searchParams.get("community");
  const genderParam = searchParams.get("gender");

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    gender: genderParam || "all",
    community: communityParam || "all",
    ageMin: 18,
    ageMax: 50,
    maritalStatus: "all",
    education: "all",
    state: "all",
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const filteredProfiles = useMemo(() => {
    return sampleProfiles.filter((profile) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          profile.full_name.toLowerCase().includes(searchLower) ||
          profile.city.toLowerCase().includes(searchLower) ||
          profile.occupation.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Gender filter
      if (filters.gender !== "all" && profile.gender !== filters.gender) {
        return false;
      }

      // Community filter
      if (filters.community !== "all" && profile.community_id !== filters.community) {
        return false;
      }

      // Age filter
      if (profile.age < filters.ageMin || profile.age > filters.ageMax) {
        return false;
      }

      // Marital status filter
      if (filters.maritalStatus !== "all" && profile.marital_status !== filters.maritalStatus) {
        return false;
      }

      // State filter
      if (filters.state !== "all" && profile.state !== filters.state) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const community = communityParam ? getCommunityById(communityParam) : null;

  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {community ? (
                    <>
                      <span className="mr-2">{community.icon}</span>
                      {community.name} Profiles
                    </>
                  ) : (
                    "Browse Profiles"
                  )}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {community 
                    ? community.description
                    : "Find your perfect match from our verified profiles"
                  }
                </p>
              </div>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{filteredProfiles.length} profiles found</span>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <ProfileFilters
                filters={filters}
                onFilterChange={setFilters}
                showMobileFilters={showMobileFilters}
                onCloseMobileFilters={() => setShowMobileFilters(false)}
              />
            </aside>

            {/* Profile Grid */}
            <div className="flex-1">
              {filteredProfiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No profiles found
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your filters to see more results, or check back later for new profiles.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters */}
      <ProfileFilters
        filters={filters}
        onFilterChange={setFilters}
        showMobileFilters={showMobileFilters}
        onCloseMobileFilters={() => setShowMobileFilters(false)}
      />

      <Footer />
    </div>
  );
}
