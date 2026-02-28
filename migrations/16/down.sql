DROP INDEX idx_profiles_coordinator;
ALTER TABLE profiles DROP COLUMN coordinator_id;
ALTER TABLE profiles DROP COLUMN assisted_mode;
ALTER TABLE profiles DROP COLUMN whatsapp_otp_verified;
ALTER TABLE profiles DROP COLUMN rural_verified;
ALTER TABLE profiles DROP COLUMN voice_bio_url;
ALTER TABLE profiles DROP COLUMN hindi_first;
ALTER TABLE profiles DROP COLUMN low_bandwidth;
