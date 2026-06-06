// Temporary shim: full Supabase admin rewrite is in progress.
// Landing page reads from Supabase (live).
// Admin panel still writes to localStorage for now — next turn migrates it.

export interface InitiativeMedia {
  id: string;
  cover_image_url: string | null;
  youtube_url: string | null;
  blog_url: string | null;
  reading_text: string | null;
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

const INITIATIVE_KEY = "csrit_initiative_media";
const PARTNER_LOGO_KEY = "csrit_partner_logos";
const CUSTOM_OPPS_KEY = "csrit_custom_opportunities";
const CUSTOM_PARTNERS_KEY = "csrit_custom_partners";

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(k: string, v: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
}

export function getAllInitiativeMedia(): InitiativeMedia[] {
  return read<InitiativeMedia[]>(INITIATIVE_KEY, []);
}
export function saveInitiativeMedia(media: InitiativeMedia): void {
  const all = getAllInitiativeMedia();
  const idx = all.findIndex((m) => m.id === media.id);
  if (idx >= 0) all[idx] = media;
  else all.push(media);
  write(INITIATIVE_KEY, all);
}
export function getPartnerLogos(): Record<string, string> {
  return read<Record<string, string>>(PARTNER_LOGO_KEY, {});
}
export function savePartnerLogo(id: string, dataUrl: string): void {
  const logos = getPartnerLogos();
  logos[id] = dataUrl;
  write(PARTNER_LOGO_KEY, logos);
}
export function getCustomOpportunities(): StoredOpportunity[] | null {
  return read<StoredOpportunity[] | null>(CUSTOM_OPPS_KEY, null);
}
export function saveCustomOpportunities(o: StoredOpportunity[]): void {
  write(CUSTOM_OPPS_KEY, o);
}
export function getCustomPartners(): StoredPartner[] | null {
  return read<StoredPartner[] | null>(CUSTOM_PARTNERS_KEY, null);
}
export function saveCustomPartners(p: StoredPartner[]): void {
  write(CUSTOM_PARTNERS_KEY, p);
}

export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
