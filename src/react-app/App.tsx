import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import BrowsePage from "@/react-app/pages/Browse";
import CommunityPage from "@/react-app/pages/Community";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import ProfileDetailPage from "@/react-app/pages/ProfileDetail";
import AdminPage from "@/react-app/pages/Admin";
import MyProfilePage from "@/react-app/pages/MyProfile";
import AboutPage from "@/react-app/pages/About";
import ContactPage from "@/react-app/pages/Contact";
import HelpPage from "@/react-app/pages/Help";
import PrivacyPage from "@/react-app/pages/Privacy";
import TermsPage from "@/react-app/pages/Terms";
import SafetyPage from "@/react-app/pages/Safety";
import NotFoundPage from "@/react-app/pages/NotFound";
import RegisterPage from "@/react-app/pages/Register";

function TitleManager() {
  const location = useLocation();
  useEffect(() => {
    document.title = "SubhVivah – Find Your Match";
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <TitleManager />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/community/:communityId" element={<CommunityPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/profile/:profileId" element={<ProfileDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
