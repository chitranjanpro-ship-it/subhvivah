import { Link } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";
import { 
  Heart, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2,
  Crown,
  Ruler
} from "lucide-react";
import type { Profile } from "@/react-app/data/sampleProfiles";

interface ProfileCardProps {
  profile: Profile;
}

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const low = typeof window !== "undefined" && localStorage.getItem("lowBandwidth") === "true";
  const imgSrc = low ? `${profile.photo_url}${profile.photo_url.includes("?") ? "&" : "?"}w=240&h=300&q=30` : profile.photo_url;
  return (
    <Card className="group overflow-hidden bg-card hover:shadow-xl hover:shadow-saffron/10 transition-all duration-300 border-border/50">
      <div className="relative">
        <Link to={`/profile/${profile.id}`}>
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={imgSrc}
              alt={profile.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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

        {/* Quick Action */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:text-maroon shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="w-4 h-4" />
        </Button>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Name on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display text-lg font-semibold text-white truncate">
            {profile.full_name}, {profile.age}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5" />
            <span>{cmToFeetInches(profile.height_cm)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{profile.city}</span>
          </div>
        </div>

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{profile.education}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{profile.occupation}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {profile.about_me}
        </p>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:border-saffron hover:text-saffron"
            asChild
          >
            <Link to={`/profile/${profile.id}`}>View Profile</Link>
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-saffron to-maroon text-white hover:opacity-90"
          >
            <Heart className="w-4 h-4 mr-1" />
            Interest
          </Button>
        </div>
      </div>
    </Card>
  );
}
