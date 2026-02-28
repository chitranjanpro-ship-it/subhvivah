CREATE TABLE blocked_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blocker_user_id TEXT NOT NULL,
  profile_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_blocked_unique ON blocked_profiles(blocker_user_id, profile_id);
