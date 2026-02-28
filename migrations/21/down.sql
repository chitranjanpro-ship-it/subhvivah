DROP INDEX idx_admins_role;
DROP TABLE admins;
ALTER TABLE profiles DROP COLUMN shadow_restricted;
ALTER TABLE profiles DROP COLUMN suspend_until;
ALTER TABLE profiles DROP COLUMN monitored;
ALTER TABLE profiles DROP COLUMN created_at;
ALTER TABLE profiles DROP COLUMN updated_at;
