DROP INDEX idx_profiles_success_status;
ALTER TABLE profiles DROP COLUMN hope_points;
ALTER TABLE profiles DROP COLUMN hope_points_expiry;
ALTER TABLE profiles DROP COLUMN contact_unlocks;
ALTER TABLE profiles DROP COLUMN visibility_boost_expiry;
ALTER TABLE profiles DROP COLUMN success_status;
ALTER TABLE profiles DROP COLUMN engagement_date;
ALTER TABLE profiles DROP COLUMN marriage_date;
ALTER TABLE profiles DROP COLUMN referred_by_user_id;
