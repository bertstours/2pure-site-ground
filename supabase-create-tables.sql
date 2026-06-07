-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS initiative_media CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS metrics CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- Create the partners table with all necessary columns
CREATE TABLE partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  country TEXT,
  region TEXT,
  category TEXT,
  themes TEXT[] DEFAULT ARRAY[]::TEXT[],
  logo_url TEXT,
  strategic_relevance TEXT,
  initiatives TEXT[] DEFAULT ARRAY[]::TEXT[],
  tier INTEGER DEFAULT 2,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_partners_tier_sort ON partners(tier, sort_order);
CREATE INDEX idx_partners_region ON partners(region);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partners
CREATE POLICY "partners_public_read" ON partners FOR SELECT USING (true);
CREATE POLICY "partners_public_write" ON partners FOR INSERT WITH CHECK (true);
CREATE POLICY "partners_public_update" ON partners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "partners_public_delete" ON partners FOR DELETE USING (true);

-- Create the opportunities table (for initiatives)
CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  region TEXT,
  partner_short_names TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT DEFAULT 'active',
  relevance TEXT,
  occurred_on DATE,
  detail TEXT,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for opportunities
CREATE INDEX idx_opportunities_region_status ON opportunities(region, status);
CREATE INDEX idx_opportunities_occurred_on ON opportunities(occurred_on DESC);

-- Enable Row Level Security on opportunities
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for opportunities
CREATE POLICY "opportunities_public_read" ON opportunities FOR SELECT USING (true);
CREATE POLICY "opportunities_public_write" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "opportunities_public_update" ON opportunities FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "opportunities_public_delete" ON opportunities FOR DELETE USING (true);

-- Create the initiative_media table
CREATE TABLE initiative_media (
  opportunity_id TEXT PRIMARY KEY REFERENCES opportunities(id) ON DELETE CASCADE,
  cover_image_url TEXT,
  youtube_url TEXT,
  blog_url TEXT,
  reading_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security on initiative_media
ALTER TABLE initiative_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for initiative_media
CREATE POLICY "initiative_media_public_read" ON initiative_media FOR SELECT USING (true);
CREATE POLICY "initiative_media_public_write" ON initiative_media FOR INSERT WITH CHECK (true);
CREATE POLICY "initiative_media_public_update" ON initiative_media FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "initiative_media_public_delete" ON initiative_media FOR DELETE USING (true);

-- Create the themes table
CREATE TABLE themes (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  focus TEXT,
  associated_partner_short_names TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for themes
CREATE INDEX idx_themes_slug ON themes(slug);
CREATE INDEX idx_themes_sort_order ON themes(sort_order);

-- Enable Row Level Security on themes
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for themes
CREATE POLICY "themes_public_read" ON themes FOR SELECT USING (true);
CREATE POLICY "themes_public_write" ON themes FOR INSERT WITH CHECK (true);
CREATE POLICY "themes_public_update" ON themes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "themes_public_delete" ON themes FOR DELETE USING (true);

-- Create the metrics table
CREATE TABLE metrics (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  value INTEGER,
  unit TEXT,
  caption TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for metrics
CREATE INDEX idx_metrics_slug ON metrics(slug);
CREATE INDEX idx_metrics_sort_order ON metrics(sort_order);

-- Enable Row Level Security on metrics
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for metrics
CREATE POLICY "metrics_public_read" ON metrics FOR SELECT USING (true);
CREATE POLICY "metrics_public_write" ON metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "metrics_public_update" ON metrics FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "metrics_public_delete" ON metrics FOR DELETE USING (true);

-- Create the user_roles table for admin access control
CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "user_roles_public_read" ON user_roles FOR SELECT USING (true);
CREATE POLICY "user_roles_authenticated_write" ON user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "user_roles_authenticated_update" ON user_roles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "user_roles_authenticated_delete" ON user_roles FOR DELETE USING (true);

-- Verify all tables were created successfully
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
