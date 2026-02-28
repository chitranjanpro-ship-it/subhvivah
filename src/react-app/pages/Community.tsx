import { useParams, Navigate } from "react-router";
import { getCommunityById } from "@/react-app/data/communities";

export default function CommunityPage() {
  const { communityId } = useParams<{ communityId: string }>();
  
  if (!communityId) {
    return <Navigate to="/browse" replace />;
  }

  const community = getCommunityById(communityId);
  
  if (!community) {
    return <Navigate to="/browse" replace />;
  }

  // Redirect to browse with community filter
  return <Navigate to={`/browse?community=${communityId}`} replace />;
}
