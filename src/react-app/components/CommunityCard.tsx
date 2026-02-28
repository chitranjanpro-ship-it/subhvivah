import { Link } from "react-router";
import { Card } from "@/react-app/components/ui/card";
import { Users } from "lucide-react";
import type { Community } from "@/react-app/data/communities";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link to={`/community/${community.id}`}>
      <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:shadow-saffron/10 hover:-translate-y-1 border-2 border-transparent hover:border-saffron/20 bg-gradient-to-br from-card to-muted/30">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-saffron/10 to-transparent rounded-bl-full" />
        
        <div className="flex items-start gap-4">
          <div className="text-4xl">{community.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-saffron transition-colors">
              {community.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {community.description}
            </p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{community.memberCount.toLocaleString()} profiles</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-saffron via-gold to-maroon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </Card>
    </Link>
  );
}
