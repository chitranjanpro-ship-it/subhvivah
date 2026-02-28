CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'paid',
  txn_ref TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payments_profile ON payments(profile_id);
