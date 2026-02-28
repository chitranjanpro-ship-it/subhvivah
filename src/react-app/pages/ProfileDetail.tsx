import { useParams, Link } from "react-router";
import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import { sampleProfiles } from "@/react-app/data/sampleProfiles";
import { getCommunityById } from "@/react-app/data/communities";
import {
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  MapPin,
  GraduationCap,
  Briefcase,
  Wallet,
  User,
  Calendar,
  Ruler,
  Globe,
  CheckCircle2,
  Crown,
  ArrowLeft,
  ChevronRight,
  Users,
  Home,
  BookOpen,
} from "lucide-react";
import { useEffect } from "react";

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export default function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const low = typeof window !== "undefined" && localStorage.getItem("lowBandwidth") === "true";
  
  const profile = sampleProfiles.find((p) => p.id === Number(profileId));
  const community = profile ? getCommunityById(profile.community_id) : null;

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-pattern">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/browse">Browse Profiles</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Similar profiles from same community
  const similarProfiles = sampleProfiles
    .filter((p) => p.community_id === profile.community_id && p.id !== profile.id && p.gender === profile.gender)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <Header />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/browse" className="hover:text-saffron transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{profile.full_name}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Photo & Quick Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Main Photo */}
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={low ? `${profile.photo_url}${profile.photo_url.includes("?") ? "&" : "?"}w=540&h=720&q=35` : profile.photo_url}
                    alt={profile.full_name}
                    className="w-full aspect-[3/4] object-cover"
                    loading="lazy"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {profile.is_premium && (
                      <Badge className="bg-gradient-to-r from-gold to-amber-500 text-white border-0 shadow-lg">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {profile.is_verified && (
                      <Badge variant="secondary" className="bg-white/90 text-green-700 backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6">
                    <h1 className="font-display text-2xl font-bold text-white">
                      {profile.full_name}
                    </h1>
                    <p className="text-white/80 flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4" />
                      {profile.city}, {profile.state}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Calendar className="w-5 h-5 mx-auto text-saffron mb-1" />
                      <p className="text-lg font-semibold">{profile.age} yrs</p>
                      <p className="text-xs text-muted-foreground">Age</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Ruler className="w-5 h-5 mx-auto text-saffron mb-1" />
                      <p className="text-lg font-semibold">{cmToFeetInches(profile.height_cm)}</p>
                      <p className="text-xs text-muted-foreground">Height</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Globe className="w-5 h-5 mx-auto text-saffron mb-1" />
                      <p className="text-lg font-semibold truncate">{profile.mother_tongue}</p>
                      <p className="text-xs text-muted-foreground">Language</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Users className="w-5 h-5 mx-auto text-saffron mb-1" />
                      <p className="text-lg font-semibold truncate">{community?.name || profile.community_id}</p>
                      <p className="text-xs text-muted-foreground">Community</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-saffron to-maroon text-white hover:opacity-90 h-12 text-base">
                  <Heart className="w-5 h-5 mr-2" />
                  Send Interest
                </Button>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-12 hover:border-saffron hover:text-saffron">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="h-12 hover:border-saffron hover:text-saffron">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="h-12 hover:border-saffron hover:text-saffron">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Me */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <User className="w-5 h-5 text-saffron" />
                    About {profile.full_name.split(" ")[0]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.about_me}
                  </p>
                </CardContent>
              </Card>

              {/* Basic Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-saffron" />
                    Basic Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <DetailRow 
                      icon={<Calendar className="w-4 h-4" />}
                      label="Age" 
                      value={`${profile.age} years`} 
                    />
                    <DetailRow 
                      icon={<Ruler className="w-4 h-4" />}
                      label="Height" 
                      value={`${cmToFeetInches(profile.height_cm)} (${profile.height_cm} cm)`} 
                    />
                    <DetailRow 
                      icon={<User className="w-4 h-4" />}
                      label="Marital Status" 
                      value={profile.marital_status} 
                    />
                    <DetailRow 
                      icon={<MapPin className="w-4 h-4" />}
                      label="Location" 
                      value={`${profile.city}, ${profile.state}`} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Education & Career */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-saffron" />
                    Education & Career
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <DetailRow 
                      icon={<GraduationCap className="w-4 h-4" />}
                      label="Education" 
                      value={profile.education} 
                    />
                    <DetailRow 
                      icon={<Briefcase className="w-4 h-4" />}
                      label="Occupation" 
                      value={profile.occupation} 
                    />
                    <DetailRow 
                      icon={<Wallet className="w-4 h-4" />}
                      label="Annual Income" 
                      value={profile.annual_income} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Religious Background */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Home className="w-5 h-5 text-saffron" />
                    Religious & Cultural Background
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <DetailRow 
                      icon={<span className="text-sm">{community?.icon || "🕉️"}</span>}
                      label="Religion" 
                      value={profile.religion} 
                    />
                    <DetailRow 
                      icon={<Users className="w-4 h-4" />}
                      label="Community" 
                      value={community?.name || profile.community_id} 
                    />
                    <DetailRow 
                      icon={<Globe className="w-4 h-4" />}
                      label="Mother Tongue" 
                      value={profile.mother_tongue} 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Similar Profiles */}
              {similarProfiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-saffron" />
                        Similar Profiles
                      </span>
                      <Link 
                        to={`/browse?community=${profile.community_id}&gender=${profile.gender}`}
                        className="text-sm font-normal text-saffron hover:underline"
                      >
                        View All
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {similarProfiles.map((p) => (
                        <Link 
                          key={p.id} 
                          to={`/profile/${p.id}`}
                          className="group"
                        >
                          <div className="relative rounded-lg overflow-hidden">
                            <img
                              src={p.photo_url}
                              alt={p.full_name}
                              className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-white font-medium text-sm truncate">{p.full_name}</p>
                              <p className="text-white/70 text-xs">{p.age} yrs, {p.city}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DetailRow({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center text-saffron flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
