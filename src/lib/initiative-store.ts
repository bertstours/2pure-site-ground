// src/lib/initiative-store.ts

export interface InitiativeMedia {
  id: string;
  cover_image_url: string | null;
  youtube_url: string | null;
  blog_url: string | null;
  reading_text: string | null;
}

const INITIATIVE_KEY = "csrit_initiative_media";
const PARTNER_LOGO_KEY = "csrit_partner_logos";

export function getAllInitiativeMedia(): InitiativeMedia[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INITIATIVE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getInitiativeMedia(id: string): InitiativeMedia | null {
  return getAllInitiativeMedia().find((m) => m.id === id) ?? null;
}

export function saveInitiativeMedia(media: InitiativeMedia): void {
  if (typeof window === "undefined") return;
  const all = getAllInitiativeMedia();
  const idx = all.findIndex((m) => m.id === media.id);
  if (idx >= 0) all[idx] = media;
  else all.push(media);
  localStorage.setItem(INITIATIVE_KEY, JSON.stringify(all));
}

export function getPartnerLogos(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PARTNER_LOGO_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePartnerLogo(partnerId: string, dataUrl: string): void {
  if (typeof window === "undefined") return;
  const logos = getPartnerLogos();
  logos[partnerId] = dataUrl;
  localStorage.setItem(PARTNER_LOGO_KEY, JSON.stringify(logos));
}

/** Extract YouTube embed URL from any YouTube link format */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

/* ─── Custom Opportunities (full CRUD, localStorage) ─── */

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

const CUSTOM_OPPS_KEY = "csrit_custom_opportunities";

export function getCustomOpportunities(): StoredOpportunity[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CUSTOM_OPPS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCustomOpportunities(opps: StoredOpportunity[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_OPPS_KEY, JSON.stringify(opps));
}

/* ─── Custom Partners (full CRUD, localStorage) ─── */

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

const CUSTOM_PARTNERS_KEY = "csrit_custom_partners";

export function getCustomPartners(): StoredPartner[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CUSTOM_PARTNERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCustomPartners(partners: StoredPartner[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_PARTNERS_KEY, JSON.stringify(partners));
}
