import { useEffect, useState } from "react";
import { Header } from "@/react-app/components/Header";
import { Footer } from "@/react-app/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { Button } from "@/react-app/components/ui/button";

interface ProfileRow {
  id: number;
  full_name: string;
  verification_level: number;
  risk_score: number;
  fraud_flags: string | null;
  is_active: number;
}

interface ReportRow {
  id: number;
  reporter_user_id: string;
  profile_id: number;
  type: string;
  description: string | null;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [summary, setSummary] = useState<any>(null);
  const [flagged, setFlagged] = useState<ProfileRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [contribs, setContribs] = useState<any[]>([]);
  const [successes, setSuccesses] = useState<any[]>([]);
  const [revokeId, setRevokeId] = useState("");
  const [revenue, setRevenue] = useState<any>(null);
  const [coordinators, setCoordinators] = useState<any[]>([]);
  const [newCoord, setNewCoord] = useState({ user_id: "", coordinator_id: "", district: "", state: "" });
  const [referralStats, setReferralStats] = useState<any>(null);

  const load = async () => {
    const s = await fetch("/api/admin/summary").then((r) => r.json());
    setSummary(s);
    const f = await fetch("/api/admin/flagged-profiles").then((r) => r.json());
    setFlagged(f);
    const rep = await fetch("/api/admin/reports?status=pending").then((r) => r.json());
    setReports(rep);
    const cs = await fetch("/api/admin/contributions?status=pending").then((r) => r.json());
    setContribs(cs);
    const ss = await fetch("/api/admin/successes?status=pending").then((r) => r.json());
    setSuccesses(ss);
    const rv = await fetch("/api/admin/revenue/summary").then((r) => r.json());
    setRevenue(rv);
    const co = await fetch("/api/admin/coordinators").then((r) => r.json());
    setCoordinators(co);
    const rs = await fetch("/api/admin/referrals/stats").then((r) => r.json());
    setReferralStats(rs);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Verification Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary?.verification?.map((v: any) => (
                    <div key={v.verification_level} className="flex items-center justify-between">
                      <span>Level {v.verification_level}</span>
                      <Badge variant="outline">{v.cnt}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>High Risk Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary?.high_risk ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary?.pending_reports ?? 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flagged.map((p) => {
                    const flags = p.fraud_flags ? JSON.parse(p.fraud_flags) : [];
                    return (
                      <div key={p.id} className="p-4 border rounded-lg flex items-center justify-between">
                        <div>
                          <div className="font-medium">{p.full_name}</div>
                          <div className="text-sm text-muted-foreground">Level {p.verification_level}</div>
                          <div className="flex gap-2 mt-2">
                            {flags.map((f: string, i: number) => (
                              <Badge key={i} variant="outline">{f}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Risk</div>
                          <div className="text-2xl font-bold">{p.risk_score}</div>
                          <div className="text-xs mt-1">{p.is_active ? "Active" : "Restricted"}</div>
                        </div>
                      </div>
                    );
                  })}
                  {flagged.length === 0 && <div className="text-sm text-muted-foreground">No flagged accounts</div>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((r) => (
                    <div key={r.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Profile #{r.profile_id}</div>
                        <Badge variant="outline">{r.type}</Badge>
                      </div>
                      {r.description && <div className="text-sm text-muted-foreground mt-2">{r.description}</div>}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" onClick={async () => {
                          await fetch(`/api/admin/reports/${r.id}/resolve`, { method: "POST" });
                          load();
                        }}>Resolve</Button>
                        <Button variant="destructive" onClick={async () => {
                          await fetch(`/api/admin/reports/${r.id}/reject`, { method: "POST" });
                          load();
                        }}>Reject</Button>
                      </div>
                    </div>
                  ))}
                  {reports.length === 0 && <div className="text-sm text-muted-foreground">No pending reports</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-2">By Category</div>
                    <div className="space-y-1">
                      {revenue?.by_category?.map((x: any) => (
                        <div key={x.category} className="flex items-center justify-between text-sm">
                          <span>{x.category || "uncategorized"}</span>
                          <span>₹{x.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">By Method</div>
                    <div className="space-y-1">
                      {revenue?.by_method?.map((x: any) => (
                        <div key={x.method} className="flex items-center justify-between text-sm">
                          <span>{x.method || "unknown"}</span>
                          <span>₹{x.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 rounded border">
                    <div className="text-xs text-muted-foreground">Risk Alerts</div>
                    <div className="text-xl font-bold">{revenue?.risk_alerts ?? 0}</div>
                  </div>
                  <div className="p-3 rounded border">
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                    <div className="text-xl font-bold">{Math.round((revenue?.success_rate ?? 0) * 100)}%</div>
                  </div>
                  <div className="p-3 rounded border">
                    <div className="text-xs text-muted-foreground">Trust Buckets</div>
                    <div className="text-xs">{revenue?.trust_distribution?.map((x: any) => `${x.bucket}-${x.bucket+9}: ${x.cnt}`).join(" | ")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contributions Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contribs.map((c) => (
                    <div key={c.id} className="p-4 border rounded-lg">
                      <div className="text-sm">Helper #{c.helper_profile_id} → Target #{c.target_profile_id}</div>
                      {c.note && <div className="text-xs text-muted-foreground mt-1">{c.note}</div>}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" onClick={async () => { await fetch(`/api/admin/contributions/${c.id}/approve`, { method: "POST" }); load(); }}>Approve</Button>
                        <Button variant="destructive" onClick={async () => { await fetch(`/api/admin/contributions/${c.id}/reject`, { method: "POST" }); load(); }}>Reject</Button>
                      </div>
                    </div>
                  ))}
                  {contribs.length === 0 && <div className="text-sm text-muted-foreground">No pending contributions</div>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {successes.map((s) => (
                    <div key={s.id} className="p-4 border rounded-lg">
                      <div className="text-sm">Profiles #{s.profile1_id} and #{s.profile2_id}</div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" onClick={async () => { await fetch(`/api/admin/successes/${s.id}/approve`, { method: "POST" }); load(); }}>Grant 6 months</Button>
                      </div>
                    </div>
                  ))}
                  {successes.length === 0 && <div className="text-sm text-muted-foreground">No pending successes</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Referral Unlocks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-2">Pending Unlocks</div>
                    <div className="space-y-2">
                      {referralStats?.pending_unlocks?.map((p: any) => (
                        <div key={p.id} className="p-3 border rounded flex items-center justify-between">
                          <div className="text-sm">{p.full_name} • {p.verified_referral_count}/{p.referral_count}</div>
                          <Button variant="outline" onClick={async () => {
                            await fetch("/api/admin/referrals/grant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile_id: p.id }) });
                            load();
                          }}>Grant</Button>
                        </div>
                      ))}
                      {(!referralStats?.pending_unlocks || referralStats.pending_unlocks.length === 0) && <div className="text-sm text-muted-foreground">None</div>}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Top Referrers</div>
                    <div className="space-y-2">
                      {referralStats?.top_referrers?.map((p: any) => (
                        <div key={p.id} className="p-3 border rounded flex items-center justify-between">
                          <div className="text-sm">{p.full_name}</div>
                          <Badge variant="outline">{p.verified_referral_count}</Badge>
                        </div>
                      ))}
                      {(!referralStats?.top_referrers || referralStats.top_referrers.length === 0) && <div className="text-sm text-muted-foreground">No data</div>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Coordinators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <input className="border rounded px-3 py-2 text-sm" placeholder="User Email" value={newCoord.user_id} onChange={(e) => setNewCoord({ ...newCoord, user_id: e.target.value })} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="Coordinator ID" value={newCoord.coordinator_id} onChange={(e) => setNewCoord({ ...newCoord, coordinator_id: e.target.value })} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="District" value={newCoord.district} onChange={(e) => setNewCoord({ ...newCoord, district: e.target.value })} />
                    <input className="border rounded px-3 py-2 text-sm" placeholder="State" value={newCoord.state} onChange={(e) => setNewCoord({ ...newCoord, state: e.target.value })} />
                  </div>
                  <Button onClick={async () => {
                    await fetch("/api/admin/coordinators", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCoord) });
                    setNewCoord({ user_id: "", coordinator_id: "", district: "", state: "" });
                    load();
                  }}>Add Coordinator</Button>
                </div>
                <div className="mt-4 space-y-2">
                  {coordinators.map((c) => (
                    <div key={c.id} className="p-3 border rounded flex items-center justify-between">
                      <div className="text-sm">
                        <div>{c.coordinator_id} • {c.user_id}</div>
                        <div className="text-xs text-muted-foreground">{c.district}, {c.state} • {c.verified_status}</div>
                      </div>
                      {c.verified_status !== "verified" && (
                        <Button variant="outline" onClick={async () => { await fetch(`/api/admin/coordinators/${c.id}/verify`, { method: "POST" }); load(); }}>Verify</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revoke Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input className="border rounded px-3 py-2 text-sm" placeholder="Profile ID" value={revokeId} onChange={(e) => setRevokeId(e.target.value)} />
                  <Button variant="destructive" onClick={async () => {
                    if (!revokeId) return;
                    await fetch("/api/admin/premium/revoke", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile_id: Number(revokeId), reason: "fraud/abuse" }) });
                    setRevokeId("");
                    load();
                  }}>Revoke</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
