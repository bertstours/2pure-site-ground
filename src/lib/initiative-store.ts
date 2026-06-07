// Supabase-backed CRUD for the admin panel.
// RLS on the database enforces that only the superadmin role
// (babar.by@gmail.com) can write. Public read is allowed.

import { supabase } from "@/integrations/supabase/client";

export type Region = "Europe" | "North America" | "MENA" | "Asia" | "Oceania";

export interface StoredPartner {
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
}

export interface StoredOpportunity {
  id: string;
  title: string;
  region: string;
  partner_short_names: string[];
  status: string;
  relevance: string;
  occurred_on: string;
  detail: string | null;
  link: string | null;
}

export interface InitiativeMedia {
  opportunity_id: string;
  cover_image_url: string | null;
  youtube_url: string | null;
  blog_url: string | null;
  reading_text: string | null;
}

export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ── Partners ──────────────────────────────────────────────
export async function upsertPartner(p: StoredPartner): Promise<void> {
  const { error } = await supabase.from("partners" as never).upsert(p as never);
  if (error) throw error;
}
export async function deletePartner(id: string): Promise<void> {
  const { error } = await supabase.from("partners" as never).delete().eq("id", id);
  if (error) throw error;
}

// ── Opportunities ─────────────────────────────────────────
export async function upsertOpportunity(o: StoredOpportunity): Promise<void> {
  const { error } = await supabase.from("opportunities" as never).upsert(o as never);
  if (error) throw error;
}
export async function deleteOpportunity(id: string): Promise<void> {
  // initiative_media cascades on delete (FK)
  const { error } = await supabase.from("opportunities" as never).delete().eq("id", id);
  if (error) throw error;
}

// ── Initiative media ──────────────────────────────────────
export async function upsertInitiativeMedia(m: InitiativeMedia): Promise<void> {
  const { error } = await supabase
    .from("initiative_media" as never)
    .upsert(m as never, { onConflict: "opportunity_id" } as never);
  if (error) throw error;
}
