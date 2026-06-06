
## Scope

A clean rebuild of the landing structure. Page order from top:

1. Header (new logo + gold "Chief Scientist for Research, Innovation and Technology" wordmark)
2. Hero — Executive Identity + Global Network visualization
3. Strategic Impact Dashboard (live metrics)
4. Six Strategic Themes
5. Chief Scientist's Message (text only, no photo)
6. Flywheel section (kept)
7. Current Strategic Opportunities (live feed)
8. Cyprus Global Innovation Network (interactive world map)
9. Footer

Removed: "The numbers behind the bridge" section (kept in a `_archive` file for reuse later).

## Specific fixes you called out

- Replace DS monogram with your uploaded logo (`/mnt/user-uploads/2.jpeg` → CDN asset).
- Wordmark color → dark matching orange-gold (token `--csrit-gold`, ~`oklch(0.62 0.14 65)`).
- Portrait → less-cropped version (`/mnt/user-uploads/chief-scientist-Demetris-Skourides.jpg`); reframe so the name/title overlay sits below the watch line, not over it.
- Sub-headline → "Cyprus global engagement, trust and impact at a glance." (no dash).
- Remove all motion from metric/theme icons (no float, no count-up wobble, no pulse — keep them static SVGs). Network visualization keeps subtle line animation as that's its purpose.

## Hero composition

```text
┌──────────────────────────────────────────────────────────────┐
│ [LOGO] Chief Scientist for Research, Innovation & Technology │
├──────────────────────────────┬───────────────────────────────┤
│  Portrait (reframed)         │  Demetris Skourides           │
│  + name/title overlay below  │  Chief Scientist of the       │
│    the watch line            │  Republic of Cyprus           │
│                              │                               │
│                              │  "Connecting Cyprus to the    │
│                              │   world's leading research,   │
│                              │   innovation, AI and          │
│                              │   technology ecosystems."     │
│                              │                               │
│                              │  Cyprus global engagement,    │
│                              │  trust and impact at a glance.│
├──────────────────────────────┴───────────────────────────────┤
│         GLOBAL INNOVATION NETWORK (Cyprus at center)         │
│   ◯ NASA  ◯ MIT  ◯ Stanford  ◯ G42  ◯ ESA  ◯ Samsung  …      │
│   (animated connecting lines, clickable nodes, hover card)   │
└──────────────────────────────────────────────────────────────┘
```

## Network visualization

- SVG-based radial graph, Cyprus glyph at center.
- ~25 partner nodes positioned on 2 concentric rings.
- Top 6 (NASA, MIT, Stanford, ESA, G42, Samsung Research) render as real logos (uploaded as Lovable Assets — I'll request them after plan approval, or fall back to text marks if not provided).
- Remaining ~19 nodes render as circular monogram badges (e.g. "RIKEN", "ISRO", "M42") in the gold/ink token palette.
- Subtle animated dashed lines from Cyprus → each node (slow, ~10s loop) to convey "living ecosystem".
- Click/tap a node → side drawer with: name, country, category, initiatives, strategic relevance.
- Data source: `partners` table in Lovable Cloud (seeded).

## Strategic Impact Dashboard

8 static-looking cards (no animated counters) pulling from `metrics` table:
Research Partnerships · Innovation Initiatives · Countries Engaged · Universities Connected · Technology Partners · Startup Ecosystem Partners · Science Diplomacy Engagements · Investment & Commercialisation Pathways.

Each card → click opens a drawer listing related `partners`/`opportunities` rows.

## Six Strategic Themes

Static cards (no motion on icons): AI & Sovereign Compute · Research & Commercialisation · Space & Deep Technology · Startup & Venture Ecosystem · Health & Life Sciences · Science Diplomacy & International Partnerships. Each lists associated orgs from `partners` filtered by theme.

## Chief Scientist's Message

Full message text (already in context) rendered as a clean typographic section. No photo, no decoration beyond a gold rule. Sits directly above the existing flywheel.

## Current Strategic Opportunities (live feed)

Vertical list / card stack from `opportunities` table. Each row: Title · Region · Orgs · Status badge · Strategic relevance · Date. Filter chips by region / theme. Designed as a feed so new rows show without code changes.

## Cyprus Global Innovation Network (world map)

Interactive SVG world map (lightweight, no Mapbox). Pins for US, Europe, India, Japan, South Korea, Israel, UAE, Saudi Arabia, Singapore, Australia. Click a pin → side panel listing partners/initiatives/opportunities in that region (filtered from same tables).

## Backend (Lovable Cloud)

Enable Cloud and add four public-read tables (RLS: public SELECT; writes restricted to admin role for now — to be wired later):

- `partners` — id, name, country, region, category (NASA-type vs G42-type etc.), themes (text[]), logo_url, strategic_relevance, initiatives (text[]), tier (1 for hero logos, 2 for monogram).
- `themes` — id, slug, title, description, associated_partner_ids.
- `metrics` — id, slug, label, value (int), unit, last_updated.
- `opportunities` — id, title, region, partner_ids, status, relevance, date, detail_md, link.

All four seeded with the institutions and themes you listed.

## Motion policy

- Removed: float-y, count-up, tilt on metric/theme/award icons.
- Kept: subtle dashed-line animation on network connectors only (this *is* the "living ecosystem" signal you asked for).
- Hover states stay (color shift, subtle elevation) — no transforms.

## Technical notes

- Logo upload via `lovable-assets create` → `src/assets/csrit-logo.png.asset.json`.
- Portrait replaced with less-cropped jpg via same flow → `src/assets/skourides-v3.jpg.asset.json` (old v2 deleted).
- New CSS token `--csrit-gold` in `src/styles.css`; wordmark uses it.
- Old "numbers behind the bridge" markup moved to `src/components/archived/NumbersBehindBridge.tsx` (not imported) so we can revive later.
- Data fetched via `createServerFn` + `useSuspenseQuery` pattern; loaders prime cache. Public reads use `supabaseAdmin` inside the server fn (no auth gate) so the landing renders for anonymous visitors.
- Node click drawers use existing shadcn `Sheet`.
- World map: inline simplified SVG world (no external lib) to keep bundle small.

## Open item

You said "Mix: real for top 6, text marks for rest" — please upload logos for NASA, MIT, Stanford, ESA, G42, Samsung Research (PNG/SVG, transparent background). I'll wire them in; until uploaded the top 6 fall back to monograms so the page still renders cleanly.
