import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";

const app = new Hono<{ Bindings: Env }>();

async function sha256(data: string) {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(data));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256(key: string, data: string) {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function maskPan(pan: string) {
  const last4 = pan.slice(-4);
  return `XXXXXX${last4}`;
}

function nowPlusMinutes(minutes: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

async function getProfile(c: any, id: number) {
  const res = await c.env.DB.prepare("SELECT * FROM profiles WHERE id = ?").bind(id).all();
  return res.results?.[0] || null;
}

async function setVerificationLevel(c: any, id: number) {
  const p = await getProfile(c, id);
  if (!p) return;
  let level = 0;
  if (p.phone_verified) level = Math.max(level, 1);
  if (p.pan_hash) level = Math.max(level, 2);
  if (p.selfie_verified) level = Math.max(level, 3);
  if (p.family_verified) level = Math.max(level, 4);
  await c.env.DB.prepare("UPDATE profiles SET verification_level = ?, verification_timestamp = CURRENT_TIMESTAMP WHERE id = ?").bind(level, id).run();
}

async function appendFraudFlag(c: any, id: number, flag: string) {
  const p = await getProfile(c, id);
  const flags = (() => {
    try {
      return p?.fraud_flags ? JSON.parse(p.fraud_flags) : [];
    } catch {
      return [];
    }
  })();
  if (!flags.includes(flag)) flags.push(flag);
  await c.env.DB.prepare("UPDATE profiles SET fraud_flags = ? WHERE id = ?").bind(JSON.stringify(flags), id).run();
}

async function adjustRisk(c: any, id: number, delta: number, reason: string) {
  const p = await getProfile(c, id);
  const current = p?.risk_score ?? 0;
  const next = Math.min(100, current + delta);
  await c.env.DB.prepare("UPDATE profiles SET risk_score = ? WHERE id = ?").bind(next, id).run();
  await appendFraudFlag(c, id, reason);
  if (next >= 70) {
    await c.env.DB.prepare("UPDATE profiles SET is_active = 0 WHERE id = ?").bind(id).run();
    await c.env.DB.prepare("INSERT INTO moderation_queue (profile_id, source, type, reason, status, risk_score) VALUES (?, 'system', 'risk', ?, 'pending', ?)").bind(id, reason, next).run();
  }
  if (["duplicate_pan","shared_device","interest_rate_high","spam_message_reuse"].includes(reason) || next >= 70) {
    await c.env.DB.prepare("UPDATE profiles SET hope_points = 0, hope_points_expiry = NULL WHERE id = ?").bind(id).run();
  }
}

// Get OAuth redirect URL for Google login
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Exchange OAuth code for session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

function splitCSV(s?: string) {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}
function userEmail(c: any) {
  return c.get("user")?.email || "";
}
const rolePermissions: Record<string, string[]> = {
  super_admin: ["*"],
  platform_admin: ["rbac:*","settings:*","analytics:view","cms:*","themes:*","vendor:*","reviews:*","fraud:*","finance:view","success:*","verification:*","premium:*","coordinator:*"],
  trust_safety_officer: ["fraud:*","reviews:*","verification:approve","suspension:*","analytics:view"],
  verification_officer: ["verification:approve","reviews:verification","reviews:view"],
  finance_admin: ["finance:*","analytics:view","payments:view"],
  content_moderator: ["cms:*","reviews:content","analytics:view"],
  state_coordinator: ["coordinator:*","verification:approve"],
  district_coordinator: ["coordinator:*"],
  support_agent: ["reviews:view","suspension:shadow","profile:view"],
  read_only_auditor: ["analytics:view","reviews:view","cms:view","themes:view","finance:view"]
};
async function getAdminRow(c: any) {
  const email = userEmail(c);
  const res = await c.env.DB.prepare("SELECT * FROM admins WHERE email = ? AND account_status = 'active'").bind(email).all();
  return res.results?.[0] || null;
}
function hasPerm(role: string, need: string) {
  const perms = rolePermissions[role] || [];
  if (perms.includes("*")) return true;
  if (perms.includes(need)) return true;
  const [m, a] = need.split(":");
  return perms.includes(`${m}:*`);
}
async function checkPermission(c: any, perm: string, twofaCritical = false) {
  const admins = splitCSV(c.env.ADMIN_EMAILS);
  const email = userEmail(c);
  if (admins.includes(email)) return null;
  const row = await getAdminRow(c);
  if (!row) return c.json({ error: "Forbidden" }, 403);
  const role = String(row.role);
  if (!hasPerm(role, perm)) return c.json({ error: "No permission" }, 403);
  const ip = c.req.header("cf-connecting-ip") || "";
  const ua = c.req.header("user-agent") || "";
  await c.env.DB.prepare("UPDATE admins SET last_login_ip = ?, last_login_device = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(ip, ua, row.id).run();
  if (twofaCritical && row.twofa_enabled) {
    const body = await c.req.json().catch(() => ({}));
    const code = body.twofa_code || c.req.header("x-admin-2fa");
    if (!code || code !== c.env.ADMIN_2FA_TEST_CODE) return c.json({ error: "2FA required" }, 401);
  }
  return null;
}
async function adminGate(c: any) { return checkPermission(c, "analytics:view"); }
async function coordGate(c: any) {
  const email = userEmail(c);
  const res = await c.env.DB.prepare("SELECT * FROM coordinators WHERE user_id = ? AND verified_status = 'verified'").bind(email).all();
  const row = res.results?.[0];
  if (!row) return null;
  return row;
}
async function logAudit(c: any, action: string, target_type: string, target_id: string, metadata?: any) {
  const actor = c.get("user")?.id || "";
  await c.env.DB.prepare("INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, metadata) VALUES (?, ?, ?, ?, ?)").bind(actor, action, target_type, target_id, metadata ? JSON.stringify(metadata) : null).run();
}

app.post("/api/admin/coordinators", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "coordinator:*");
  if (guard) return guard;
  const body = await c.req.json();
  const userId = String(body.user_id || "");
  const coordinatorId = String(body.coordinator_id || "");
  const district = String(body.district || "");
  const state = String(body.state || "");
  if (!userId || !coordinatorId) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT INTO coordinators (user_id, coordinator_id, district, state, verified_status) VALUES (?, ?, ?, ?, 'pending')").bind(userId, coordinatorId, district, state).run();
  await logAudit(c, "create_coordinator", "coordinator", coordinatorId, { userId, district, state });
  return c.json({ success: true }, 200);
});
app.get("/api/admin/coordinators", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "coordinator:*");
  if (guard) return guard;
  const res = await c.env.DB.prepare("SELECT * FROM coordinators ORDER BY created_at DESC").all();
  return c.json(res.results || []);
});
app.post("/api/admin/coordinators/:id/verify", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "coordinator:*", true);
  if (guard) return guard;
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await c.env.DB.prepare("UPDATE coordinators SET verified_status = 'verified', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  await logAudit(c, "verify_coordinator", "coordinator", String(id));
  return c.json({ success: true }, 200);
});
app.post("/api/coordinator/assisted/create_profile", authMiddleware, async (c) => {
  const coord = await coordGate(c);
  if (!coord) return c.json({ error: "Coordinator only" }, 403);
  const body = await c.req.json();
  const fullName = String(body.full_name || "Assisted User");
  const community = String(body.community_id || "general");
  const gender = String(body.gender || "");
  const insert = await c.env.DB.prepare("INSERT INTO profiles (user_id, community_id, full_name, gender, is_verified, is_premium, is_active, assisted_mode, coordinator_id) VALUES (?, ?, ?, ?, 0, 0, 1, 1, ?)").bind(`assisted:${Date.now()}`, community, fullName, gender, coord.id).run();
  await logAudit(c, "assisted_create_profile", "profile", String(insert.meta.last_row_id), { coordinator_id: coord.id });
  return c.json({ success: true, profile_id: insert.meta.last_row_id }, 200);
});
app.post("/api/coordinator/verify_rural", authMiddleware, async (c) => {
  const coord = await coordGate(c);
  if (!coord) return c.json({ error: "Coordinator only" }, 403);
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET rural_verified = 1, coordinator_id = ? WHERE id = ?").bind(coord.id, profileId).run();
  await logAudit(c, "rural_verify", "profile", String(profileId), { coordinator_id: coord.id });
  return c.json({ success: true }, 200);
});
app.post("/api/wa-otp/start", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const phone = String(body.phone_number || "").trim();
  if (!profileId || !phone) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET phone_number = ?, last_ip = ? WHERE id = ?").bind(phone, c.req.header("cf-connecting-ip") || "", profileId).run();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await hmacSha256(c.env.PAN_HASH_KEY, code);
  await c.env.DB.prepare("INSERT INTO verifications (profile_id, type, code_hash, expires_at) VALUES (?, 'whatsapp', ?, ?)").bind(profileId, codeHash, nowPlusMinutes(10)).run();
  return c.json({ success: true }, 200);
});
app.post("/api/wa-otp/verify", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const code = String(body.code || "");
  if (!profileId || !code) return c.json({ error: "Invalid input" }, 400);
  if (c.env.TEST_OTP_BYPASS === "1" && code === "000000") {
    await c.env.DB.prepare("UPDATE profiles SET whatsapp_otp_verified = 1, phone_verified = 1 WHERE id = ?").bind(profileId).run();
    await setVerificationLevel(c, profileId);
    return c.json({ success: true, bypass: true }, 200);
  }
  const codeHash = await hmacSha256(c.env.PAN_HASH_KEY, code);
  const res = await c.env.DB.prepare("SELECT * FROM verifications WHERE profile_id = ? AND type = 'whatsapp' AND expires_at > CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1").bind(profileId).all();
  const row = res.results?.[0];
  if (!row || row.code_hash !== codeHash) return c.json({ error: "Invalid code" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET whatsapp_otp_verified = 1, phone_verified = 1 WHERE id = ?").bind(profileId).run();
  await setVerificationLevel(c, profileId);
  return c.json({ success: true }, 200);
});
app.post("/api/profile/settings", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const hindi = body.hindi_first ? 1 : 0;
  const low = body.low_bandwidth ? 1 : 0;
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET hindi_first = ?, low_bandwidth = ? WHERE id = ?").bind(hindi, low, profileId).run();
  return c.json({ success: true }, 200);
});
app.post("/api/voice-bio/upload", authMiddleware, async (c) => {
  const contentType = c.req.header("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) return c.json({ error: "Content-Type must be multipart/form-data" }, 400);
  const form = await c.req.formData();
  const profileId = Number(form.get("profile_id"));
  const file = form.get("file") as File | null;
  if (!profileId || !file) return c.json({ error: "Invalid input" }, 400);
  const key = `voice_bios/${profileId}_${Date.now()}_${file.name}`;
  // @ts-ignore
  await c.env.R2_BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  const url = `r2://${key}`;
  await c.env.DB.prepare("UPDATE profiles SET voice_bio_url = ? WHERE id = ?").bind(url, profileId).run();
  await logAudit(c, "voice_bio_upload", "profile", String(profileId), { key });
  return c.json({ success: true, url }, 200);
});
app.post("/api/payments/upi/initiate", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const amount = Number(body.amount || 0);
  const category = String(body.category || "membership");
  const vpa = String(body.upi_vpa || "upi@bank");
  if (!profileId || amount <= 0) return c.json({ error: "Invalid input" }, 400);
  const txnRef = `UPI${Date.now()}`;
  await c.env.DB.prepare("INSERT INTO payments (profile_id, amount, plan, status, category, method, upi_vpa, txn_ref) VALUES (?, ?, ?, 'pending', ?, 'upi', ?, ?)").bind(profileId, amount, category, category, vpa, txnRef).run();
  await logAudit(c, "upi_initiate", "payment", txnRef, { profileId, amount, category, vpa });
  return c.json({ success: true, txn_ref: txnRef, intent: `upi://pay?pa=${encodeURIComponent(vpa)}&pn=SubhVivah&am=${amount}&tn=${encodeURIComponent(category)}&tr=${txnRef}` }, 200);
});
app.post("/api/payments/upi/confirm", authMiddleware, async (c) => {
  const body = await c.req.json();
  const txnRef = String(body.txn_ref || "");
  if (!txnRef) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE payments SET status = 'paid' WHERE txn_ref = ?").bind(txnRef).run();
  await logAudit(c, "upi_confirm", "payment", txnRef);
  return c.json({ success: true }, 200);
});
app.get("/api/admin/revenue/summary", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "finance:view");
  if (guard) return guard;
  const byCat = await c.env.DB.prepare("SELECT category, SUM(amount) AS total FROM payments WHERE status = 'paid' GROUP BY category").all();
  const byMethod = await c.env.DB.prepare("SELECT method, SUM(amount) AS total FROM payments WHERE status = 'paid' GROUP BY method").all();
  const trust = await c.env.DB.prepare("SELECT (trust_score/10)*10 AS bucket, COUNT(*) AS cnt FROM profiles GROUP BY bucket").all();
  const risk = await c.env.DB.prepare("SELECT COUNT(*) AS alerts FROM profiles WHERE risk_score >= 70").all();
  const succ = await c.env.DB.prepare("SELECT SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approved, COUNT(*) AS total FROM successes").all();
  return c.json({
    by_category: byCat.results || [],
    by_method: byMethod.results || [],
    trust_distribution: trust.results || [],
    risk_alerts: risk.results?.[0]?.alerts ?? 0,
    success_rate: succ.results && succ.results[0] ? ((succ.results[0].approved || 0) / Math.max(1, succ.results[0].total || 1)) : 0,
  });
});

app.get("/api/profiles/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const userId = user.id;
  let res = await c.env.DB.prepare("SELECT * FROM profiles WHERE user_id = ?").bind(userId).all();
  let profile = res.results?.[0] || null;
  if (!profile) {
    const name =
      user.google_user_data?.name ||
      user.email?.split("@")[0] ||
      "New User";
    const community = "general";
    const insert = await c.env.DB.prepare(
      "INSERT INTO profiles (user_id, community_id, full_name, gender, is_verified, is_premium, is_active) VALUES (?, ?, ?, '', 0, 0, 1)"
    )
      .bind(userId, community, name)
      .run();
    const id = insert.meta.last_row_id;
    res = await c.env.DB.prepare("SELECT * FROM profiles WHERE id = ?").bind(id).all();
    profile = res.results?.[0] || null;
  }
  return c.json(profile);
});

// Get current user
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Logout
app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

app.post("/api/verification/phone/start", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const phone = String(body.phone_number || "").trim();
  if (!profileId || !phone) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET phone_number = ?, last_ip = ? WHERE id = ?").bind(phone, c.req.header("cf-connecting-ip") || "", profileId).run();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await hmacSha256(c.env.PAN_HASH_KEY, code);
  await c.env.DB.prepare("INSERT INTO verifications (profile_id, type, code_hash, expires_at) VALUES (?, 'phone', ?, ?)").bind(profileId, codeHash, nowPlusMinutes(10)).run();
  return c.json({ success: true }, 200);
});

app.post("/api/verification/phone/verify", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const code = String(body.code || "");
  if (!profileId || !code) return c.json({ error: "Invalid input" }, 400);
  if (c.env.TEST_OTP_BYPASS === "1" && code === "000000") {
    await c.env.DB.prepare("UPDATE profiles SET phone_verified = 1 WHERE id = ?").bind(profileId).run();
    await setVerificationLevel(c, profileId);
    await logAudit(c, "verify_phone", "profile", String(profileId), { bypass: true });
    return c.json({ success: true, bypass: true }, 200);
  }
  const codeHash = await hmacSha256(c.env.PAN_HASH_KEY, code);
  const res = await c.env.DB.prepare("SELECT * FROM verifications WHERE profile_id = ? AND type = 'phone' AND expires_at > CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1").bind(profileId).all();
  const row = res.results?.[0];
  if (!row || row.code_hash !== codeHash) return c.json({ error: "Invalid code" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET phone_verified = 1 WHERE id = ?").bind(profileId).run();
  await setVerificationLevel(c, profileId);
  await logAudit(c, "verify_phone", "profile", String(profileId));
  return c.json({ success: true }, 200);
});

app.post("/api/verification/pan", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const pan = String(body.pan || "").toUpperCase().replace(/\s+/g, "");
  if (!profileId || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return c.json({ error: "Invalid PAN" }, 400);
  const panHash = await hmacSha256(c.env.PAN_HASH_KEY, pan);
  const panMasked = maskPan(pan);
  const dup = await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM profiles WHERE pan_hash = ? AND id <> ?").bind(panHash, profileId).all();
  const dupCnt = dup.results?.[0]?.cnt ?? 0;
  await c.env.DB.prepare("UPDATE profiles SET pan_hash = ?, pan_masked = ? WHERE id = ?").bind(panHash, panMasked, profileId).run();
  await setVerificationLevel(c, profileId);
  await logAudit(c, "verify_pan", "profile", String(profileId), { masked: panMasked });
  if (dupCnt > 0) {
    await adjustRisk(c, profileId, 50, "duplicate_pan");
  }
  return c.json({ success: true, duplicate: dupCnt > 0 }, 200);
});

app.post("/api/verification/selfie", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET selfie_verified = 1 WHERE id = ?").bind(profileId).run();
  await setVerificationLevel(c, profileId);
  await logAudit(c, "verify_selfie", "profile", String(profileId));
  return c.json({ success: true }, 200);
});

app.post("/api/verification/family/start", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const phone = String(body.family_phone || "").trim();
  if (!profileId || !phone) return c.json({ error: "Invalid input" }, 400);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await hmacSha256(c.env.PAN_HASH_KEY, code);
  await c.env.DB.prepare("INSERT INTO verifications (profile_id, type, code_hash, expires_at) VALUES (?, 'family', ?, ?)").bind(profileId, codeHash, nowPlusMinutes(10)).run();
  return c.json({ success: true }, 200);
});

app.post("/api/verification/family/verify", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const code = String(body.code || "");
  if (!profileId || !code) return c.json({ error: "Invalid input" }, 400);
  if (c.env.TEST_OTP_BYPASS === "1" && code === "000000") {
    await c.env.DB.prepare("UPDATE profiles SET family_verified = 1 WHERE id = ?").bind(profileId).run();
    await setVerificationLevel(c, profileId);
    await logAudit(c, "verify_family", "profile", String(profileId), { bypass: true });
    return c.json({ success: true, bypass: true }, 200);
  }
  const codeHash = await hmacSha256(c.env.PAN_HASH_KEY, code);
  const res = await c.env.DB.prepare("SELECT * FROM verifications WHERE profile_id = ? AND type = 'family' AND expires_at > CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1").bind(profileId).all();
  const row = res.results?.[0];
  if (!row || row.code_hash !== codeHash) return c.json({ error: "Invalid code" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET family_verified = 1 WHERE id = ?").bind(profileId).run();
  await setVerificationLevel(c, profileId);
  await logAudit(c, "verify_family", "profile", String(profileId));
  return c.json({ success: true }, 200);
});

app.post("/api/device-fingerprint", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const fingerprint = String(body.device_fingerprint || "").trim();
  if (!profileId || !fingerprint) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET device_fingerprint = ?, last_ip = ? WHERE id = ?").bind(fingerprint, c.req.header("cf-connecting-ip") || "", profileId).run();
  const dup = await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM profiles WHERE device_fingerprint = ? AND id <> ?").bind(fingerprint, profileId).all();
  const dupCnt = dup.results?.[0]?.cnt ?? 0;
  if (dupCnt > 0) {
    await adjustRisk(c, profileId, 30, "shared_device");
  }
  return c.json({ success: true, duplicate: dupCnt > 0 }, 200);
});

app.post("/api/interests", authMiddleware, async (c) => {
  const body = await c.req.json();
  const fromId = Number(body.from_profile_id);
  const toId = Number(body.to_profile_id);
  const message = body.message ? String(body.message).slice(0, 500) : null;
  if (!fromId || !toId) return c.json({ error: "Invalid input" }, 400);
  const created = await c.env.DB.prepare("INSERT INTO interests (from_profile_id, to_profile_id, message) VALUES (?, ?, ?)").bind(fromId, toId, message).run();
  const rate = await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM interests WHERE from_profile_id = ? AND created_at > DATETIME('now','-1 hour')").bind(fromId).all();
  const rateCnt = rate.results?.[0]?.cnt ?? 0;
  if (rateCnt > 20) {
    await adjustRisk(c, fromId, 30, "interest_rate_high");
  }
  if (message) {
    const reuse = await c.env.DB.prepare("SELECT COUNT(DISTINCT to_profile_id) AS cnt FROM interests WHERE from_profile_id = ? AND message = ? AND created_at > DATETIME('now','-10 minutes')").bind(fromId, message).all();
    const reuseCnt = reuse.results?.[0]?.cnt ?? 0;
    if (reuseCnt >= 5) {
      await adjustRisk(c, fromId, 20, "spam_message_reuse");
    }
  }
  return c.json({ success: true, id: created.meta.last_row_id }, 200);
});

app.post("/api/reports", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const type = String(body.type || "");
  const description = body.description ? String(body.description).slice(0, 1000) : null;
  const reporter = c.get("user")?.id || "";
  const valid = ["fake_profile", "financial_scam", "harassment", "misrepresentation"];
  if (!profileId || !valid.includes(type)) return c.json({ error: "Invalid input" }, 400);
  const res = await c.env.DB.prepare("INSERT INTO reports (reporter_user_id, profile_id, type, description) VALUES (?, ?, ?, ?)").bind(reporter, profileId, type, description).run();
  await c.env.DB.prepare("INSERT INTO moderation_queue (profile_id, source, type, reason, status) VALUES (?, 'report', ?, ?, 'pending')").bind(profileId, type, description || "").run();
  return c.json({ success: true, id: res.meta.last_row_id }, 200);
});

app.post("/api/block", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const userId = c.get("user")?.id || "";
  if (!profileId || !userId) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT OR IGNORE INTO blocked_profiles (blocker_user_id, profile_id) VALUES (?, ?)").bind(userId, profileId).run();
  return c.json({ success: true }, 200);
});

app.get("/api/admin/flagged-profiles", async (c) => {
  const res = await c.env.DB.prepare("SELECT id, full_name, verification_level, risk_score, fraud_flags, is_active FROM profiles WHERE risk_score >= 70 OR (fraud_flags IS NOT NULL AND fraud_flags <> '') ORDER BY risk_score DESC").all();
  return c.json(res.results || []);
});

app.get("/api/admin/reports", async (c) => {
  const status = c.req.query("status") || "pending";
  const res = await c.env.DB.prepare("SELECT * FROM reports WHERE status = ? ORDER BY created_at DESC").bind(status).all();
  return c.json(res.results || []);
});

app.post("/api/admin/reports/:id/resolve", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await c.env.DB.prepare("UPDATE reports SET status = 'resolved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  return c.json({ success: true }, 200);
});

app.post("/api/admin/reports/:id/reject", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await c.env.DB.prepare("UPDATE reports SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  return c.json({ success: true }, 200);
});

app.get("/api/admin/summary", async (c) => {
  const v = await c.env.DB.prepare("SELECT verification_level, COUNT(*) AS cnt FROM profiles GROUP BY verification_level").all();
  const r = await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM profiles WHERE risk_score >= 70").all();
  const rep = await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM reports WHERE status = 'pending'").all();
  return c.json({
    verification: v.results || [],
    high_risk: r.results?.[0]?.cnt ?? 0,
    pending_reports: rep.results?.[0]?.cnt ?? 0,
  });
});

app.post("/api/users/delete", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("UPDATE profiles SET is_active = 0, pan_hash = NULL, pan_masked = NULL, device_fingerprint = NULL, last_ip = NULL WHERE id = ?").bind(profileId).run();
  await c.env.DB.prepare("INSERT INTO moderation_queue (profile_id, source, type, reason, status) VALUES (?, 'user', 'deletion_request', '', 'pending')").bind(profileId).run();
  return c.json({ success: true }, 200);
});
function addMonths(dateStr: string, months: number) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
async function getProfileByUser(c: any, userId: string) {
  const res = await c.env.DB.prepare("SELECT * FROM profiles WHERE user_id = ?").bind(userId).all();
  return res.results?.[0] || null;
}
async function recomputeTrustScore(c: any, id: number) {
  const p = await getProfile(c, id);
  if (!p) return 0;
  let score = 0;
  if (p.pan_hash) score += 20;
  if (p.family_verified) score += 20;
  const fields = ["full_name","gender","birth_date","height_cm","city","state","education","occupation","annual_income","religion","mother_tongue","about_me","photo_url"];
  let filled = 0;
  for (const f of fields) {
    if (p[f] !== null && p[f] !== undefined && String(p[f]).trim() !== "") filled++;
  }
  const completeness = Math.round((filled / fields.length) * 100);
  if (completeness >= 100) score += 20;
  const approvedContrib = await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM contributions WHERE helper_profile_id = ? AND status = 'approved'").bind(id).all();
  const contribCnt = approvedContrib.results?.[0]?.cnt ?? 0;
  score += Math.min(20, contribCnt * 10);
  score += Math.min(10, (p.verification_level || 0) * 2);
  const penalty = Math.min(30, Math.floor((p.risk_score || 0) * 0.3));
  score = Math.max(0, Math.min(100, score - penalty));
  await c.env.DB.prepare("UPDATE profiles SET trust_score = ? WHERE id = ?").bind(score, id).run();
  return score;
}
async function grantPremium(c: any, id: number, months: number, source: string) {
  const p = await getProfile(c, id);
  if (!p) return;
  const today = new Date().toISOString().slice(0, 10);
  const base = p.premium_expiry && p.premium_status ? p.premium_expiry : today;
  const expires = addMonths(base, months);
  await c.env.DB.prepare("UPDATE profiles SET premium_status = 1, premium_expiry = ? WHERE id = ?").bind(expires, id).run();
  await c.env.DB.prepare("INSERT INTO premium_grants (profile_id, source, months, starts_at, expires_at) VALUES (?, ?, ?, ?, ?)").bind(id, source, months, base, expires).run();
}
async function revokePremium(c: any, id: number, reason: string) {
  await c.env.DB.prepare("UPDATE profiles SET premium_status = 0 WHERE id = ?").bind(id).run();
  await c.env.DB.prepare("UPDATE premium_grants SET revoked = 1, reason = ? WHERE profile_id = ? AND revoked = 0").bind(reason, id).run();
}
function computeBadges(p: any) {
  const badges: string[] = [];
  if (p.verification_level >= 2) {
    if ((p.gender || "").toLowerCase() === "male") badges.push("Verified Groom");
    if ((p.gender || "").toLowerCase() === "female") badges.push("Verified Bride");
  }
  if (p.family_verified) badges.push("Family Approved");
  if (p.birth_date) {
    const age = Math.floor((Date.now() - new Date(p.birth_date).getTime()) / (365.25 * 24 * 3600 * 1000));
    if (age >= 30) badges.push("Second Chance (30+)");
  }
  return badges;
}
app.get("/api/premium/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const p = await getProfileByUser(c, user.id);
  if (!p) return c.json({ error: "Profile not found" }, 404);
  const badges = computeBadges(p);
  return c.json({ premium_status: !!p.premium_status, premium_expiry: p.premium_expiry, trust_score: p.trust_score || 0, badges });
});
app.post("/api/premium/paid", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const plan = String(body.plan || "basic");
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  const amount = plan === "pro" ? 1999 : 999;
  await c.env.DB.prepare("INSERT INTO payments (profile_id, amount, plan, status) VALUES (?, ?, ?, 'paid')").bind(profileId, amount, plan).run();
  await grantPremium(c, profileId, 3, "paid");
  await recomputeTrustScore(c, profileId);
  await logAudit(c, "payment_paid", "profile", String(profileId), { amount, plan, source: "paid" });
  return c.json({ success: true }, 200);
});
app.post("/api/referrals/record", authMiddleware, async (c) => {
  const body = await c.req.json();
  const referrer = Number(body.referrer_profile_id);
  const referred = Number(body.referred_profile_id);
  if (!referrer || !referred || referrer === referred) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT OR IGNORE INTO referrals (referrer_profile_id, referred_profile_id) VALUES (?, ?)").bind(referrer, referred).run();
  await c.env.DB.prepare("UPDATE profiles SET referral_count = referral_count + 1 WHERE id = ?").bind(referrer).run();
  const refUser = await c.env.DB.prepare("SELECT user_id FROM profiles WHERE id = ?").bind(referrer).all();
  const ru = refUser.results?.[0];
  if (ru) {
    await c.env.DB.prepare("UPDATE profiles SET referred_by_user_id = ? WHERE id = ?").bind(ru.user_id, referred).run();
  }
  return c.json({ success: true }, 200);
});
app.post("/api/referrals/verify", authMiddleware, async (c) => {
  const body = await c.req.json();
  const referrer = Number(body.referrer_profile_id);
  const referred = Number(body.referred_profile_id);
  if (!referrer || !referred) return c.json({ error: "Invalid input" }, 400);
  const rRes = await c.env.DB.prepare("SELECT * FROM profiles WHERE id = ?").bind(referred).all();
  const rp = rRes.results?.[0];
  if (!rp) return c.json({ error: "Referred not found" }, 404);
  if (rp.pan_hash && (await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM profiles WHERE pan_hash = ?").bind(rp.pan_hash).all()).results?.[0]?.cnt > 1) {
    return c.json({ error: "Duplicate PAN" }, 400);
  }
  if (rp.device_fingerprint && (await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM profiles WHERE device_fingerprint = ?").bind(rp.device_fingerprint).all()).results?.[0]?.cnt > 1) {
    return c.json({ error: "Duplicate device" }, 400);
  }
  const ageRes = await c.env.DB.prepare("SELECT CASE WHEN julianday('now') - julianday(created_at) >= 30 THEN 1 ELSE 0 END AS ok FROM profiles WHERE id = ?").bind(referred).all();
  const ageOk = ageRes.results?.[0]?.ok === 1;
  if (!ageOk || !rp.is_active) return c.json({ error: "Profile not active for 30 days" }, 400);
  const fields = ["full_name","gender","birth_date","height_cm","city","state","education","occupation","annual_income","religion","mother_tongue","about_me","photo_url"];
  let filled = 0;
  for (const f of fields) if (rp[f] !== null && rp[f] !== undefined && String(rp[f]).trim() !== "") filled++;
  const completeness = Math.round((filled / fields.length) * 100);
  if (!(completeness >= 80 && rp.phone_verified)) return c.json({ error: "Criteria not met" }, 400);
  await c.env.DB.prepare("UPDATE referrals SET status = 'verified' WHERE referrer_profile_id = ? AND referred_profile_id = ?").bind(referrer, referred).run();
  await c.env.DB.prepare("UPDATE profiles SET verified_referral_count = verified_referral_count + 1 WHERE id = ?").bind(referrer).run();
  const counts = await c.env.DB.prepare("SELECT referral_count, verified_referral_count FROM profiles WHERE id = ?").bind(referrer).all();
  const row = counts.results?.[0] || { referral_count: 0, verified_referral_count: 0 };
  if (row.referral_count >= 5 && row.verified_referral_count >= 3) {
    await grantPremium(c, referrer, 3, "referrals");
  }
  await recomputeTrustScore(c, referrer);
  return c.json({ success: true }, 200);
});
app.post("/api/contributions/new", authMiddleware, async (c) => {
  const body = await c.req.json();
  const helper = Number(body.helper_profile_id);
  const target = Number(body.target_profile_id);
  const note = body.note ? String(body.note).slice(0, 500) : null;
  if (!helper || !target || helper === target) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT INTO contributions (helper_profile_id, target_profile_id, note) VALUES (?, ?, ?)").bind(helper, target, note).run();
  return c.json({ success: true }, 200);
});
app.get("/api/admin/contributions", async (c) => {
  const status = c.req.query("status") || "pending";
  const res = await c.env.DB.prepare("SELECT * FROM contributions WHERE status = ? ORDER BY created_at DESC").bind(status).all();
  return c.json(res.results || []);
});
app.post("/api/admin/contributions/:id/approve", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  const cur = await c.env.DB.prepare("SELECT * FROM contributions WHERE id = ?").bind(id).all();
  const row = cur.results?.[0];
  if (!row) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("UPDATE contributions SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  const countRes = await c.env.DB.prepare("SELECT COUNT(*) AS cnt FROM contributions WHERE helper_profile_id = ? AND status = 'approved'").bind(row.helper_profile_id).all();
  const cnt = countRes.results?.[0]?.cnt ?? 0;
  await adjustHopePoints(c, row.helper_profile_id, 20);
  if (cnt >= 2) {
    await c.env.DB.prepare("UPDATE profiles SET contribution_type = 'rural_support' WHERE id = ?").bind(row.helper_profile_id).run();
    await grantPremium(c, row.helper_profile_id, 3, "contribution");
    await recomputeTrustScore(c, row.helper_profile_id);
  }
  await logAudit(c, "contribution_approved", "contribution", String(id), { helper_profile_id: row.helper_profile_id, target_profile_id: row.target_profile_id });
  return c.json({ success: true }, 200);
});
app.post("/api/admin/contributions/:id/reject", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await c.env.DB.prepare("UPDATE contributions SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  return c.json({ success: true }, 200);
});
app.post("/api/premium/reward/full_verification", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  const p = await getProfile(c, profileId);
  if (!p) return c.json({ error: "Profile not found" }, 404);
  const fields = ["full_name","gender","birth_date","height_cm","city","state","education","occupation","annual_income","religion","mother_tongue","about_me","photo_url"];
  let filled = 0;
  for (const f of fields) if (p[f] !== null && p[f] !== undefined && String(p[f]).trim() !== "") filled++;
  const completeness = Math.round((filled / fields.length) * 100);
  if (!(p.verification_level >= 4 && completeness >= 100)) return c.json({ error: "Criteria not met" }, 400);
  await grantPremium(c, profileId, 1, "full_verification");
  await c.env.DB.prepare("UPDATE profiles SET success_reward_status = 'full_verification_granted' WHERE id = ?").bind(profileId).run();
  await recomputeTrustScore(c, profileId);
  return c.json({ success: true }, 200);
});
app.post("/api/successes/report", authMiddleware, async (c) => {
  const body = await c.req.json();
  const p1 = Number(body.profile1_id);
  const p2 = Number(body.profile2_id);
  if (!p1 || !p2 || p1 === p2) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT INTO successes (profile1_id, profile2_id) VALUES (?, ?)").bind(p1, p2).run();
  return c.json({ success: true }, 200);
});
app.get("/api/admin/successes", async (c) => {
  const status = c.req.query("status") || "pending";
  const res = await c.env.DB.prepare("SELECT * FROM successes WHERE status = ? ORDER BY created_at DESC").bind(status).all();
  return c.json(res.results || []);
});
app.post("/api/admin/successes/:id/approve", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  const cur = await c.env.DB.prepare("SELECT * FROM successes WHERE id = ?").bind(id).all();
  const row = cur.results?.[0];
  if (!row) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("UPDATE successes SET status = 'approved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  await grantPremium(c, row.profile1_id, row.granted_months || 6, "success_reward");
  await grantPremium(c, row.profile2_id, row.granted_months || 6, "success_reward");
  await c.env.DB.prepare("UPDATE profiles SET success_reward_status = 'engagement_granted' WHERE id IN (?, ?)").bind(row.profile1_id, row.profile2_id).run();
  await c.env.DB.prepare("UPDATE profiles SET success_status = 'engaged', engagement_date = DATE('now') WHERE id IN (?, ?)").bind(row.profile1_id, row.profile2_id).run();
  await c.env.DB.prepare("UPDATE profiles SET hope_points = hope_points + 50, hope_points_expiry = DATE('now','+12 months') WHERE id IN (?, ?)").bind(row.profile1_id, row.profile2_id).run();
  await recomputeTrustScore(c, row.profile1_id);
  await recomputeTrustScore(c, row.profile2_id);
  return c.json({ success: true }, 200);
});
app.post("/api/admin/successes/:id/mark-married", async (c) => {
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  const cur = await c.env.DB.prepare("SELECT * FROM successes WHERE id = ?").bind(id).all();
  const row = cur.results?.[0];
  if (!row) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("UPDATE successes SET status = 'closed', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  await c.env.DB.prepare("UPDATE profiles SET success_status = 'married', marriage_date = DATE('now') WHERE id IN (?, ?)").bind(row.profile1_id, row.profile2_id).run();
  return c.json({ success: true }, 200);
});
app.post("/api/admin/premium/revoke", async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const reason = String(body.reason || "revoked");
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  await revokePremium(c, profileId, reason);
  return c.json({ success: true }, 200);
});
app.get("/api/profiles/search", async (c) => {
  const res = await c.env.DB.prepare("SELECT * FROM profiles WHERE is_active = 1").all();
  const items = (res.results || []).map((p: any) => {
    const base = p.trust_score || 0;
    const premiumBoost = p.premium_status ? 15 : 0;
    const verifBoost = (p.verification_level || 0) * 5;
    const boost = p.visibility_boost_expiry && p.visibility_boost_expiry >= new Date().toISOString().slice(0,10) ? 5 : 0;
    const score = base + premiumBoost + verifBoost + boost;
    return { ...p, rank_score: score };
  }).sort((a: any, b: any) => b.rank_score - a.rank_score);
  return c.json(items);
});
function nowPlusDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
async function adjustHopePoints(c: any, id: number, delta: number) {
  const p = await getProfile(c, id);
  if (!p) return;
  const current = p.hope_points || 0;
  const next = Math.max(0, current + delta);
  const expiry = p.hope_points_expiry && p.hope_points_expiry > new Date().toISOString().slice(0,10) ? p.hope_points_expiry : addMonths(new Date().toISOString().slice(0,10), 12);
  await c.env.DB.prepare("UPDATE profiles SET hope_points = ?, hope_points_expiry = ? WHERE id = ?").bind(next, expiry, id).run();
}
app.get("/api/hope/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const p = await getProfileByUser(c, user.id);
  if (!p) return c.json({ error: "Profile not found" }, 404);
  return c.json({ hope_points: p.hope_points || 0, hope_points_expiry: p.hope_points_expiry || null });
});
app.post("/api/hope/award", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const type = String(body.type || "");
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  const map: Record<string, number> = {
    profile_update: 5,
    profile_complete: 10,
    event_attend: 15,
    counseling: 15,
    rural_help: 20,
    engagement: 50
  };
  const delta = map[type] || 0;
  if (!delta) return c.json({ error: "Unknown award type" }, 400);
  await adjustHopePoints(c, profileId, delta);
  return c.json({ success: true }, 200);
});
app.post("/api/hope/redeem", authMiddleware, async (c) => {
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  const reward = String(body.reward || "");
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  const p = await getProfile(c, profileId);
  if (!p) return c.json({ error: "Profile not found" }, 404);
  const pts = p.hope_points || 0;
  if (p.hope_points_expiry && p.hope_points_expiry < new Date().toISOString().slice(0,10)) {
    await c.env.DB.prepare("UPDATE profiles SET hope_points = 0, hope_points_expiry = NULL WHERE id = ?").bind(profileId).run();
    return c.json({ error: "Points expired" }, 400);
  }
  if (reward === "contact_unlock" && pts >= 50) {
    await c.env.DB.prepare("UPDATE profiles SET hope_points = hope_points - 50, contact_unlocks = contact_unlocks + 1 WHERE id = ?").bind(profileId).run();
    return c.json({ success: true }, 200);
  }
  if (reward === "visibility_boost" && pts >= 100) {
    await c.env.DB.prepare("UPDATE profiles SET hope_points = hope_points - 100, visibility_boost_expiry = ? WHERE id = ?").bind(nowPlusDays(7), profileId).run();
    return c.json({ success: true }, 200);
  }
  if (reward === "mini_premium" && pts >= 200) {
    await c.env.DB.prepare("UPDATE profiles SET hope_points = hope_points - 200 WHERE id = ?").bind(profileId).run();
    await grantPremium(c, profileId, 1, "hope_points");
    return c.json({ success: true }, 200);
  }
  return c.json({ error: "Insufficient points" }, 400);
});
app.post("/api/admin/vendors", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "vendor:*");
  if (guard) return guard;
  const body = await c.req.json();
  const vendorId = String(body.vendor_id || "");
  const vendorType = String(body.vendor_type || "");
  const district = String(body.district || "");
  const state = String(body.state || "");
  const commission = Number(body.commission_rate || 10);
  if (!vendorId || !vendorType) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT INTO vendors (vendor_id, vendor_type, district, state, commission_rate) VALUES (?, ?, ?, ?, ?)").bind(vendorId, vendorType, district, state, commission).run();
  await logAudit(c, "create_vendor", "vendor", vendorId, { vendorType, district, state });
  return c.json({ success: true }, 200);
});
app.get("/api/admin/vendors", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "vendor:*");
  if (guard) return guard;
  const res = await c.env.DB.prepare("SELECT * FROM vendors ORDER BY created_at DESC").all();
  return c.json(res.results || []);
});
app.post("/api/admin/vendors/:id/verify", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "vendor:*", true);
  if (guard) return guard;
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await c.env.DB.prepare("UPDATE vendors SET verified_status = 'verified', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  await logAudit(c, "verify_vendor", "vendor", String(id));
  return c.json({ success: true }, 200);
});
app.post("/api/admin/vendor-bookings", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "vendor:*");
  if (guard) return guard;
  const body = await c.req.json();
  const vendorId = Number(body.vendor_id);
  const profileId = Number(body.profile_id || 0);
  const amount = Number(body.amount || 0);
  if (!vendorId || amount <= 0) return c.json({ error: "Invalid input" }, 400);
  const v = await c.env.DB.prepare("SELECT commission_rate FROM vendors WHERE id = ?").bind(vendorId).all();
  const rate = v.results?.[0]?.commission_rate || 10;
  const commission = Math.floor((amount * rate) / 100);
  await c.env.DB.prepare("INSERT INTO vendor_bookings (vendor_id, profile_id, booking_status, amount, commission_earned) VALUES (?, ?, 'completed', ?, ?)").bind(vendorId, profileId || null, amount, commission).run();
  await c.env.DB.prepare("INSERT INTO payments (profile_id, amount, plan, status, category, method) VALUES (?, ?, 'marketplace', 'paid', 'marketplace_commission', 'internal')").bind(profileId || null, commission).run();
  await logAudit(c, "vendor_booking", "vendor", String(vendorId), { profileId, amount, commission });
  return c.json({ success: true }, 200);
});
app.get("/api/admin/referrals/stats", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "premium:*");
  if (guard) return guard;
  const top = await c.env.DB.prepare("SELECT id, full_name, verified_referral_count FROM profiles ORDER BY verified_referral_count DESC LIMIT 10").all();
  const pending = await c.env.DB.prepare("SELECT id, full_name, referral_count, verified_referral_count FROM profiles WHERE referral_count >= 5 AND verified_referral_count >= 3 AND premium_status = 0 ORDER BY verified_referral_count DESC").all();
  return c.json({ top_referrers: top.results || [], pending_unlocks: pending.results || [] });
});
app.post("/api/admin/referrals/grant", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "premium:*", true);
  if (guard) return guard;
  const body = await c.req.json();
  const profileId = Number(body.profile_id);
  if (!profileId) return c.json({ error: "Invalid input" }, 400);
  await grantPremium(c, profileId, 3, "referrals_admin");
  return c.json({ success: true }, 200);
});
app.get("/api/admin/revenue/summary", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "finance:view");
  if (guard) return guard;
  const byCat = await c.env.DB.prepare("SELECT category, SUM(amount) AS total FROM payments WHERE status = 'paid' GROUP BY category").all();
  const byMethod = await c.env.DB.prepare("SELECT method, SUM(amount) AS total FROM payments WHERE status = 'paid' GROUP BY method").all();
  const trust = await c.env.DB.prepare("SELECT (trust_score/10)*10 AS bucket, COUNT(*) AS cnt FROM profiles GROUP BY bucket").all();
  const risk = await c.env.DB.prepare("SELECT COUNT(*) AS alerts FROM profiles WHERE risk_score >= 70").all();
  const succ = await c.env.DB.prepare("SELECT SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) AS approved, COUNT(*) AS total FROM successes").all();
  const commissions = await c.env.DB.prepare("SELECT SUM(commission_earned) AS total FROM vendor_bookings").all();
  const topTrusted = await c.env.DB.prepare("SELECT id, full_name, trust_score FROM profiles ORDER BY trust_score DESC LIMIT 10").all();
  const lowTrusted = await c.env.DB.prepare("SELECT COUNT(*) AS low FROM profiles WHERE trust_score < 30").all();
  return c.json({
    by_category: byCat.results || [],
    by_method: byMethod.results || [],
    trust_distribution: trust.results || [],
    risk_alerts: risk.results?.[0]?.alerts ?? 0,
    success_rate: succ.results && succ.results[0] ? ((succ.results[0].approved || 0) / Math.max(1, succ.results[0].total || 1)) : 0,
    marketplace_commission: commissions.results?.[0]?.total || 0,
    top_trusted: topTrusted.results || [],
    low_trust_profiles: lowTrusted.results?.[0]?.low || 0,
  });
});
app.get("/api/admin/analytics", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "analytics:view");
  if (guard) return guard;
  const dau = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM profiles WHERE DATE(updated_at) = DATE('now')").all();
  const newRegs = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM profiles WHERE DATE(created_at) = DATE('now')").all();
  const ver = await c.env.DB.prepare("SELECT verification_level, COUNT(*) AS cnt FROM profiles GROUP BY verification_level").all();
  const revenue = await c.env.DB.prepare("SELECT SUM(amount) AS total FROM payments WHERE status='paid'").all();
  const fraudAlerts = await c.env.DB.prepare("SELECT COUNT(*) AS alerts FROM profiles WHERE risk_score >= 70").all();
  const trust = await c.env.DB.prepare("SELECT (trust_score/10)*10 AS bucket, COUNT(*) AS cnt FROM profiles GROUP BY bucket").all();
  const coordPerf = await c.env.DB.prepare("SELECT coordinator_id, COUNT(*) AS verified FROM profiles WHERE rural_verified=1 GROUP BY coordinator_id ORDER BY verified DESC LIMIT 10").all();
  const success = await c.env.DB.prepare("SELECT SUM(CASE WHEN success_status='engaged' THEN 1 ELSE 0 END) AS engaged, SUM(CASE WHEN success_status='married' THEN 1 ELSE 0 END) AS married FROM profiles").all();
  return c.json({
    dau: dau.results?.[0]?.n || 0,
    new_registrations: newRegs.results?.[0]?.n || 0,
    verification_distribution: ver.results || [],
    revenue_total: revenue.results?.[0]?.total || 0,
    fraud_alerts: fraudAlerts.results?.[0]?.alerts || 0,
    trust_distribution: trust.results || [],
    coordinator_performance: coordPerf.results || [],
    success: success.results?.[0] || { engaged: 0, married: 0 }
  });
});
app.post("/api/admin/rbac/upsert_user", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "rbac:edit", true);
  if (guard) return guard;
  const body = await c.req.json();
  const email = String(body.email || "");
  const role = String(body.role || "");
  const perms = body.permissions_json ? JSON.stringify(body.permissions_json) : null;
  if (!email || !role) return c.json({ error: "Invalid input" }, 400);
  const userId = body.user_id ? String(body.user_id) : email;
  await c.env.DB.prepare("INSERT INTO admins (user_id, email, role, permissions_json) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET role=excluded.role, permissions_json=excluded.permissions_json, updated_at=CURRENT_TIMESTAMP").bind(userId, email, role, perms).run();
  await logAudit(c, "rbac_upsert", "admin", email, { role });
  return c.json({ success: true }, 200);
});
app.get("/api/admin/rbac/users", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "rbac:*");
  if (guard) return guard;
  const res = await c.env.DB.prepare("SELECT id, email, role, last_login_ip, last_login_device, account_status, created_at FROM admins ORDER BY created_at DESC").all();
  return c.json(res.results || []);
});
app.post("/api/reviews/submit", authMiddleware, async (c) => {
  const body = await c.req.json();
  const itemType = String(body.item_type || "");
  const itemId = String(body.item_id || "");
  const submittedData = body.submitted_data ? JSON.stringify(body.submitted_data) : "{}";
  const documents = body.documents ? JSON.stringify(body.documents) : "[]";
  const riskScore = Number(body.risk_score || 0);
  const prevFlags = body.previous_flags ? JSON.stringify(body.previous_flags) : "[]";
  const notes = body.internal_notes ? String(body.internal_notes) : "";
  if (!itemType || !itemId) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT INTO reviews (item_type, item_id, submitted_by, submitted_data, documents, risk_score, previous_flags, internal_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(itemType, itemId, c.get("user")?.id || "", submittedData, documents, riskScore, prevFlags, notes).run();
  return c.json({ success: true }, 200);
});
app.get("/api/admin/reviews", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "reviews:view");
  if (guard) return guard;
  const status = c.req.query("status") || "pending";
  const res = await c.env.DB.prepare("SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC").bind(status).all();
  return c.json(res.results || []);
});
async function reviewDecision(c: any, id: number, status: string, escalate = false) {
  await c.env.DB.prepare("UPDATE reviews SET status = ?, reviewed_by = ?, review_timestamp = CURRENT_TIMESTAMP, escalation_level = escalation_level + ? WHERE id = ?").bind(status, c.get("user")?.id || "", escalate ? 1 : 0, id).run();
  await logAudit(c, `review_${status}`, "review", String(id));
}
app.post("/api/admin/reviews/:id/approve", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "reviews:*", true);
  if (guard) return guard;
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await reviewDecision(c, id, "approved");
  return c.json({ success: true }, 200);
});
app.post("/api/admin/reviews/:id/reject", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "reviews:*", true);
  if (guard) return guard;
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await reviewDecision(c, id, "rejected");
  return c.json({ success: true }, 200);
});
app.post("/api/admin/reviews/:id/escalate", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "reviews:*");
  if (guard) return guard;
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await reviewDecision(c, id, "escalated", true);
  return c.json({ success: true }, 200);
});
app.post("/api/admin/cms/content", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "cms:*");
  if (guard) return guard;
  const body = await c.req.json();
  const ct = String(body.content_type || "");
  const title = String(body.title || "");
  const content = String(body.body || "");
  const lang = String(body.language_code || "en");
  const seoTitle = body.seo_title ? String(body.seo_title) : null;
  const seoDesc = body.seo_description ? String(body.seo_description) : null;
  const seoKw = body.seo_keywords ? String(body.seo_keywords) : null;
  const pid = body.parent_id ? Number(body.parent_id) : null;
  if (!ct) return c.json({ error: "Invalid input" }, 400);
  await c.env.DB.prepare("INSERT INTO cms_contents (content_type, title, body, language_code, seo_title, seo_description, seo_keywords, author_user_id, parent_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(ct, title, content, lang, seoTitle, seoDesc, seoKw, c.get("user")?.id || "", pid).run();
  return c.json({ success: true }, 200);
});
app.get("/api/admin/cms/list", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "cms:view");
  if (guard) return guard;
  const type = c.req.query("type") || "";
  const res = await c.env.DB.prepare(type ? "SELECT * FROM cms_contents WHERE content_type = ? ORDER BY updated_at DESC" : "SELECT * FROM cms_contents ORDER BY updated_at DESC").bind(type || undefined).all();
  return c.json(res.results || []);
});
app.post("/api/admin/cms/:id/publish", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "cms:*", true);
  if (guard) return guard;
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  await c.env.DB.prepare("UPDATE cms_contents SET publish_status = 'published', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
  await logAudit(c, "cms_publish", "cms", String(id));
  return c.json({ success: true }, 200);
});
app.post("/api/admin/cms/:id/rollback", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "cms:*", true);
  if (guard) return guard;
  const id = Number(c.req.param("id"));
  if (!id) return c.json({ error: "Invalid id" }, 400);
  const cur = await c.env.DB.prepare("SELECT * FROM cms_contents WHERE id = ?").bind(id).all();
  const row = cur.results?.[0];
  if (!row) return c.json({ error: "Not found" }, 404);
  await c.env.DB.prepare("INSERT INTO cms_contents (content_type, title, body, version_number, publish_status, language_code, seo_title, seo_description, seo_keywords, author_user_id, parent_id) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)").bind(row.content_type, row.title, row.body, (row.version_number || 1) + 1, row.language_code, row.seo_title, row.seo_description, row.seo_keywords, c.get("user")?.id || "", row.parent_id || row.id).run();
  await logAudit(c, "cms_rollback", "cms", String(id));
  return c.json({ success: true }, 200);
});
app.post("/api/admin/themes", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "themes:*");
  if (guard) return guard;
  const body = await c.req.json();
  const themeId = String(body.theme_id || "");
  if (!themeId) return c.json({ error: "Invalid input" }, 400);
  const fields = ["primary_color","secondary_color","accent_color","background_color","card_color","button_color","text_color","border_color","error_color","success_color","theme_mode","region_override","festival_override"];
  const values = fields.map((k) => body[k] ?? null);
  await c.env.DB.prepare(`INSERT INTO themes (theme_id, ${fields.join(",")}) VALUES (?, ${fields.map(()=>" ?").join(",")}) ON CONFLICT(theme_id) DO UPDATE SET ${fields.map((k)=>`${k}=excluded.${k}`).join(",")}, updated_at=CURRENT_TIMESTAMP`).bind(themeId, ...values).run();
  await logAudit(c, "theme_upsert", "theme", themeId);
  return c.json({ success: true }, 200);
});
app.post("/api/admin/themes/:id/set-global", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "themes:*", true);
  if (guard) return guard;
  const id = c.req.param("id");
  await c.env.DB.prepare("UPDATE themes SET is_global_default = 0").run();
  await c.env.DB.prepare("UPDATE themes SET is_global_default = 1 WHERE theme_id = ?").bind(id).run();
  await logAudit(c, "theme_set_global", "theme", id);
  return c.json({ success: true }, 200);
});
app.get("/api/themes/current", authMiddleware, async (c) => {
  const user = c.get("user");
  const row = await c.env.DB.prepare("SELECT * FROM user_themes WHERE user_id = ?").bind(user.id).all();
  const ut = row.results?.[0];
  let th = await c.env.DB.prepare("SELECT * FROM themes WHERE is_global_default = 1").all();
  let theme = th.results?.[0] || null;
  if (ut?.theme_id) {
    const t2 = await c.env.DB.prepare("SELECT * FROM themes WHERE theme_id = ?").bind(ut.theme_id).all();
    theme = t2.results?.[0] || theme;
  }
  return c.json({ theme, user: { dark_mode: ut?.dark_mode || 0, custom: ut?.custom_user_theme || null } });
});
app.post("/api/themes/me", authMiddleware, async (c) => {
  const body = await c.req.json();
  const user = c.get("user");
  const themeId = body.theme_id ? String(body.theme_id) : null;
  const custom = body.custom_user_theme ? JSON.stringify(body.custom_user_theme) : null;
  const dark = body.dark_mode ? 1 : 0;
  await c.env.DB.prepare("INSERT INTO user_themes (user_id, theme_id, custom_user_theme, dark_mode) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET theme_id=excluded.theme_id, custom_user_theme=excluded.custom_user_theme, dark_mode=excluded.dark_mode, updated_at=CURRENT_TIMESTAMP").bind(user.id, themeId, custom, dark).run();
  await logAudit(c, "user_theme_set", "user", user.id, { themeId, dark });
  return c.json({ success: true }, 200);
});
app.get("/api/admin/settings", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "settings:*");
  if (guard) return guard;
  const res = await c.env.DB.prepare("SELECT key, value FROM settings").all();
  return c.json(res.results || []);
});
app.post("/api/admin/settings", authMiddleware, async (c) => {
  const guard = await checkPermission(c, "settings:*", true);
  if (guard) return guard;
  const body = await c.req.json();
  for (const k of Object.keys(body)) {
    await c.env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP").bind(k, typeof body[k] === "string" ? body[k] : JSON.stringify(body[k])).run();
  }
  await logAudit(c, "settings_update", "settings", "*");
  return c.json({ success: true }, 200);
});
export default app;
