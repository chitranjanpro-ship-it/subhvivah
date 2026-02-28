ALTER TABLE payments ADD COLUMN category TEXT;
ALTER TABLE payments ADD COLUMN method TEXT;
ALTER TABLE payments ADD COLUMN upi_vpa TEXT;
ALTER TABLE payments ADD COLUMN coordinator_id INTEGER;
ALTER TABLE payments ADD COLUMN commission_amount INTEGER DEFAULT 0;
ALTER TABLE payments ADD COLUMN vendor_id TEXT;
CREATE INDEX idx_payments_category ON payments(category);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_coordinator ON payments(coordinator_id);
