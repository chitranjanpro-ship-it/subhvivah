ALTER TABLE profiles ADD COLUMN coordinator_id INTEGER;
ALTER TABLE profiles ADD COLUMN assisted_mode INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN whatsapp_otp_verified INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN rural_verified INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN voice_bio_url TEXT;
ALTER TABLE profiles ADD COLUMN hindi_first INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN low_bandwidth INTEGER DEFAULT 0;
CREATE INDEX idx_profiles_coordinator ON profiles(coordinator_id);
