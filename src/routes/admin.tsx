import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import {
  getAllInitiativeMedia,
  saveInitiativeMedia,
  savePartnerLogo,
  getPartnerLogos,
  getCustomOpportunities,
  saveCustomOpportunities,
  getCustomPartners,
  saveCustomPartners,
  type InitiativeMedia,
  type StoredOpportunity,
  type StoredPartner,
} from "@/lib/initiative-store";
import { getLandingData } from "@/lib/landing.functions";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

type Tab = "partners" | "initiatives" | "superadmin";

const SUPERADMIN_EMAIL = "babar.by@gmail.com";

function uuid() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function AdminPanel() {
  const [tab, setTab] = useState<Tab>("partners");
  const [partners, setPartners] = useState<StoredPartner[]>([]);
  const [opportunities, setOpportunities] = useState<StoredOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [partnerLogos, setPartnerLogos] = useState<Record<string, string>>({});
  const [mediaMap, setMediaMap] = useState<Record<string, InitiativeMedia>>({});
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [superadminMsg, setSuperadminMsg] = useState("");

  // Edit states
  const [editingPartner, setEditingPartner] = useState<StoredPartner | null>(null);
  const [editingInitiative, setEditingInitiative] = useState<StoredOpportunity | null>(null);
  const [editingMedia, setEditingMedia] = useState<InitiativeMedia | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  const refreshLocalData = () => {
    const logos = getPartnerLogos();
    setPartnerLogos(logos);
    const all = getAllInitiativeMedia();
    const map: Record<string, InitiativeMedia> = {};
    all.forEach((m) => {
      map[m.id] = m;
    });
    setMediaMap(map);
  };

  useEffect(() => {
    refreshLocalData();
    getLandingData()
      .then(({ partners: p, opportunities: o }) => {
        // Prefer localStorage custom data if it exists
        const customP = getCustomPartners();
        const customO = getCustomOpportunities();
        setPartners(customP ?? (p as StoredPartner[]));
        setOpportunities(customO ?? (o as StoredOpportunity[]));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setAuthEmail(data.session?.user?.email ?? null);
      setAuthLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      setAuthEmail(session?.user?.email ?? null);
      setAuthLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const flash = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  // ── Partner CRUD ──
  const handleSavePartner = (p: StoredPartner, logoDataUrl?: string | null) => {
    if (logoDataUrl) savePartnerLogo(p.id, logoDataUrl);
    const updated = partners.some((x) => x.id === p.id)
      ? partners.map((x) => (x.id === p.id ? p : x))
      : [...partners, p];
    setPartners(updated);
    saveCustomPartners(updated);
    refreshLocalData();
    setEditingPartner(null);
    flash("Partner saved");
  };

  const handleDeletePartner = (id: string) => {
    const updated = partners.filter((p) => p.id !== id);
    setPartners(updated);
    saveCustomPartners(updated);
    flash("Partner deleted");
  };

  // ── Initiative CRUD ──
  const handleSaveInitiative = (o: StoredOpportunity, media: InitiativeMedia) => {
    const updated = opportunities.some((x) => x.id === o.id)
      ? opportunities.map((x) => (x.id === o.id ? o : x))
      : [...opportunities, o];
    setOpportunities(updated);
    saveCustomOpportunities(updated);
    saveInitiativeMedia(media);
    refreshLocalData();
    setEditingInitiative(null);
    setEditingMedia(null);
    flash("Initiative saved");
  };

  const handleDeleteInitiative = (id: string) => {
    const updated = opportunities.filter((o) => o.id !== id);
    setOpportunities(updated);
    saveCustomOpportunities(updated);
    flash("Initiative deleted");
  };

  const openEditInitiative = (o: StoredOpportunity) => {
    setEditingInitiative(o);
    setEditingMedia(
      mediaMap[o.id] ?? {
        id: o.id,
        cover_image_url: null,
        youtube_url: null,
        blog_url: null,
        reading_text: null,
      },
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center space-y-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin mx-auto"
            style={{ borderColor: "var(--csrit-gold)", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-muted-foreground">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 rounded-full copper-grad" />
            <span
              className="text-display font-semibold text-sm tracking-tight"
              style={{ color: "var(--csrit-gold)" }}
            >
              CSRIT Admin
            </span>
          </div>
          <nav className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
            {(["partners", "initiatives", "superadmin"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "partners"
                  ? "Partner Logos"
                  : t === "initiatives"
                    ? "Initiatives"
                    : "Superadmin"}
              </button>
            ))}
          </nav>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Website
          </Link>
        </div>
      </header>

      {saveMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium shadow-float">
          {saveMsg}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {tab === "partners" && (
          <PartnersTab
            partners={partners}
            partnerLogos={partnerLogos}
            onEdit={setEditingPartner}
            onDelete={handleDeletePartner}
            onNew={() =>
              setEditingPartner({
                id: uuid(),
                name: "",
                short_name: "",
                country: "",
                region: "Europe",
                category: "",
                themes: [],
                logo_url: null,
                strategic_relevance: "",
                initiatives: [],
                tier: 2,
                sort_order: partners.length + 1,
              })
            }
          />
        )}
        {tab === "initiatives" && (
          <InitiativesTab
            opportunities={opportunities}
            mediaMap={mediaMap}
            onEdit={openEditInitiative}
            onDelete={handleDeleteInitiative}
            onNew={() => {
              const newOpp: StoredOpportunity = {
                id: uuid(),
                title: "",
                region: "Europe",
                partner_short_names: [],
                status: "active",
                relevance: "",
                occurred_on: new Date().toISOString().slice(0, 10),
                detail: null,
                link: null,
              };
              setEditingInitiative(newOpp);
              setEditingMedia({
                id: newOpp.id,
                cover_image_url: null,
                youtube_url: null,
                blog_url: null,
                reading_text: null,
              });
            }}
          />
        )}
        {tab === "superadmin" && (
          <SuperadminTab
            authLoading={authLoading}
            authEmail={authEmail}
            message={superadminMsg}
            onMessage={setSuperadminMsg}
          />
        )}
      </main>

      <PartnerEditSheet
        partner={editingPartner}
        currentLogo={
          editingPartner ? (partnerLogos[editingPartner.id] ?? editingPartner.logo_url) : null
        }
        onClose={() => setEditingPartner(null)}
        onSave={handleSavePartner}
      />

      <InitiativeEditSheet
        opportunity={editingInitiative}
        media={editingMedia}
        onClose={() => {
          setEditingInitiative(null);
          setEditingMedia(null);
        }}
        onSave={handleSaveInitiative}
      />
    </div>
  );
}

/* ════ SUPERADMIN TAB ════ */

function SuperadminTab({
  authLoading,
  authEmail,
  message,
  onMessage,
}: {
  authLoading: boolean;
  authEmail: string | null;
  message: string;
  onMessage: (value: string) => void;
}) {
  const [sending, setSending] = useState(false);
  const isAllowed = authEmail?.toLowerCase() === SUPERADMIN_EMAIL;

  const sendMagicLink = async () => {
    setSending(true);
    onMessage("");
    const emailRedirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: SUPERADMIN_EMAIL,
      options: { emailRedirectTo },
    });
    if (error) {
      onMessage(error.message);
    } else {
      onMessage(
        `Magic link sent to ${SUPERADMIN_EMAIL}. Open your email and click the link, then return here.`,
      );
    }
    setSending(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onMessage("Signed out.");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-3xl font-semibold">Superadmin</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          This tab is protected by Supabase magic-link login and only unlocks for {SUPERADMIN_EMAIL}
          .
        </p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm space-y-5 max-w-3xl">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
          {authLoading ? (
            <p className="mt-2 text-sm">Checking session…</p>
          ) : isAllowed ? (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-green-700 font-medium">Superadmin access granted</p>
              <p className="text-sm text-muted-foreground">Signed in as {authEmail}</p>
            </div>
          ) : authEmail ? (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-destructive font-medium">Access denied</p>
              <p className="text-sm text-muted-foreground">
                Signed in as {authEmail}. Only {SUPERADMIN_EMAIL} can open this tab.
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Not signed in.</p>
          )}
        </div>

        {!isAllowed && (
          <div className="rounded-xl bg-muted/40 border border-border/50 p-4 space-y-3">
            <p className="text-sm leading-relaxed">
              Click below to receive a magic link at{" "}
              <span className="font-medium">{SUPERADMIN_EMAIL}</span>.
            </p>
            <button
              onClick={sendMagicLink}
              disabled={sending}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--csrit-gold)" }}
            >
              {sending ? "Sending magic link…" : "Send magic link"}
            </button>
          </div>
        )}

        {isAllowed && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Account</p>
              <p className="mt-2 text-sm">Superadmin email: {authEmail}</p>
              <button
                onClick={signOut}
                className="mt-4 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/50 transition"
              >
                Sign out
              </button>
            </div>
            <div className="rounded-xl border border-border/50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Security note
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Service role keys and other secrets should stay in environment variables only. They
                are intentionally not editable in the browser.
              </p>
            </div>
          </div>
        )}

        {message && <p className="text-sm font-medium">{message}</p>}
      </div>
    </div>
  );
}

/* ════ PARTNERS TAB ════ */

function PartnersTab({
  partners,
  partnerLogos,
  onEdit,
  onDelete,
  onNew,
}: {
  partners: StoredPartner[];
  partnerLogos: Record<string, string>;
  onEdit: (p: StoredPartner) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display text-3xl font-semibold">Partner Logos</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Upload logos and manage network partners.
          </p>
        </div>
        <button
          onClick={onNew}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ background: "var(--csrit-gold)" }}
        >
          + Add Partner
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {partners.map((p) => (
          <PartnerCard
            key={p.id}
            partner={p}
            logoSrc={partnerLogos[p.id] ?? p.logo_url}
            onEdit={() => onEdit(p)}
            onDelete={() => {
              if (window.confirm(`Delete ${p.name}?`)) onDelete(p.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PartnerCard({
  partner,
  logoSrc,
  onEdit,
  onDelete,
}: {
  partner: StoredPartner;
  logoSrc: string | null | undefined;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full aspect-square rounded-xl bg-muted/40 grid place-items-center overflow-hidden">
        {logoSrc ? (
          <img src={logoSrc} alt={partner.name} className="w-full h-full object-contain p-3" />
        ) : (
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground/50">
              {(partner.short_name ?? partner.name).slice(0, 2).toUpperCase()}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">No logo</p>
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-sm leading-tight">
          {(partner.short_name ?? partner.name) || "New Partner"}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {partner.category || "—"} · {partner.country || "—"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 rounded-lg py-1.5 text-xs font-medium text-white"
          style={{ background: "var(--csrit-gold)" }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg px-3 py-1.5 text-xs font-medium border border-destructive/40 text-destructive hover:bg-destructive/10 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ════ INITIATIVES TAB ════ */

function InitiativesTab({
  opportunities,
  mediaMap,
  onEdit,
  onDelete,
  onNew,
}: {
  opportunities: StoredOpportunity[];
  mediaMap: Record<string, InitiativeMedia>;
  onEdit: (o: StoredOpportunity) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display text-3xl font-semibold">Initiatives</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Manage strategic initiatives and their media.
          </p>
        </div>
        <button
          onClick={onNew}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
          style={{ background: "var(--csrit-gold)" }}
        >
          + Add Initiative
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {opportunities.map((o) => (
          <InitiativeAdminCard
            key={o.id}
            opportunity={o}
            media={mediaMap[o.id] ?? null}
            onEdit={() => onEdit(o)}
            onDelete={() => {
              if (window.confirm(`Delete "${o.title}"?`)) onDelete(o.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function InitiativeAdminCard({
  opportunity: o,
  media,
  onEdit,
  onDelete,
}: {
  opportunity: StoredOpportunity;
  media: InitiativeMedia | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const checks = [
    !!media?.cover_image_url,
    !!media?.youtube_url,
    !!media?.blog_url,
    !!media?.reading_text,
  ];
  const filled = checks.filter(Boolean).length;
  return (
    <article className="rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative w-full aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {media?.cover_image_url ? (
          <img src={media.cover_image_url} alt={o.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center opacity-30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M21 15l-5-5L5 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
        <span
          className="absolute top-2 right-2 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{ color: "var(--csrit-gold)" }}
        >
          {o.status}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-display font-semibold text-base leading-tight">
            {o.title || "Untitled"}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">{o.region}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {o.partner_short_names.map((s) => (
            <span
              key={s}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          {[
            ["Cover Image", checks[0]],
            ["YouTube", checks[1]],
            ["Blog Link", checks[2]],
            ["Reading Text", checks[3]],
          ].map(([label, done]) => (
            <div
              key={label as string}
              className={`flex items-center gap-1 ${done ? "text-foreground" : "text-muted-foreground/50"}`}
            >
              <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${done ? "bg-green-500" : "border border-border"}`}
              />
              {label}
            </div>
          ))}
        </div>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(filled / 4) * 100}%`, background: "var(--csrit-gold)" }}
          />
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            onClick={onEdit}
            className="flex-1 rounded-xl py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--csrit-gold)" }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-xl px-3 py-2 text-sm font-medium border border-destructive/40 text-destructive hover:bg-destructive/10 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

/* ════ PARTNER EDIT SHEET ════ */

function PartnerEditSheet({
  partner,
  currentLogo,
  onClose,
  onSave,
}: {
  partner: StoredPartner | null;
  currentLogo: string | null | undefined;
  onClose: () => void;
  onSave: (p: StoredPartner, logo?: string | null) => void;
}) {
  const [form, setForm] = useState<StoredPartner | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (partner) {
      setForm({ ...partner });
      setLogoPreview(currentLogo ?? null);
    }
  }, [partner, currentLogo]);

  const set = (field: keyof StoredPartner, value: unknown) =>
    setForm((f) => (f ? { ...f, [field]: value } : f));

  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (!form) return null;

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--csrit-gold)]/40 placeholder:text-muted-foreground/50";

  return (
    <Sheet open={!!partner} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-display text-xl">
            {form.id.startsWith("local-") ? "New Partner" : "Edit Partner"}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-5 px-1 pb-10">
          {/* Logo */}
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Logo
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-xl bg-muted/40 border border-border/60 grid place-items-center overflow-hidden shrink-0 cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground/40">
                    {(form.short_name ?? form.name).slice(0, 2).toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/50 transition"
                >
                  {logoPreview ? "Replace Logo" : "Upload Logo"}
                </button>
                {logoPreview && (
                  <button
                    onClick={() => setLogoPreview(null)}
                    className="ml-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.svg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleLogoFile(f);
              }}
            />
          </div>

          {[
            {
              label: "Name",
              field: "name" as const,
              placeholder: "e.g. Massachusetts Institute of Technology",
            },
            { label: "Short Name", field: "short_name" as const, placeholder: "e.g. MIT" },
            { label: "Country", field: "country" as const, placeholder: "e.g. USA" },
            { label: "Category", field: "category" as const, placeholder: "e.g. University" },
            {
              label: "Strategic Relevance",
              field: "strategic_relevance" as const,
              placeholder: "Brief description...",
            },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                {label}
              </label>
              <input
                value={(form[field] as string) ?? ""}
                onChange={(e) => set(field, e.target.value)}
                placeholder={placeholder}
                className={inputCls}
              />
            </div>
          ))}

          {/* Region */}
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Region
            </label>
            <select
              value={form.region}
              onChange={(e) => set("region", e.target.value)}
              className={inputCls}
            >
              {["Europe", "North America", "MENA", "Asia", "Oceania"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Tier */}
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Tier (1 = inner ring, 2 = outer ring)
            </label>
            <select
              value={form.tier}
              onChange={(e) => set("tier", Number(e.target.value))}
              className={inputCls}
            >
              <option value={1}>1 — Inner ring (prominent)</option>
              <option value={2}>2 — Outer ring</option>
            </select>
          </div>

          <button
            onClick={() => onSave(form, logoPreview)}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: "var(--csrit-gold)" }}
          >
            Save Partner
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ════ INITIATIVE EDIT SHEET ════ */

function InitiativeEditSheet({
  opportunity,
  media,
  onClose,
  onSave,
}: {
  opportunity: StoredOpportunity | null;
  media: InitiativeMedia | null;
  onClose: () => void;
  onSave: (o: StoredOpportunity, m: InitiativeMedia) => void;
}) {
  const [form, setForm] = useState<StoredOpportunity | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [readingText, setReadingText] = useState("");
  const [partnersInput, setPartnersInput] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (opportunity) {
      setForm({ ...opportunity });
      setPartnersInput(opportunity.partner_short_names.join(", "));
    }
    if (media) {
      setCoverPreview(media.cover_image_url ?? null);
      setYoutubeUrl(media.youtube_url ?? "");
      setBlogUrl(media.blog_url ?? "");
      setReadingText(media.reading_text ?? "");
    } else {
      setCoverPreview(null);
      setYoutubeUrl("");
      setBlogUrl("");
      setReadingText("");
    }
  }, [opportunity, media]);

  const set = (field: keyof StoredOpportunity, value: unknown) =>
    setForm((f) => (f ? { ...f, [field]: value } : f));

  const handleCoverFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form || !opportunity) return;
    const finalForm = {
      ...form,
      partner_short_names: partnersInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const finalMedia: InitiativeMedia = {
      id: opportunity.id,
      cover_image_url: coverPreview,
      youtube_url: youtubeUrl.trim() || null,
      blog_url: blogUrl.trim() || null,
      reading_text: readingText.trim() || null,
    };
    onSave(finalForm, finalMedia);
  };

  if (!form) return null;

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--csrit-gold)]/40 placeholder:text-muted-foreground/50";

  return (
    <Sheet open={!!opportunity} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-display text-xl">
            {form.id.startsWith("local-") ? "New Initiative" : "Edit Initiative"}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-5 px-1 pb-10">
          {/* Cover Image */}
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Cover Image
            </label>
            <div
              className="relative w-full aspect-video rounded-xl border-2 border-dashed border-border/60 overflow-hidden cursor-pointer hover:border-[var(--csrit-gold)] transition group"
              onClick={() => coverRef.current?.click()}
            >
              {coverPreview ? (
                <img src={coverPreview} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground/40 group-hover:text-muted-foreground/60 transition">
                  <div className="text-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mx-auto mb-2"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <p className="text-xs">Click to upload cover image</p>
                  </div>
                </div>
              )}
            </div>
            {coverPreview && (
              <button
                onClick={() => setCoverPreview(null)}
                className="mt-1 text-[11px] text-muted-foreground hover:text-destructive"
              >
                Remove image
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCoverFile(f);
              }}
            />
          </div>

          {/* Data fields */}
          {[
            { label: "Title", field: "title" as const, placeholder: "Initiative title" },
            {
              label: "Relevance / Description",
              field: "relevance" as const,
              placeholder: "What this initiative is about...",
            },
            { label: "Detail", field: "detail" as const, placeholder: "More context..." },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                {label}
              </label>
              {field === "relevance" || field === "detail" ? (
                <textarea
                  value={(form[field] as string) ?? ""}
                  onChange={(e) => set(field, e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              ) : (
                <input
                  value={(form[field] as string) ?? ""}
                  onChange={(e) => set(field, e.target.value)}
                  placeholder={placeholder}
                  className={inputCls}
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Region
            </label>
            <select
              value={form.region}
              onChange={(e) => set("region", e.target.value)}
              className={inputCls}
            >
              {["Europe", "North America", "MENA", "Asia", "Oceania"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Partners (comma-separated short names)
            </label>
            <input
              value={partnersInput}
              onChange={(e) => setPartnersInput(e.target.value)}
              placeholder="e.g. MIT, NASA, G42"
              className={inputCls}
            />
          </div>

          {/* Media */}
          <div className="border-t border-border/40 pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Media</p>
            {[
              {
                label: "YouTube URL",
                value: youtubeUrl,
                set: setYoutubeUrl,
                placeholder: "https://youtube.com/watch?v=...",
              },
              {
                label: "Blog / Article URL",
                value: blogUrl,
                set: setBlogUrl,
                placeholder: "https://...",
              },
            ].map(({ label, value, set: setter, placeholder }) => (
              <div key={label} className="mb-4">
                <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  {label}
                </label>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className={inputCls}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Reading Text
              </label>
              <textarea
                value={readingText}
                onChange={(e) => setReadingText(e.target.value)}
                rows={5}
                placeholder="Paste article content or key points..."
                className={inputCls + " resize-none leading-relaxed"}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white"
            style={{ background: "var(--csrit-gold)" }}
          >
            Save Initiative
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
