ALTER TABLE profiles ADD COLUMN hope_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN hope_points_expiry DATE;
ALTER TABLE profiles ADD COLUMN contact_unlocks INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN visibility_boost_expiry DATE;
ALTER TABLE profiles ADD COLUMN success_status TEXT DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN engagement_date DATE;
ALTER TABLE profiles ADD COLUMN marriage_date DATE;
ALTER TABLE profiles ADD COLUMN referred_by_user_id TEXT;
CREATE INDEX idx_profiles_success_status ON profiles(success_status);
