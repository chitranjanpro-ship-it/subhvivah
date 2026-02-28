CREATE TABLE premium_grants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  months INTEGER NOT NULL,
  starts_at DATE NOT NULL,
  expires_at DATE NOT NULL,
  revoked INTEGER DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_premium_grants_profile ON premium_grants(profile_id);
