CREATE TABLE coordinators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  coordinator_id TEXT NOT NULL UNIQUE,
  district TEXT,
  state TEXT,
  verified_status TEXT DEFAULT 'pending',
  commission_rate INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_coordinators_state ON coordinators(state);
CREATE INDEX idx_coordinators_district ON coordinators(district);
