import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Input } from "@/react-app/components/ui/input";
import { Button } from "@/react-app/components/ui/button";

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const sendOtp = () => {
    if (phone.trim().length < 10) return;
    setShowOtp(true);
  };
  const verifyOtp = () => {
    if (otp.trim().length < 4) return;
    navigate("/my-profile");
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="py-12 md:py-16 border-b border-border/50">
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <h1 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-saffron to-maroon bg-clip-text text-transparent">
              Create Your Profile
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
              <Button onClick={sendOtp} className="bg-gradient-to-r from-saffron to-maroon text-white w-full">
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
                <Button onClick={verifyOtp} className="bg-gradient-to-r from-saffron to-maroon text-white w-full">
                  Verify & Continue
                </Button>
              </>
            )}
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
