import { useEffect, useMemo, useState } from "react";
import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/react-app/components/ui/card";
import { Input } from "@/react-app/components/ui/input";
import { Button } from "@/react-app/components/ui/button";
import { Badge } from "@/react-app/components/ui/badge";
import { Progress } from "@/react-app/components/ui/progress";
import { Checkbox } from "@/react-app/components/ui/checkbox";

async function sha256Browser(data: string) {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(data));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [premium, setPremium] = useState<{ premium_status: boolean; premium_expiry?: string | null; trust_score: number; badges: string[] } | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [pan, setPan] = useState("");
  const [familyPhone, setFamilyPhone] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hindiFirst, setHindiFirst] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [waCode, setWaCode] = useState("");
  const [hope, setHope] = useState<{ hope_points: number; hope_points_expiry?: string | null } | null>(null);

  const verificationPct = useMemo(() => {
    const lvl = profile?.verification_level || 0;
    return (lvl / 4) * 100;
  }, [profile]);

  const load = async () => {
    const p = await fetch("/api/profiles/me").then((r) => r.json());
    setProfile(p);
    const pr = await fetch("/api/premium/me").then((r) => r.json()).catch(() => null);
    if (pr && !pr.error) setPremium(pr);
    setHindiFirst(!!p?.hindi_first);
    setLowBandwidth(!!p?.low_bandwidth);
    const hp = await fetch("/api/hope/me").then((r) => r.json()).catch(() => null);
    if (hp && !hp.error) setHope(hp);
  };

  useEffect(() => {
    load();
  }, []);

  const sendDeviceFingerprint = async () => {
    const ua = navigator.userAgent;
    const lang = navigator.language;
    // Basic cheap fingerprint: UA + language + platform
    const raw = `${ua}|${lang}|${(navigator as any).platform || ""}`;
    const fp = await sha256Browser(raw);
    await fetch("/api/device-fingerprint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profile.id, device_fingerprint: fp }),
    });
  };

  useEffect(() => {
    if (profile?.id) {
      sendDeviceFingerprint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const handle = async (fn: () => Promise<void>) => {
    setError(null);
    setLoading(true);
    try {
      await fn();
      await load();
    } catch (e: any) {
      setError(e?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Complete verification to build trust and visibility</p>
          </div>

          {error && (
            <div className="p-3 rounded-md border border-red-300 bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between"><span>Verification Progress</span><Badge variant="outline">Level {profile?.verification_level ?? 0} / 4</Badge></CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={verificationPct} />
              <div className="text-xs text-muted-foreground mt-2">
                Higher verification improves trust and profile reach
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rural-Friendly Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-2">
                <Checkbox checked={hindiFirst} onCheckedChange={(v) => setHindiFirst(!!v)} />
                <span>Prefer Hindi UI</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={lowBandwidth} onCheckedChange={(v) => {
                  setLowBandwidth(!!v);
                  localStorage.setItem("lowBandwidth", (!!v).toString());
                }} />
                <span>Low-bandwidth images</span>
              </label>
              <div>
                <Button disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/profile/settings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id, hindi_first: hindiFirst, low_bandwidth: lowBandwidth }),
                  });
                })}>Save Settings</Button>
              </div>
              <div className="pt-2">
                <label className="block text-sm mb-1">Voice Bio</label>
                <input type="file" accept="audio/*" onChange={(e) => setVoiceFile(e.target.files?.[0] || null)} />
                <div className="mt-2">
                  <Button disabled={loading || !voiceFile || !profile} onClick={() => handle(async () => {
                    const fd = new FormData();
                    fd.append("profile_id", String(profile.id));
                    fd.append("file", voiceFile as File);
                    await fetch("/api/voice-bio/upload", { method: "POST", body: fd }).then(async r => {
                      if (!r.ok) {
                        const t = await r.json().catch(() => ({}));
                        throw new Error(t.error || "Upload failed");
                      }
                    });
                  })}>Upload Voice Bio</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Premium, Trust & Hope Points</span>
                <Badge variant="outline">{premium?.premium_status ? "Premium Active" : "Free"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">Trust Score: <Badge variant="outline">{premium?.trust_score ?? (profile?.trust_score || 0)}</Badge></div>
              <div className="text-xs text-muted-foreground">
                Badges: {premium?.badges?.length ? premium.badges.join(", ") : "None"}
              </div>
              <div className="text-xs text-muted-foreground">
                Premium Expiry: {premium?.premium_expiry || "N/A"}
              </div>
              <div className="text-sm">Hope Points: <Badge variant="outline">{hope?.hope_points ?? 0}</Badge> {hope?.hope_points_expiry ? `(exp: ${hope.hope_points_expiry})` : ""}</div>
              <div className="flex gap-2">
                <Button disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/premium/paid", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id, plan: "basic" }),
                  }).then(r => {
                    if (!r.ok) throw new Error("Payment failed");
                  });
                  const pr = await fetch("/api/premium/me").then((r) => r.json());
                  setPremium(pr);
                })}>Unlock 3-month Premium (Paid test)</Button>
                <Button variant="secondary" disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/premium/reward/full_verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id }),
                  }).then(async r => {
                    if (!r.ok) {
                      const t = await r.json().catch(() => ({}));
                      throw new Error(t.error || "Reward not applicable");
                    }
                  });
                  const pr = await fetch("/api/premium/me").then((r) => r.json());
                  setPremium(pr);
                })}>Claim Full Verification Reward</Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/hope/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile_id: profile.id, reward: "contact_unlock" }) }).then(async r => {
                    if (!r.ok) {
                      const t = await r.json().catch(() => ({}));
                      throw new Error(t.error || "Redeem failed");
                    }
                  });
                  const hp = await fetch("/api/hope/me").then((r) => r.json());
                  setHope(hp);
                })}>Redeem 50pts → Contact Unlock</Button>
                <Button variant="outline" disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/hope/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile_id: profile.id, reward: "visibility_boost" }) }).then(async r => {
                    if (!r.ok) {
                      const t = await r.json().catch(() => ({}));
                      throw new Error(t.error || "Redeem failed");
                    }
                  });
                  const hp = await fetch("/api/hope/me").then((r) => r.json());
                  setHope(hp);
                })}>Redeem 100pts → 7-day Boost</Button>
                <Button variant="outline" disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/hope/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile_id: profile.id, reward: "mini_premium" }) }).then(async r => {
                    if (!r.ok) {
                      const t = await r.json().catch(() => ({}));
                      throw new Error(t.error || "Redeem failed");
                    }
                  });
                  const hp = await fetch("/api/hope/me").then((r) => r.json());
                  setHope(hp);
                  const pr = await fetch("/api/premium/me").then((r) => r.json());
                  setPremium(pr);
                })}>Redeem 200pts → 1-month Mini Premium</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Level 1: Phone Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/verification/phone/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id, phone_number: phone }),
                  }).then(r => {
                    if (!r.ok) throw new Error("Failed to send OTP");
                  });
                })}>Send OTP</Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Enter OTP code" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} />
                <Button variant="secondary" disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/verification/phone/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id, code: phoneCode }),
                  }).then(r => {
                    if (!r.ok) throw new Error("Invalid OTP");
                  });
                })}>Verify</Button>
              </div>
              <div className="pt-2">
                <div className="text-sm font-medium">WhatsApp OTP (Alternative)</div>
                <div className="flex gap-2 mt-2">
                  <Button disabled={loading || !profile} onClick={() => handle(async () => {
                    await fetch("/api/wa-otp/start", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ profile_id: profile.id, phone_number: phone }),
                    }).then(r => {
                      if (!r.ok) throw new Error("Failed to send WA OTP");
                    });
                  })}>Send WA OTP</Button>
                  <Input placeholder="Enter WA OTP" value={waCode} onChange={(e) => setWaCode(e.target.value)} />
                  <Button variant="secondary" disabled={loading || !profile} onClick={() => handle(async () => {
                    await fetch("/api/wa-otp/verify", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ profile_id: profile.id, code: waCode }),
                    }).then(r => {
                      if (!r.ok) throw new Error("Invalid WA OTP");
                    });
                  })}>Verify WA</Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Status: {profile?.phone_verified ? "Verified" : "Not verified"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Level 2: PAN Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Enter PAN (ABCDE1234F)" value={pan} onChange={(e) => setPan(e.target.value)} />
                <Button disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/verification/pan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id, pan }),
                  }).then(async r => {
                    if (!r.ok) {
                      const t = await r.json().catch(() => ({}));
                      throw new Error(t.error || "PAN verification failed");
                    }
                  });
                })}>Verify PAN</Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Stored: {profile?.pan_masked ? profile.pan_masked : "Not provided"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Level 3: Selfie Liveness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button disabled={loading || !profile} onClick={() => handle(async () => {
                await fetch("/api/verification/selfie", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ profile_id: profile.id }),
                }).then(r => {
                  if (!r.ok) throw new Error("Selfie verification failed");
                });
              })}>Mark Selfie Verified</Button>
              <div className="text-xs text-muted-foreground">
                Status: {profile?.selfie_verified ? "Verified" : "Not verified"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Level 4: Family Phone Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Enter family member phone" value={familyPhone} onChange={(e) => setFamilyPhone(e.target.value)} />
                <Button disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/verification/family/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id, family_phone: familyPhone }),
                  }).then(r => {
                    if (!r.ok) throw new Error("Failed to send family OTP");
                  });
                })}>Send OTP</Button>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Enter OTP code" value={familyCode} onChange={(e) => setFamilyCode(e.target.value)} />
                <Button variant="secondary" disabled={loading || !profile} onClick={() => handle(async () => {
                  await fetch("/api/verification/family/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profile_id: profile.id, code: familyCode }),
                  }).then(r => {
                    if (!r.ok) throw new Error("Invalid family OTP");
                  });
                })}>Verify</Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Status: {profile?.family_verified ? "Verified" : "Not verified"}
              </div>
            </CardContent>
          </Card>

          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Risk & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">Risk Score: <Badge variant="outline">{profile.risk_score}</Badge></div>
                <div className="text-xs text-muted-foreground">
                  Flags: {profile.fraud_flags ? JSON.parse(profile.fraud_flags).join(", ") : "None"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Visibility: {profile.is_active ? "Active" : "Restricted due to risk"}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
