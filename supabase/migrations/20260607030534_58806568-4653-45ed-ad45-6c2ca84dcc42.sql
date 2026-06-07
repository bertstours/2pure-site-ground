
-- Roles
CREATE TYPE public.app_role AS ENUM ('superadmin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-grant superadmin to babar.by@gmail.com on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'babar.by@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'superadmin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Partners
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_name TEXT,
  country TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT 'Europe',
  category TEXT NOT NULL DEFAULT '',
  themes TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  strategic_relevance TEXT NOT NULL DEFAULT '',
  initiatives TEXT[] NOT NULL DEFAULT '{}',
  tier INT NOT NULL DEFAULT 2,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Superadmin write partners" ON public.partners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin')) WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Opportunities
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  region TEXT NOT NULL DEFAULT 'Europe',
  partner_short_names TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  relevance TEXT NOT NULL DEFAULT '',
  occurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
  detail TEXT,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Superadmin write opportunities" ON public.opportunities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin')) WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER opportunities_updated BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Themes
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  focus TEXT NOT NULL DEFAULT '',
  associated_partner_short_names TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.themes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.themes TO authenticated;
GRANT ALL ON public.themes TO service_role;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read themes" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Superadmin write themes" ON public.themes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin')) WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER themes_updated BEFORE UPDATE ON public.themes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Metrics
CREATE TABLE public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.metrics TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.metrics TO authenticated;
GRANT ALL ON public.metrics TO service_role;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read metrics" ON public.metrics FOR SELECT USING (true);
CREATE POLICY "Superadmin write metrics" ON public.metrics FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin')) WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER metrics_updated BEFORE UPDATE ON public.metrics FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Initiative media (linked to opportunities)
CREATE TABLE public.initiative_media (
  opportunity_id UUID PRIMARY KEY REFERENCES public.opportunities(id) ON DELETE CASCADE,
  cover_image_url TEXT,
  youtube_url TEXT,
  blog_url TEXT,
  reading_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.initiative_media TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.initiative_media TO authenticated;
GRANT ALL ON public.initiative_media TO service_role;
ALTER TABLE public.initiative_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON public.initiative_media FOR SELECT USING (true);
CREATE POLICY "Superadmin write media" ON public.initiative_media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin')) WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
CREATE TRIGGER media_updated BEFORE UPDATE ON public.initiative_media FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage RLS policies (buckets created via tool)
CREATE POLICY "Public read partner-logos" ON storage.objects FOR SELECT USING (bucket_id = 'partner-logos');
CREATE POLICY "Superadmin write partner-logos" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (bucket_id = 'partner-logos' AND public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Public read initiative-media" ON storage.objects FOR SELECT USING (bucket_id = 'initiative-media');
CREATE POLICY "Superadmin write initiative-media" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'initiative-media' AND public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (bucket_id = 'initiative-media' AND public.has_role(auth.uid(), 'superadmin'));
