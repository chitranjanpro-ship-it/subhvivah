CREATE TABLE referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_profile_id INTEGER NOT NULL,
  referred_profile_id INTEGER NOT NULL,
  status TEXT DEFAULT 'initiated',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_referrals_unique ON referrals(referrer_profile_id, referred_profile_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_profile_id);
