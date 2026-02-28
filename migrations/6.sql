CREATE TABLE moderation_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  source TEXT NOT NULL,
  type TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  risk_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_moderation_profile ON moderation_queue(profile_id);
CREATE INDEX idx_moderation_status ON moderation_queue(status);
