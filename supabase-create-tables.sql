-- Create the partners table with all necessary columns
CREATE TABLE IF NOT EXISTS partners (
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

-- Create index on tier and sort_order for efficient querying
CREATE INDEX IF NOT EXISTS partners_tier_sort_idx ON partners(tier, sort_order);

-- Create index on region for filtering
CREATE INDEX IF NOT EXISTS partners_region_idx ON partners(region);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Anyone can read
CREATE POLICY "Enable read access for all users" ON partners
  FOR SELECT USING (TRUE);

-- Create RLS policy: Only superadmin (babar.by@gmail.com) can insert/update/delete
-- Note: You'll need to set up proper auth first, for now we'll allow all inserts
CREATE POLICY "Enable insert for all users" ON partners
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable update for all users" ON partners
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable delete for all users" ON partners
  FOR DELETE USING (TRUE);

-- Create the opportunities table (for initiatives)
CREATE TABLE IF NOT EXISTS opportunities (
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

-- Create index on region and status
CREATE INDEX IF NOT EXISTS opportunities_region_status_idx ON opportunities(region, status);

-- Enable Row Level Security on opportunities
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- RLS policies for opportunities
CREATE POLICY "Enable read access for all users" ON opportunities
  FOR SELECT USING (TRUE);

CREATE POLICY "Enable insert for all users" ON opportunities
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable update for all users" ON opportunities
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable delete for all users" ON opportunities
  FOR DELETE USING (TRUE);

-- Create the initiative_media table
CREATE TABLE IF NOT EXISTS initiative_media (
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

-- RLS policies for initiative_media
CREATE POLICY "Enable read access for all users" ON initiative_media
  FOR SELECT USING (TRUE);

CREATE POLICY "Enable insert for all users" ON initiative_media
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable update for all users" ON initiative_media
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable delete for all users" ON initiative_media
  FOR DELETE USING (TRUE);

-- Create the themes table
CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  focus TEXT,
  associated_partner_short_names TEXT[] DEFAULT ARRAY[]::TEXT[],
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security on themes
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- RLS policies for themes
CREATE POLICY "Enable read access for all users" ON themes
  FOR SELECT USING (TRUE);

CREATE POLICY "Enable insert for all users" ON themes
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable update for all users" ON themes
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable delete for all users" ON themes
  FOR DELETE USING (TRUE);

-- Create the metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  label TEXT NOT NULL,
  value INTEGER,
  unit TEXT,
  caption TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security on metrics
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for metrics
CREATE POLICY "Enable read access for all users" ON metrics
  FOR SELECT USING (TRUE);

CREATE POLICY "Enable insert for all users" ON metrics
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Enable update for all users" ON metrics
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Enable delete for all users" ON metrics
  FOR DELETE USING (TRUE);

-- Verify tables were created
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
