CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  submitted_by TEXT,
  submitted_data TEXT,
  documents TEXT,
  risk_score INTEGER,
  previous_flags TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by TEXT,
  review_timestamp TIMESTAMP,
  escalation_level INTEGER DEFAULT 0,
  internal_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reviews_item ON reviews(item_type, item_id);
CREATE INDEX idx_reviews_status ON reviews(status);
