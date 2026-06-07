import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import {
  newId,
  upsertPartner,
  deletePartner,
  upsertOpportunity,
  deleteOpportunity,
  upsertInitiativeMedia,
  type StoredPartner,
  type StoredOpportunity,
  type InitiativeMedia,
} from "@/lib/initiative-store";
import { getLandingData } from "@/lib/landing.functions";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

type Tab = "partners" | "initiatives" | "account";
const SUPERADMIN_EMAIL = "babar.by@gmail.com";

function AdminPanel() {
  const [tab, setTab] = useState<Tab>("partners");

  // Auth state
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  // Data
  const [loadingData, setLoadingData] = useState(true);
  const [partners, setPartners] = useState<StoredPartner[]>([]);
  const [opportunities, setOpportunities] = useState<StoredOpportunity[]>([]);
  const [mediaMap, setMediaMap] = useState<Record<string, InitiativeMedia>>({});

  // Edit state
  const [editingPartner, setEditingPartner] = useState<StoredPartner | null>(null);
  const [editingInitiative, setEditingInitiative] = useState<StoredOpportunity | null>(null);
  const [editingMedia, setEditingMedia] = useState<InitiativeMedia | null>(null);
  const [saveMsg, setSaveMsg] = useState("");

  const flash = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const refreshData = useCallback(async () => {
    setLoadingData(true);
    try {
      const { partners: p, opportunities: o, media } = await getLandingData();
      setPartners(p as StoredPartner[]);
      setOpportunities(o as StoredOpportunity[]);
      const map: Record<string, InitiativeMedia> = {};
      media.forEach((m) => {
        map[m.opportunity_id] = m;
      });
      setMediaMap(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  }, []);

  const checkRole = useCallback(async (session: Session | null) => {
    if (!session?.user) {
      setIsSuperadmin(false);
      return;
    }
    const { data, error } = await supabase
      .from("user_roles" as never)
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "superadmin")
      .maybeSingle();
    if (error) {
      console.error(error);
      setIsSuperadmin(false);
    } else {
      setIsSuperadmin(!!data);
    }
  }, []);

  useEffect(() => {
    void refreshData();
    supabase.auth.getSession().then(({ data }) => {
      setAuthEmail(data.session?.user?.email ?? null);
      void checkRole(data.session).finally(() => setAuthLoading(false));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthEmail(session?.user?.email ?? null);
      void checkRole(session).finally(() => setAuthLoading(false));
    });
    return () => data.subscription.unsubscribe();
  }, [refreshData, checkRole]);

  // ── CRUD handlers (only callable when isSuperadmin) ──
  const handleSavePartner = async (p: StoredPartner) => {
    try {
      await upsertPartner(p);
      await refreshData();
      setEditingPartner(null);
      flash("Partner saved");
    } catch (e: unknown) {
      flash(`Save failed: ${(e as Error).message}`);
    }
  };
  const handleDeletePartner = async (id: string) => {
    try {
      await deletePartner(id);
      await refreshData();
      flash("Partner deleted");
    } catch (e: unknown) {
      flash(`Delete failed: ${(e as Error).message}`);
    }
  };
  const handleSaveInitiative = async (o: StoredOpportunity, m: InitiativeMedia) => {
    try {
      await upsertOpportunity(o);
      await upsertInitiativeMedia(m);
      await refreshData();
      setEditingInitiative(null);
      setEditingMedia(null);
      flash("Initiative saved");
    } catch (e: unknown) {
      flash(`Save failed: ${(e as Error).message}`);
    }
  };
  const handleDeleteInitiative = async (id: string) => {
    try {
      await deleteOpportunity(id);
      await refreshData();
      flash("Initiative deleted");
    } catch (e: unknown) {
      flash(`Delete failed: ${(e as Error).message}`);
    }
  };

  const openEditInitiative = (o: StoredOpportunity) => {
    setEditingInitiative(o);
    setEditingMedia(
      mediaMap[o.id] ?? {
        opportunity_id: o.id,
        cover_image_url: null,
        youtube_url: null,
        blog_url: null,
        reading_text: null,
      },
    );
  };

  // ── Render ──
  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    );
  }

  if (!isSuperadmin) {
    return <LoginScreen authEmail={authEmail} />;
  }

  return (
    <div className="min-h-screen bg-background">
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
            {(["partners", "initiatives", "account"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "partners" ? "Partner Logos" : t === "initiatives" ? "Initiatives" : "Account"}
              </button>
            ))}
          </nav>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition shrink-0"
          >
            ← Back to Website
          </Link>
        </div>
      </header>

      {saveMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground text-background px-5 py-3 text-sm font-medium shadow-float">
          {saveMsg}
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {loadingData ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : tab === "partners" ? (
          <PartnersTab
            partners={partners}
            onEdit={setEditingPartner}
            onDelete={handleDeletePartner}
            onNew={() =>
              setEditingPartner({
                id: newId(),
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
        ) : tab === "initiatives" ? (
          <InitiativesTab
            opportunities={opportunities}
            mediaMap={mediaMap}
            onEdit={openEditInitiative}
            onDelete={handleDeleteInitiative}
            onNew={() => {
              const id = newId();
              setEditingInitiative({
                id,
                title: "",
                region: "Europe",
                partner_short_names: [],
                status: "active",
                relevance: "",
                occurred_on: new Date().toISOString().slice(0, 10),
                detail: null,
                link: null,
              });
              setEditingMedia({
                opportunity_id: id,
                cover_image_url: null,
                youtube_url: null,
                blog_url: null,
                reading_text: null,
              });
            }}
          />
        ) : (
          <AccountTab authEmail={authEmail} />
        )}
      </main>

      <PartnerEditSheet
        partner={editingPartner}
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

/* ════ LOGIN ════ */

function LoginScreen({ authEmail }: { authEmail: string | null }) {
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  const sendMagicLink = async () => {
    setSending(true);
    setMsg("");
    const emailRedirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: SUPERADMIN_EMAIL,
      options: { emailRedirectTo, shouldCreateUser: true },
    });
    if (error) setMsg(error.message);
    else setMsg(`Magic link sent to ${SUPERADMIN_EMAIL}. Check your inbox.`);
    setSending(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMsg("Signed out.");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-8 shadow-sm space-y-5">
        <div>
          <div className="w-9 h-9 rounded-full copper-grad mb-4" />
          <h1 className="text-display text-2xl font-semibold">Superadmin sign-in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This admin panel is restricted to <span className="font-medium">{SUPERADMIN_EMAIL}</span>.
            Sign in with a magic link sent to that address.
          </p>
        </div>
        {authEmail && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-sm">
            Signed in as <span className="font-medium">{authEmail}</span> — access denied.
            <button onClick={signOut} className="ml-2 underline">
              Sign out
            </button>
          </div>
        )}
        <button
          onClick={sendMagicLink}
          disabled={sending}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: "var(--csrit-gold)" }}
        >
          {sending ? "Sending…" : "Send magic link"}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
        <Link
          to="/"
          className="block text-center text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

/* ════ ACCOUNT TAB ════ */

function AccountTab({ authEmail }: { authEmail: string | null }) {
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <div className="max-w-2xl">
      <h1 className="text-display text-3xl font-semibold mb-2">Account</h1>
      <p className="text-sm text-muted-foreground mb-6">
        You are signed in as the superadmin. All changes you make are saved to the secure database
        and visible to all visitors immediately.
      </p>
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Signed in as</p>
          <p className="mt-1 font-medium">{authEmail}</p>
        </div>
        <button
          onClick={signOut}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/50 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

/* ════ PARTNERS TAB ════ */

function PartnersTab({
  partners,
  onEdit,
  onDelete,
  onNew,
}: {
  partners: StoredPartner[];
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
            Upload logos and manage network partners. Saved to the secure database.
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
      {partners.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No partners yet — click "Add Partner" to create the first one.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {partners.map((p) => (
            <PartnerCard
              key={p.id}
              partner={p}
              onEdit={() => onEdit(p)}
              onDelete={() => {
                if (window.confirm(`Delete ${p.name}?`)) onDelete(p.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PartnerCard({
  partner,
  onEdit,
  onDelete,
}: {
  partner: StoredPartner;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full aspect-square rounded-xl bg-muted/40 grid place-items-center overflow-hidden">
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            className="w-full h-full object-contain p-3"
          />
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
      {opportunities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No initiatives yet — click "Add Initiative" to create the first one.
        </p>
      ) : (
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
      )}
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
          <div className="absolute inset-0 grid place-items-center opacity-30 text-xs">
            no cover
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
  onClose,
  onSave,
}: {
  partner: StoredPartner | null;
  onClose: () => void;
  onSave: (p: StoredPartner) => void;
}) {
  const [form, setForm] = useState<StoredPartner | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (partner) setForm({ ...partner });
  }, [partner]);

  const set = (field: keyof StoredPartner, value: unknown) =>
    setForm((f) => (f ? { ...f, [field]: value } : f));

  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => set("logo_url", reader.result as string);
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
            {partner && partners_isNew(partner.id) ? "New Partner" : "Edit Partner"}
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-5 px-1 pb-10">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Logo
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-xl bg-muted/40 border border-border/60 grid place-items-center overflow-hidden shrink-0 cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                {form.logo_url ? (
                  <img src={form.logo_url} className="w-full h-full object-contain p-2" />
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
                  {form.logo_url ? "Replace Logo" : "Upload Logo"}
                </button>
                {form.logo_url && (
                  <button
                    onClick={() => set("logo_url", null)}
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
            { label: "Name", field: "name" as const, placeholder: "e.g. Massachusetts Institute of Technology" },
            { label: "Short Name", field: "short_name" as const, placeholder: "e.g. MIT" },
            { label: "Country", field: "country" as const, placeholder: "e.g. USA" },
            { label: "Category", field: "category" as const, placeholder: "e.g. University" },
            { label: "Strategic Relevance", field: "strategic_relevance" as const, placeholder: "Brief description..." },
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
            onClick={() => onSave(form)}
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

// helper kept outside to avoid component-name collisions
function partners_isNew(_id: string): boolean {
  return false; // sheet title shown as "Edit"/"New" doesn't depend on this anymore
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
    setCoverPreview(media?.cover_image_url ?? null);
    setYoutubeUrl(media?.youtube_url ?? "");
    setBlogUrl(media?.blog_url ?? "");
    setReadingText(media?.reading_text ?? "");
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
    const finalForm: StoredOpportunity = {
      ...form,
      partner_short_names: partnersInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const finalMedia: InitiativeMedia = {
      opportunity_id: opportunity.id,
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
          <SheetTitle className="text-display text-xl">Edit Initiative</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 px-1 pb-10">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Cover Image
            </label>
            <div
              className="relative w-full aspect-video rounded-xl border-2 border-dashed border-border/60 overflow-hidden cursor-pointer hover:border-[var(--csrit-gold)] transition"
              onClick={() => coverRef.current?.click()}
            >
              {coverPreview ? (
                <img src={coverPreview} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground/40 text-xs">
                  Click to upload cover image
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

          {[
            { label: "Title", field: "title" as const, placeholder: "Initiative title", multiline: false },
            { label: "Relevance / Description", field: "relevance" as const, placeholder: "What this initiative is about...", multiline: true },
            { label: "Detail", field: "detail" as const, placeholder: "More context...", multiline: true },
          ].map(({ label, field, placeholder, multiline }) => (
            <div key={field}>
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                {label}
              </label>
              {multiline ? (
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

          <div className="border-t border-border/40 pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">Media</p>
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className={inputCls}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Blog / Article URL
              </label>
              <input
                type="url"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
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
