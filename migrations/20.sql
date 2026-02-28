CREATE TABLE vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id TEXT NOT NULL UNIQUE,
  vendor_type TEXT NOT NULL,
  district TEXT,
  state TEXT,
  commission_rate INTEGER DEFAULT 10,
  verified_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE vendor_bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id INTEGER NOT NULL,
  profile_id INTEGER,
  booking_status TEXT DEFAULT 'pending',
  amount INTEGER NOT NULL,
  commission_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_vendors_type ON vendors(vendor_type);
CREATE INDEX idx_vendor_bookings_vendor ON vendor_bookings(vendor_id);
