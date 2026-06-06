
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  country text NOT NULL,
  region text NOT NULL,
  category text NOT NULL,
  themes text[] NOT NULL DEFAULT '{}',
  logo_url text,
  strategic_relevance text NOT NULL,
  initiatives text[] NOT NULL DEFAULT '{}',
  tier int NOT NULL DEFAULT 2,
  sort_order int NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon, authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (true);

CREATE TABLE public.themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  focus text NOT NULL,
  associated_partner_short_names text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 100
);
GRANT SELECT ON public.themes TO anon, authenticated;
GRANT ALL ON public.themes TO service_role;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read themes" ON public.themes FOR SELECT USING (true);

CREATE TABLE public.metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  value int NOT NULL,
  unit text,
  caption text,
  sort_order int NOT NULL DEFAULT 100,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.metrics TO anon, authenticated;
GRANT ALL ON public.metrics TO service_role;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read metrics" ON public.metrics FOR SELECT USING (true);

CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  region text NOT NULL,
  partner_short_names text[] NOT NULL DEFAULT '{}',
  status text NOT NULL,
  relevance text NOT NULL,
  occurred_on date NOT NULL,
  detail text,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read opportunities" ON public.opportunities FOR SELECT USING (true);
