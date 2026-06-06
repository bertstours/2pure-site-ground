import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { useState } from "react";

import {
  getLandingData,
  type Partner,
  type Opportunity,
  type Theme,
} from "@/lib/landing.functions";
import { WORLD_MAP_COUNTRIES } from "@/components/WorldMapData";
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

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Chief Scientist for Research, Innovation and Technology" },
      {
        name: "description",
        content: "Get in touch with the office of the Chief Scientist of Cyprus.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(landingQueryOptions),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  const { partners, themes, opportunities } = data;

  return (
    <main className="relative min-h-screen flex flex-col">
      <div className="orb w-[520px] h-[520px] -top-40 -left-32 bg-copper/40" />
      <div className="orb w-[480px] h-[480px] bottom-0 left-1/3 bg-olive/30" />

      <SiteHeader />

      <div className="pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <h1 className="text-display text-5xl md:text-6xl xl:text-[66px] font-semibold tracking-tight leading-[1.02]">
            Contact
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
            Office of the Chief Scientist for Research, Innovation and Technology.
          </p>
        </div>
      </div>

      <MessageSection />
      <ThemesSection themes={themes} partners={partners} />
      <FlywheelSection />
      <WorldMapSection partners={partners} opportunities={opportunities} />

      <SiteFooter />
    </main>
  );
}

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
          <Link to="/" className="hover:text-foreground transition">
            Home
          </Link>
          <a href="/#chief-scientist" className="hover:text-foreground transition">
            The Chief Scientist
          </a>
          <a href="/#governance-strategy" className="hover:text-foreground transition">
            Governance & Strategy
          </a>
          <a href="/#research-innovation" className="hover:text-foreground transition">
            Research & Innovation
          </a>
          <a href="/#resources" className="hover:text-foreground transition">
            Resources
          </a>
          <a href="/#news" className="hover:text-foreground transition">
            News
          </a>
          <Link to="/contact" className="text-foreground font-semibold">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

function ThemesSection({ themes, partners }: { themes: Theme[]; partners: Partner[] }) {
  return (
    <section id="themes" className="relative z-10 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--csrit-gold)" }}>
            Research and Innovation Tracks
          </p>
          <h2 className="text-display text-5xl md:text-6xl xl:text-[66px] mt-3 leading-[1.02] font-semibold tracking-tight">
            Six initiative tracks <span className="italic aurora-text">connecting Cyprus</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {themes.map((t) => {
            const associated = partners.filter((p) =>
              t.associated_partner_short_names.includes(p.short_name ?? ""),
            );
            return (
              <article
                key={t.id}
                className="rounded-[1.75rem] glass p-6 shadow-float relative overflow-hidden flex flex-col"
              >
                <div className="absolute -top-16 -right-12 w-44 h-44 rounded-full bg-olive/20 blur-2xl" />
                <h3 className="text-display text-2xl font-semibold leading-tight">{t.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.focus}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {associated.map((p) => (
                    <span
                      key={p.id}
                      className="rounded-full bg-white/70 border border-border/60 px-2.5 py-1 text-[11px] text-foreground/80"
                    >
                      {p.short_name ?? p.name}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MessageSection() {
  return (
    <section id="message" className="relative z-10 py-8 md:py-11">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <p
          className="text-xs uppercase tracking-[0.22em] text-center"
          style={{ color: "var(--csrit-gold)" }}
        >
          A message from the Chief Scientist
        </p>
        <h2 className="text-display text-5xl md:text-6xl xl:text-[67px] mt-4 text-center leading-[1.02] font-semibold tracking-tight">
          Cyprus is at the brink of a <span className="italic aurora-text">transformative era</span>
        </h2>
        <div className="mx-auto mt-8 h-px w-24" style={{ background: "var(--csrit-gold)" }} />
        <div className="mt-10 space-y-5 text-[16px] md:text-[17px] leading-relaxed text-foreground/85">
          <p>
            Research, technology and innovation are fundamental tools, vital to the future of our
            country. The ability to use them effectively will position us for success.
          </p>
          <p>
            Our small island has already witnessed a rapid evolution in Research, Innovation and
            Digital Transformation over the past decade. Being ranked as a{" "}
            <span className="text-foreground font-medium">Strong Innovator</span> for the second
            consecutive year — according to the European Innovation Scoreboard — bears testament to
            the progress achieved and the potential ahead.
          </p>
          <p>
            In our quest to build sustainable growth and strengthen our posture as a regional
            research, technology and innovation hub, we focus on creating a robust and
            fit-for-the-future ecosystem that will become a major contributor to the country's GDP.
            An ecosystem that will spearhead the effort to create a modern and competitive economy,
            to the benefit of the environment, society and future generations.
          </p>
          <p>
            Together, we embark on a journey towards a more innovative, prosperous, and sustainable
            Cyprus, driven by research, innovation and technological advancement.
          </p>
          <p className="text-display text-xl text-foreground pt-2">— Demetris Skourides</p>
        </div>
      </div>
    </section>
  );
}

const MAP_REGIONS: { key: string; label: string; x: number; y: number }[] = [
  { key: "North America", label: "North America", x: 20, y: 38 },
  { key: "Europe", label: "Europe", x: 50, y: 32 },
  { key: "MENA", label: "MENA", x: 55, y: 50 },
  { key: "Asia", label: "Asia", x: 75, y: 45 },
  { key: "Oceania", label: "Oceania", x: 82, y: 75 },
];

function WorldMapSection({
  partners,
  opportunities,
}: {
  partners: Partner[];
  opportunities: Opportunity[];
}) {
  const [active, setActive] = useState<string | null>("Europe");

  const partnersInRegion = partners.filter((p) => p.region === active);
  const oppsInRegion = opportunities.filter((o) => o.region === active);

  return (
    <section id="map" className="relative z-10 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p
              className="text-xs uppercase tracking-[0.22em]"
              style={{ color: "var(--csrit-gold)" }}
            >
              Cyprus Global Innovation Network
            </p>
            <h2 className="text-display text-5xl md:text-6xl xl:text-[66px] mt-3 leading-[1.02] font-semibold tracking-tight">
              The <span className="italic aurora-text">geography</span> of Cyprus innovation
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Select a region to reveal active organisations, initiatives and opportunities.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 relative rounded-[2rem] glass shadow-float p-6 overflow-hidden">
            <div className="relative w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-[oklch(0.96_0.04_220)] to-[oklch(0.92_0.06_60)] overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-40" />

              <svg
                viewBox="0 0 1000 650"
                className="absolute inset-0 w-full h-full object-cover opacity-85 select-none"
              >
                <g>
                  {WORLD_MAP_COUNTRIES.map((c) => {
                    const isActiveRegion = active === c.region;
                    return (
                      <path
                        key={c.id}
                        d={c.d}
                        className="transition-colors duration-300 ease-in-out"
                        style={{
                          fill: isActiveRegion
                            ? "var(--csrit-gold)"
                            : "oklch(0.85 0.012 85 / 0.35)",
                          stroke: isActiveRegion ? "#fff" : "oklch(0.90 0.012 85 / 0.5)",
                          strokeWidth: isActiveRegion ? 0.8 : 0.4,
                        }}
                      />
                    );
                  })}
                </g>
              </svg>

              {MAP_REGIONS.map((r) => {
                const isActive = active === r.key;
                return (
                  <div
                    key={r.key}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  >
                    {isActive && (
                      <span className="absolute -inset-2 rounded-full bg-copper/30 animate-ping duration-1000 pointer-events-none" />
                    )}
                    <button
                      onClick={() => setActive(r.key)}
                      className={`relative rounded-full px-3 py-1.5 text-[11px] font-semibold border transition duration-300 ${
                        isActive
                          ? "bg-foreground text-background border-foreground shadow-glow scale-105"
                          : "bg-white/85 border-border/60 hover:bg-white hover:scale-105"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-background" : "bg-copper"
                          }`}
                        />
                        {r.label}
                      </span>
                    </button>
                  </div>
                );
              })}

              <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/50">
                  Republic of
                </p>
                <p className="text-display text-3xl font-semibold text-foreground/80">Cyprus</p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 rounded-[2rem] glass shadow-float p-6 md:p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Active region
            </p>
            <h3 className="text-display text-3xl md:text-4xl font-semibold mt-1">{active}</h3>

            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                Organisations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {partnersInRegion.length ? (
                  partnersInRegion.map((p) => (
                    <span
                      key={p.id}
                      className="rounded-full bg-white/70 border border-border/60 px-2.5 py-1 text-[11px] text-foreground/80 animate-fade-in"
                    >
                      {p.short_name ?? p.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                Initiatives & Opportunities
              </p>
              {oppsInRegion.length ? (
                <ul className="space-y-2.5">
                  {oppsInRegion.map((o) => (
                    <li key={o.id} className="text-sm animate-fade-in">
                      <span className="font-medium text-foreground/85">{o.title}</span>
                      <span className="text-muted-foreground"> — {o.relevance}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No active items in this region yet.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FlywheelSection() {
  return (
    <section id="flywheel" className="relative z-10 py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--csrit-gold)" }}>
            Recognition → Cyprus trust flywheel
          </p>
          <h2 className="text-display text-5xl md:text-6xl xl:text-[66px] mt-3 leading-[1.02] font-semibold tracking-tight">
            Awards become <span className="italic">trust</span>
            <br />
            Trust becomes <span className="aurora-text italic">opportunity</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-lg">
            Strategic partnerships, public endorsements and thought leadership compound into brand
            internationalisation, research prestige, investor confidence, policy credibility and
            innovation diplomacy.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              "Brand Internationalisation",
              "Research Prestige",
              "Investor Confidence",
              "Policy Credibility",
              "Innovation Diplomacy",
              "Sovereign AI",
            ].map((p) => (
              <div key={p} className="rounded-xl glass px-4 py-3 text-sm">
                {p}
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-square">
          <div className="absolute inset-0 rounded-full grid-bg" />
          <div className="absolute inset-8 rounded-full border border-copper/30 spin-slow" />
          <div
            className="absolute inset-20 rounded-full border border-olive/40 spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "45s" }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-display text-3xl md:text-5xl aurora-text leading-tight">Cyprus</p>
              <p className="text-display text-xl md:text-2xl">Credibility & Trust</p>
            </div>
          </div>
          {["Awards", "Mentions", "Thought\nLeadership", "Partnerships", "Diplomacy", "Media"].map(
            (label, i) => {
              const angle = (i / 6) * Math.PI * 2;
              const r = 44;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              return (
                <div
                  key={label}
                  className="absolute -translate-x-1/2 -translate-y-1/2 glass rounded-2xl px-3 py-2 text-xs whitespace-pre text-center shadow-float"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {label}
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}

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
