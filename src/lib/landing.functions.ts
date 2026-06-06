import { createServerFn } from "@tanstack/react-start";

export type Partner = {
  id: string;
  name: string;
  short_name: string | null;
  country: string;
  region: string;
  category: string;
  themes: string[];
  logo_url: string | null;
  strategic_relevance: string;
  initiatives: string[];
  tier: number;
  sort_order: number;
};

export type Theme = {
  id: string;
  slug: string;
  title: string;
  focus: string;
  associated_partner_short_names: string[];
  sort_order: number;
};

export type Metric = {
  id: string;
  slug: string;
  label: string;
  value: number;
  unit: string | null;
  caption: string | null;
  sort_order: number;
};

export type Opportunity = {
  id: string;
  title: string;
  region: string;
  partner_short_names: string[];
  status: string;
  relevance: string;
  occurred_on: string;
  detail: string | null;
  link: string | null;
};

export type InitiativeMediaRow = {
  opportunity_id: string;
  cover_image_url: string | null;
  youtube_url: string | null;
  blog_url: string | null;
  reading_text: string | null;
};

export const getLandingData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    partners: Partner[];
    themes: Theme[];
    metrics: Metric[];
    opportunities: Opportunity[];
    media: InitiativeMediaRow[];
  }> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const [partnersR, themesR, metricsR, oppsR, mediaR] = await Promise.all([
      supabase.from("partners" as never).select("*").order("sort_order"),
      supabase.from("themes" as never).select("*").order("sort_order"),
      supabase.from("metrics" as never).select("*").order("sort_order"),
      supabase.from("opportunities" as never).select("*").order("occurred_on", { ascending: false }),
      supabase.from("initiative_media" as never).select("*"),
    ]);

    if (partnersR.error) console.error("partners error:", partnersR.error);
    if (themesR.error) console.error("themes error:", themesR.error);
    if (metricsR.error) console.error("metrics error:", metricsR.error);
    if (oppsR.error) console.error("opportunities error:", oppsR.error);
    if (mediaR.error) console.error("initiative_media error:", mediaR.error);

    return {
      partners: (partnersR.data ?? []) as Partner[],
      themes: (themesR.data ?? []) as Theme[],
      metrics: (metricsR.data ?? []) as Metric[],
      opportunities: (oppsR.data ?? []) as Opportunity[],
      media: (mediaR.data ?? []) as InitiativeMediaRow[],
    };
  },
);
