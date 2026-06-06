// Tiny client-safe utility (no storage; everything lives in Supabase now).

export interface InitiativeMedia {
  opportunity_id: string;
  cover_image_url: string | null;
  youtube_url: string | null;
  blog_url: string | null;
  reading_text: string | null;
}

/** Extract YouTube embed URL from any YouTube link format */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
