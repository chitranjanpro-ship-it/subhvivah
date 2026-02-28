CREATE TABLE cms_contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  title TEXT,
  body TEXT,
  version_number INTEGER DEFAULT 1,
  publish_status TEXT DEFAULT 'draft',
  scheduled_publish_date DATE,
  language_code TEXT DEFAULT 'en',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  author_user_id TEXT,
  parent_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cms_type_status ON cms_contents(content_type, publish_status);
