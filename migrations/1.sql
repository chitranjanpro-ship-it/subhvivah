
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  community_id TEXT NOT NULL,
  
  -- Basic Info
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  birth_date DATE,
  height_cm INTEGER,
  marital_status TEXT,
  
  -- Location
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  
  -- Education & Career
  education TEXT,
  occupation TEXT,
  employer TEXT,
  annual_income TEXT,
  
  -- Family
  father_occupation TEXT,
  mother_occupation TEXT,
  siblings TEXT,
  family_type TEXT,
  family_values TEXT,
  
  -- Religion & Culture
  religion TEXT,
  caste TEXT,
  sub_caste TEXT,
  mother_tongue TEXT,
  gothra TEXT,
  manglik TEXT,
  
  -- Lifestyle
  diet TEXT,
  smoking TEXT,
  drinking TEXT,
  
  -- About
  about_me TEXT,
  partner_preferences TEXT,
  
  -- Photos
  photo_url TEXT,
  photo_urls TEXT,
  
  -- Status
  is_verified INTEGER DEFAULT 0,
  is_premium INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_community_id ON profiles(community_id);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
