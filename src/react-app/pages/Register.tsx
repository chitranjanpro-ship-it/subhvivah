import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Input } from "@/react-app/components/ui/input";
import { Button } from "@/react-app/components/ui/button";

export default function RegisterPage({ mode = "register" }: { mode?: "register" | "signin" }) {
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setError(null);
    setInfo(null);
    const norm = phone.replace(/\D/g, "");
    if (norm.length < 10) { setError("Enter a valid 10-digit mobile number"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: norm }) });
      const js = await res.json();
      if (js.success) {
        setShowOtp(true);
        setInfo("OTP sent (demo). Use 123456 to verify.");
      } else {
        setError(js.error || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: phone.replace(/\D/g, ""), otp }) });
      const js = await res.json();
      if (js.success) {
        navigate("/my-profile");
      } else {
        setError(js.error || "Invalid OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              {mode === "signin" ? "Sign In" : "Create Your Profile"}
            </h1>
            <p className="mt-4 text-muted-foreground">
              Mobile number with OTP login. Email is optional and can be added later.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-md mx-auto px-4 sm:px-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Mobile Number</label>
              <Input
                inputMode="numeric"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2"
              />
            </div>
            {!showOtp ? (
              <Button onClick={sendOtp} disabled={loading} className="bg-gradient-to-r from-saffron to-maroon text-white w-full">
                Send OTP
              </Button>
            ) : (
              <>
                <div>
                  <label className="text-sm text-muted-foreground">Enter OTP</label>
                  <Input
                    inputMode="numeric"
                    placeholder="4-6 digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <Button onClick={verifyOtp} disabled={loading} className="bg-gradient-to-r from-saffron to-maroon text-white w-full">
                  Verify & Continue
                </Button>
              </>
            )}
            {info && <p className="text-xs text-saffron">{info}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
            <p className="text-xs text-muted-foreground">
              By continuing, you agree that we may store consent and audit logs for security.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
