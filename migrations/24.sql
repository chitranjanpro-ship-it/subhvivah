CREATE TABLE themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme_id TEXT NOT NULL UNIQUE,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  background_color TEXT,
  card_color TEXT,
  button_color TEXT,
  text_color TEXT,
  border_color TEXT,
  error_color TEXT,
  success_color TEXT,
  theme_mode TEXT DEFAULT 'light',
  is_global_default INTEGER DEFAULT 0,
  region_override TEXT,
  festival_override TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_themes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  theme_id TEXT,
  custom_user_theme TEXT,
  dark_mode INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_themes_user ON user_themes(user_id);
