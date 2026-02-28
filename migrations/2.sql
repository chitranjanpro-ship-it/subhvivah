
CREATE TABLE interests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_profile_id INTEGER NOT NULL,
  to_profile_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interests_from_profile ON interests(from_profile_id);
CREATE INDEX idx_interests_to_profile ON interests(to_profile_id);
CREATE UNIQUE INDEX idx_interests_unique ON interests(from_profile_id, to_profile_id);
