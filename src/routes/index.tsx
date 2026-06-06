import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  getLandingData,
  type Partner,
  type Opportunity,
  type Theme,
  type Metric,
  type InitiativeMediaRow,
} from "@/lib/landing.functions";
import { WORLD_MAP_COUNTRIES } from "@/components/WorldMapData";
import { getYouTubeEmbedUrl, type InitiativeMedia } from "@/lib/initiative-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const landingQueryOptions = queryOptions({
  queryKey: ["landing"],
  queryFn: () => getLandingData(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dr. Demetris Skourides — Chief Scientist of Cyprus" },
      {
        name: "description",
        content:
          "Cyprus global engagement, trust and impact at a glance. The innovation command center of the Chief Scientist for Research, Innovation and Technology.",
      },
      {
        property: "og:title",
        content: "Dr. Demetris Skourides — Chief Scientist of Cyprus",
      },
      {
        property: "og:description",
        content:
          "Cyprus connected to the world's leading research, innovation, AI and technology ecosystems.",
      },
      { property: "og:url", content: "https://csrit-sample.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://csrit-sample.lovable.app/" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(landingQueryOptions),
  component: Landing,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold">Landing failed to load</h1>
        <p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div className="p-10">Not found.</div>,
});

/* ============================================================ */

const REGIONS = ["North America", "Europe", "MENA", "Asia", "Oceania"] as const;

function Landing() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  const { partners, opportunities } = data;

  return (
    <main className="relative min-h-screen flex flex-col">
      <div className="orb w-[520px] h-[520px] -top-40 -left-32 bg-copper/40" />
      <div className="orb w-[420px] h-[420px] top-[40vh] -right-32 bg-aurora/50" />
      <div className="orb w-[480px] h-[480px] bottom-0 left-1/3 bg-olive/30" />

      <SiteHeader />
      <Hero />
      <NetworkSection partners={partners} />
      <OpportunitiesSection opportunities={opportunities} />
      <SiteFooter />
    </main>
  );
}

/* ===================== Header ===================== */

function SiteHeader() {
  return (
    <header className="relative z-30">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-0.5 min-w-0 ml-4 md:ml-6">
          <img
            src="/csrit-logo.png"
            alt="Chief Scientist of Cyprus emblem"
            className="w-24 h-24 md:w-28 md:h-28 object-contain shrink-0 brightness-85 contrast-105 -mr-1"
          />
          <span
            className="text-display text-[15px] md:text-[17px] font-semibold leading-tight tracking-tight mt-1"
            style={{ color: "var(--csrit-gold)" }}
          >
            Chief Scientist for Research,
            <br className="hidden md:block" /> Innovation and Technology
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-6 text-sm text-muted-foreground font-medium">
          <Link to="/" className="text-foreground font-semibold">
            Home
          </Link>
          <a href="#chief-scientist" className="hover:text-foreground transition">
            The Chief Scientist
          </a>
          <a href="#governance-strategy" className="hover:text-foreground transition">
            Governance & Strategy
          </a>
          <a href="#research-innovation" className="hover:text-foreground transition">
            Research & Innovation
          </a>
          <a href="#resources" className="hover:text-foreground transition">
            Resources
          </a>
          <a href="#news" className="hover:text-foreground transition">
            News
          </a>
          <Link to="/contact" className="hover:text-foreground transition">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ===================== Hero ===================== */

function Hero() {
  return (
    <section className="relative z-10 pb-4 md:pb-8">
      <div className="grid-bg absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10 pt-0 grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Portrait — wider crop, aligned with copy bubble */}
        <aside className="lg:col-span-5 flex justify-center lg:justify-end pt-0 md:pt-1 lg:pt-2">
          <div className="relative w-full max-w-[400px]">
            <div className="absolute -inset-5 rounded-[2.5rem] copper-grad opacity-20 blur-2xl" />
            <div className="relative rounded-[2rem] glass overflow-hidden shadow-float aspect-[4/3] bg-white">
              <img
                src="/skourides.jpg"
                alt="Demetris Skourides, Chief Scientist of Cyprus"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="mt-5 text-center lg:text-left">
              <p className="text-display text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                Demetris Skourides
              </p>
              <p
                className="text-xs uppercase tracking-[0.22em] font-semibold mt-2"
                style={{ color: "var(--csrit-gold)" }}
              >
                Chief Scientist, Republic of Cyprus
              </p>
              <p className="text-[15px] text-muted-foreground mt-3 max-w-sm leading-relaxed italic">
                "My role is to make Cyprus a dynamic and competitive economy, driven by research,
                scientific excellence, innovation, technological development and entrepreneurship.
                To lead as a regional European center of excellence, in partnership with the world."
              </p>
            </div>
          </div>
        </aside>

        {/* Copy + mission */}
        <div className="lg:col-span-7 pt-0 md:pt-1 lg:pt-2">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-copper" />
            Innovation command center · Republic of Cyprus
          </span>
          <h1 className="text-display mt-6 text-5xl md:text-6xl xl:text-[66px] leading-[1.02] font-semibold tracking-tight text-foreground">
            Advancing Cyprus through Science, Innovation and Global Partnerships
          </h1>
          <div className="mt-8 space-y-3">
            <div className="flex flex-wrap gap-3">
              {["AI & Sovereign Compute", "Science Diplomacy", "Space & Deep Tech"].map((t) => (
                <span
                  key={t}
                  className="rounded-full glass px-4 py-2 text-sm md:text-base font-medium text-foreground/85"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {["Health & Life Sciences", "Startup & Venture", "Research & Commercialisation"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full glass px-4 py-2 text-sm md:text-base font-medium text-foreground/85"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== Global Network Visualization ===================== */

const REGIONS_ALL = ["All", "Europe", "North America", "MENA", "Asia", "Oceania"] as const;
type RegionFilter = (typeof REGIONS_ALL)[number];

function NetworkSection({ partners: serverPartners }: { partners: Partner[] }) {
  const [active, setActive] = useState<Partner | null>(null);
  const [partners, setPartners] = useState<Partner[]>(serverPartners);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("All");

  useEffect(() => {
    const logos = getPartnerLogos();
    const custom = getCustomPartners();
    const base = (custom ?? serverPartners) as Partner[];
    setPartners(base.map((p) => ({ ...p, logo_url: logos[p.id] ?? p.logo_url })));
  }, []);

  const visible =
    regionFilter === "All" ? partners : partners.filter((p) => p.region === regionFilter);

  return (
    <section id="network" className="relative z-10 py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--csrit-gold)" }}>
            Global Innovation Network
          </p>
          <h2 className="text-display text-3xl md:text-4xl xl:text-[45px] mt-3 leading-[1.02] font-semibold text-foreground tracking-tight xl:whitespace-nowrap">
            Building Bridges, Enabling Innovation,{" "}
            <span className="aurora-text inline-block pr-1">Creating Impact</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-[19px] md:text-[20px] leading-relaxed">
            Click any partner to see their country, themes and active initiatives.
          </p>

          {/* Region filter — kept inside content width under the subline */}
          <div className="mt-4 flex flex-wrap gap-1.5 max-w-full">
            {REGIONS_ALL.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium border transition-all ${
                  regionFilter === r
                    ? "border-[var(--csrit-gold)] text-[var(--csrit-gold)] bg-[var(--csrit-gold)]/8"
                    : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] glass shadow-float p-3 md:p-4">
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
            {visible.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                aria-label={p.name}
                className="rounded-xl bg-white/70 border border-border/40 p-2 md:p-2.5 flex flex-col items-center gap-2 hover:shadow-glow hover:scale-[1.04] hover:bg-white/90 transition-all group"
              >
                {/* Logo area — fixed square so the image is always centred */}
                <div className="w-full aspect-square grid place-items-center overflow-hidden">
                  {p.logo_url ? (
                    <img
                      src={p.logo_url}
                      alt={p.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-[13px] md:text-[15px] font-semibold text-foreground/65 text-center leading-snug px-1">
                      {p.name}
                    </span>
                  )}
                </div>
                {/* Full organisation name — wraps to 2 lines max, never truncated */}
                <span className="text-[11px] md:text-[12px] font-medium text-foreground/55 text-center leading-snug w-full line-clamp-2 shrink-0">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <PartnerDrawer partner={active} onClose={() => setActive(null)} />
    </section>
  );
}

function PartnerDrawer({ partner, onClose }: { partner: Partner | null; onClose: () => void }) {
  return (
    <Sheet open={!!partner} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {partner && (
          <>
            <SheetHeader>
              <SheetTitle className="text-display text-2xl">{partner.name}</SheetTitle>
              <SheetDescription>
                {partner.country} · {partner.region} · {partner.category}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-5 text-sm px-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Strategic relevance
                </p>
                <p className="mt-1 text-foreground/85">{partner.strategic_relevance}</p>
              </div>
              {partner.themes.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Themes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {partner.themes.map((t) => (
                      <span key={t} className="rounded-full glass px-2.5 py-1 text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {partner.initiatives.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Initiatives
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-foreground/80">
                    {partner.initiatives.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ===================== Strategic Impact Dashboard ===================== */

function DashboardSection({ metrics }: { metrics: Metric[] }) {
  return (
    <section id="impact" className="relative z-10 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p
              className="text-xs uppercase tracking-[0.22em]"
              style={{ color: "var(--csrit-gold)" }}
            >
              Strategic Impact Dashboard
            </p>
            <h2 className="text-display text-5xl md:text-6xl xl:text-[66px] mt-3 leading-[1.02] font-semibold tracking-tight">
              Live signals of <span className="italic aurora-text">Cyprus</span> in the world
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Recognitions, partnerships, programmes and pathways currently active across the global
            innovation ecosystem.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.id} className="rounded-2xl glass p-5 shadow-float relative overflow-hidden">
              <div className="absolute -top-12 -right-10 w-36 h-36 rounded-full copper-grad opacity-15 blur-2xl" />
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                {m.label}
              </p>
              <p className="mt-3 flex items-baseline gap-0.5">
                <span className="text-display text-4xl md:text-5xl font-semibold aurora-text leading-none">
                  {m.value}
                </span>
                <span className="text-display text-2xl md:text-3xl text-copper">
                  {m.unit ?? ""}
                </span>
              </p>
              {m.caption && (
                <p className="mt-3 text-[12px] text-foreground/70 leading-snug">{m.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== Site Footer ===================== */

function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
        <p className="uppercase font-medium">
          THIS IS AN INTERNAL PRESENTATION FOR DEMETRIS SKOURIDES, NOT FOR COMMERCIAL OR PUBLIC USE
        </p>
        <p>Live innovation command center.</p>
        <a
          href="/admin"
          className="text-foreground hover:underline"
          style={{ fontSize: "0.85rem" }}
        >
          admin
        </a>
      </div>
    </footer>
  );
}
function OpportunitiesSection({ opportunities: serverOpps }: { opportunities: Opportunity[] }) {
  const [active, setActive] = useState<Opportunity | null>(null);
  const [mediaMap, setMediaMap] = useState<Record<string, InitiativeMedia>>({});
  const [opportunities, setOpportunities] = useState<Opportunity[]>(serverOpps);

  useEffect(() => {
    const custom = getCustomOpportunities();
    if (custom) setOpportunities(custom as Opportunity[]);
    const all = getAllInitiativeMedia();
    const map: Record<string, InitiativeMedia> = {};
    all.forEach((m) => {
      map[m.id] = m;
    });
    setMediaMap(map);
  }, []);

  return (
    <section id="initiatives" className="relative z-10 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--csrit-gold)" }}>
            Explore current strategic initiatives
          </p>
          <h2 className="text-display text-3xl md:text-4xl xl:text-[45px] mt-4 leading-[1.02] font-semibold tracking-tight xl:whitespace-nowrap">
            Partnerships for growth and{" "}
            <span className="aurora-text inline-block pr-1">prosperity</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((o) => {
            const media = mediaMap[o.id];
            return (
              <article
                key={o.id}
                role="button"
                tabIndex={0}
                onClick={() => setActive(o)}
                onKeyDown={(e) => e.key === "Enter" && setActive(o)}
                className="rounded-2xl glass shadow-float flex flex-col justify-between cursor-pointer hover:shadow-glow hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
              >
                {/* Cover image */}
                {media?.cover_image_url ? (
                  <div className="w-full aspect-video overflow-hidden">
                    <img
                      src={media.cover_image_url}
                      alt={o.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-copper/10 to-aurora/10 relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-20" />
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="text-4xl font-bold text-muted-foreground/20 text-display">
                        {o.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-display text-xl font-semibold leading-tight">{o.title}</h3>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      className="shrink-0 mt-0.5 text-muted-foreground/40 group-hover:text-copper group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    >
                      <path
                        d="M4 14L14 4M14 4H7M14 4v7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                    {o.relevance}
                  </p>
                  {/* Media badges */}
                  {(media?.youtube_url || media?.blog_url) && (
                    <div className="flex gap-1.5 mt-3">
                      {media?.youtube_url && (
                        <span className="rounded-full bg-red-500/10 text-red-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                          ▶ Video
                        </span>
                      )}
                      {media?.blog_url && (
                        <span className="rounded-full bg-blue-500/10 text-blue-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                          ✦ Article
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/40">
                    {o.partner_short_names.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-white/70 border border-border/60 px-2.5 py-1 text-[11px] text-foreground/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <InitiativeDrawer
        opportunity={active}
        media={active ? (mediaMap[active.id] ?? null) : null}
        onClose={() => setActive(null)}
      />
    </section>
  );
}

/* ─── Initiative Detail Drawer ─── */

function InitiativeDrawer({
  opportunity,
  media,
  onClose,
}: {
  opportunity: Opportunity | null;
  media: InitiativeMedia | null;
  onClose: () => void;
}) {
  const embedUrl = media?.youtube_url ? getYouTubeEmbedUrl(media.youtube_url) : null;

  return (
    <Sheet open={!!opportunity} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        {opportunity && (
          <>
            {/* Cover image */}
            {media?.cover_image_url && (
              <div className="-mx-6 -mt-6 mb-6 w-[calc(100%+3rem)] aspect-video overflow-hidden">
                <img
                  src={media.cover_image_url}
                  alt={opportunity.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <SheetHeader className="mb-5">
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "var(--csrit-gold)" }}
              >
                {opportunity.region}
              </p>
              <SheetTitle className="text-display text-2xl leading-tight mt-1">
                {opportunity.title}
              </SheetTitle>
              <SheetDescription className="text-sm leading-relaxed mt-2">
                {opportunity.relevance}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-1 pb-10">
              {/* YouTube embed */}
              {embedUrl && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
                    Video
                  </p>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-float">
                    <iframe
                      src={embedUrl}
                      title={opportunity.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Detail */}
              {opportunity.detail && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                    Overview
                  </p>
                  <p className="text-sm text-foreground/85 leading-relaxed">{opportunity.detail}</p>
                </div>
              )}

              {/* Reading text */}
              {media?.reading_text && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                    Full Article
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                    {media.reading_text}
                  </p>
                </div>
              )}

              {/* Blog link */}
              {media?.blog_url && (
                <a
                  href={media.blog_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full rounded-xl glass px-4 py-3 text-sm font-medium hover:shadow-float transition group"
                >
                  <span>Read full article</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="group-hover:translate-x-0.5 transition-transform"
                  >
                    <path
                      d="M3 13L13 3M13 3H7M13 3v6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}

              {/* Partners */}
              {opportunity.partner_short_names.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                    Partners
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {opportunity.partner_short_names.map((s) => (
                      <span
                        key={s}
                        className="rounded-full glass px-3 py-1 text-[12px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
