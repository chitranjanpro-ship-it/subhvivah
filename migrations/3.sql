
CREATE TABLE saved_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  profile_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_profiles_user ON saved_profiles(user_id);
CREATE UNIQUE INDEX idx_saved_profiles_unique ON saved_profiles(user_id, profile_id);
