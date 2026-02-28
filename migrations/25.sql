CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO settings (key, value) VALUES 
('registration_mode','open'),
('maintenance_mode','off'),
('emergency_lockdown','off'),
('premium_pricing','{\"basic\":999,\"pro\":1999}'),
('referral_thresholds','{\"min\":5,\"verified\":3}'),
('verification_fee','0'),
('features','{\"themes\":true,\"marketplace\":true,\"hope_points\":true}');
