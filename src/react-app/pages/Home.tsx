import { Link } from "react-router";
import { useEffect } from "react";
import { Button } from "@/react-app/components/ui/button";
import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { CommunityCard } from "@/react-app/components/CommunityCard";
import { communities } from "@/react-app/data/communities";
import { Heart, Shield, Users, Star, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 via-transparent to-maroon/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-saffron/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-maroon/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-saffron/10 text-saffron px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 2,00,000+ families across India</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-saffron via-gold to-maroon bg-clip-text text-transparent">
                Perfect Match
              </span>
              <br />
              Within Your Community
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              SubhVivah brings together families from diverse Indian communities. 
              Discover compatible matches who share your values, traditions, and aspirations.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-saffron to-maroon hover:opacity-90 text-white px-8 py-6 text-lg shadow-xl shadow-saffron/25"
                asChild
              >
                <Link to="/register">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg border-2 hover:border-saffron hover:text-saffron"
                asChild
              >
                <Link to="/browse">Browse Profiles</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-saffron" />
                <span>100% Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-maroon" />
                <span>50K+ Success Stories</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold" />
                <span>4.8/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Explore{" "}
              <span className="bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
                Communities
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Select your community to find matches who understand your traditions, 
              values, and cultural background.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
                SubhVivah
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 group hover:shadow-xl hover:shadow-saffron/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/20 to-saffron/5 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-saffron" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Verified Profiles
              </h3>
              <p className="text-muted-foreground">
                Every profile is manually verified to ensure authenticity. 
                Connect with genuine families looking for meaningful relationships.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 group hover:shadow-xl hover:shadow-maroon/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon/20 to-maroon/5 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-maroon" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Community Focused
              </h3>
              <p className="text-muted-foreground">
                Find matches within your specific community who share your 
                cultural values, traditions, and family expectations.
              </p>
            </div>

            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-card to-muted/30 border border-border/50 group hover:shadow-xl hover:shadow-gold/5 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Smart Matching
              </h3>
              <p className="text-muted-foreground">
                Our intelligent matching algorithm considers compatibility factors 
                like education, profession, family values, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-saffron via-orange-500 to-maroon p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Your Life Partner Awaits
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of happy families who found their perfect match through SubhVivah. 
                Registration is free and takes just 2 minutes.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-saffron hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-2xl"
                asChild
              >
                <Link to="/register">
                  Create Free Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
