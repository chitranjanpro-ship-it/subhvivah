CREATE TABLE successes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile1_id INTEGER NOT NULL,
  profile2_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  granted_months INTEGER DEFAULT 6,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_successes_status ON successes(status);
