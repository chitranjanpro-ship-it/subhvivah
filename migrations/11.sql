CREATE TABLE contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  helper_profile_id INTEGER NOT NULL,
  target_profile_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_contributions_helper ON contributions(helper_profile_id);
CREATE INDEX idx_contributions_status ON contributions(status);
