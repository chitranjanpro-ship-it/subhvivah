DROP INDEX idx_payments_category;
DROP INDEX idx_payments_method;
DROP INDEX idx_payments_coordinator;
ALTER TABLE payments DROP COLUMN category;
ALTER TABLE payments DROP COLUMN method;
ALTER TABLE payments DROP COLUMN upi_vpa;
ALTER TABLE payments DROP COLUMN coordinator_id;
ALTER TABLE payments DROP COLUMN commission_amount;
ALTER TABLE payments DROP COLUMN vendor_id;
