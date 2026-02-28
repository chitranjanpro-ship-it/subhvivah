import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Loader2, Heart } from "lucide-react";

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate("/browse");
      } catch (err) {
        console.error("Auth callback error:", err);
        setError("Failed to complete login. Please try again.");
        setTimeout(() => navigate("/"), 3000);
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-muted-foreground text-sm mt-2">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-saffron to-maroon flex items-center justify-center mb-6 animate-pulse">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-saffron mb-4" />
        <h2 className="font-display text-xl font-semibold text-foreground">
          Completing your login...
        </h2>
        <p className="text-muted-foreground mt-2">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}
