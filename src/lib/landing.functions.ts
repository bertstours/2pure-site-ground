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

/* ── Mock fallback data (used when Supabase is not configured) ── */

const MOCK_PARTNERS: Partner[] = [
  {
    id: "p-nasa",
    name: "NASA",
    short_name: "NASA",
    country: "USA",
    region: "North America",
    category: "Space Agency",
    themes: ["Space & Earth Observation", "AI & Sovereign Compute"],
    logo_url: null,
    strategic_relevance:
      "Collaboration on Earth observation, satellite data and space technology transfer.",
    initiatives: ["Satellite Data Partnership", "Deep Space Research"],
    tier: 1,
    sort_order: 1,
  },
  {
    id: "p-mit",
    name: "Massachusetts Institute of Technology",
    short_name: "MIT",
    country: "USA",
    region: "North America",
    category: "University",
    themes: ["AI & Sovereign Compute", "Health & Life Sciences"],
    logo_url: null,
    strategic_relevance: "Joint research in AI, biotech and clean energy innovation.",
    initiatives: ["AI Research Lab", "Health Innovation Programme"],
    tier: 1,
    sort_order: 2,
  },
  {
    id: "p-stanford",
    name: "Stanford University",
    short_name: "Stanford",
    country: "USA",
    region: "North America",
    category: "University",
    themes: ["Deep Tech Startups", "AI & Sovereign Compute"],
    logo_url: null,
    strategic_relevance: "Deep tech startup ecosystem development and AI research collaboration.",
    initiatives: ["Startup Accelerator", "AI Ethics Research"],
    tier: 1,
    sort_order: 3,
  },
  {
    id: "p-g42",
    name: "G42",
    short_name: "G42",
    country: "UAE",
    region: "MENA",
    category: "Technology",
    themes: ["AI & Sovereign Compute", "Digital Transformation"],
    logo_url: null,
    strategic_relevance: "Strategic AI infrastructure and sovereign compute partnership.",
    initiatives: ["Sovereign AI Cluster", "Digital Government"],
    tier: 1,
    sort_order: 4,
  },
  {
    id: "p-esa",
    name: "European Space Agency",
    short_name: "ESA",
    country: "Europe",
    region: "Europe",
    category: "Space Agency",
    themes: ["Space & Earth Observation"],
    logo_url: null,
    strategic_relevance: "European space programme integration and satellite technology.",
    initiatives: ["Earth Observation Hub", "Space Technology Transfer"],
    tier: 1,
    sort_order: 5,
  },
  {
    id: "p-samsung",
    name: "Samsung",
    short_name: "Samsung",
    country: "South Korea",
    region: "Asia",
    category: "Technology",
    themes: ["Digital Transformation", "AI & Sovereign Compute"],
    logo_url: null,
    strategic_relevance: "Advanced manufacturing, semiconductor research and digital innovation.",
    initiatives: ["Semiconductor Research", "Smart Manufacturing"],
    tier: 1,
    sort_order: 6,
  },
  {
    id: "p-microsoft",
    name: "Microsoft",
    short_name: "MSFT",
    country: "USA",
    region: "North America",
    category: "Technology",
    themes: ["Digital Transformation", "AI & Sovereign Compute"],
    logo_url: null,
    strategic_relevance: "Cloud infrastructure, AI services and digital government transformation.",
    initiatives: ["Sovereign Cloud", "AI Government Services"],
    tier: 2,
    sort_order: 7,
  },
  {
    id: "p-nvidia",
    name: "NVIDIA",
    short_name: "NVIDIA",
    country: "USA",
    region: "North America",
    category: "Technology",
    themes: ["AI & Sovereign Compute"],
    logo_url: null,
    strategic_relevance: "GPU infrastructure for AI research and sovereign compute clusters.",
    initiatives: ["National AI Compute"],
    tier: 2,
    sort_order: 8,
  },
  {
    id: "p-kaust",
    name: "KAUST",
    short_name: "KAUST",
    country: "Saudi Arabia",
    region: "MENA",
    category: "University",
    themes: ["Science Diplomacy", "Health & Life Sciences"],
    logo_url: null,
    strategic_relevance: "MENA regional science diplomacy and joint research programmes.",
    initiatives: ["MENA Science Bridge"],
    tier: 2,
    sort_order: 9,
  },
  {
    id: "p-eib",
    name: "European Investment Bank",
    short_name: "EIB",
    country: "Luxembourg",
    region: "Europe",
    category: "Finance",
    themes: ["Deep Tech Startups"],
    logo_url: null,
    strategic_relevance: "Venture funding instruments for deep tech startups and innovation.",
    initiatives: ["Innovation Fund", "Startup Financing"],
    tier: 2,
    sort_order: 10,
  },
  {
    id: "p-ucy",
    name: "University of Cyprus",
    short_name: "UCY",
    country: "Cyprus",
    region: "Europe",
    category: "University",
    themes: ["Health & Life Sciences", "AI & Sovereign Compute"],
    logo_url: null,
    strategic_relevance:
      "National research anchor institution for translational research and talent.",
    initiatives: ["Research Commercialisation", "AI Lab"],
    tier: 2,
    sort_order: 11,
  },
  {
    id: "p-un",
    name: "United Nations",
    short_name: "UN",
    country: "International",
    region: "Europe",
    category: "International Organisation",
    themes: ["Science Diplomacy"],
    logo_url: null,
    strategic_relevance: "Science diplomacy and multilateral innovation governance frameworks.",
    initiatives: ["Innovation Governance"],
    tier: 2,
    sort_order: 12,
  },
];

const MOCK_THEMES: Theme[] = [
  {
    id: "t-1",
    slug: "ai-compute",
    title: "AI & Sovereign Compute",
    focus:
      "Building Cyprus' national AI infrastructure and sovereign compute capabilities to lead in artificial intelligence research and enterprise applications.",
    associated_partner_short_names: ["G42", "NVIDIA", "MSFT", "MIT", "UCY"],
    sort_order: 1,
  },
  {
    id: "t-2",
    slug: "space",
    title: "Space & Earth Observation",
    focus:
      "Leveraging space technology partnerships to advance Earth observation, satellite data analytics and downstream space applications.",
    associated_partner_short_names: ["ESA", "NASA"],
    sort_order: 2,
  },
  {
    id: "t-3",
    slug: "health",
    title: "Health & Life Sciences",
    focus:
      "Building a regional life sciences hub advancing biomedical innovation, clinical research and health technology commercialisation.",
    associated_partner_short_names: ["MIT", "UCY", "KAUST"],
    sort_order: 3,
  },
  {
    id: "t-4",
    slug: "startups",
    title: "Deep Tech Startups",
    focus:
      "Transforming Cyprus into a magnet for deep tech ventures through co-investment frameworks, regulatory sandboxes and global connections.",
    associated_partner_short_names: ["Stanford", "EIB"],
    sort_order: 4,
  },
  {
    id: "t-5",
    slug: "diplomacy",
    title: "Science Diplomacy",
    focus:
      "Positioning Cyprus as the bridge between Europe and MENA for science diplomacy, innovation policy and technology transfer.",
    associated_partner_short_names: ["Samsung", "KAUST", "UN"],
    sort_order: 5,
  },
  {
    id: "t-6",
    slug: "digital",
    title: "Digital Transformation",
    focus:
      "Leading Cyprus' whole-of-government digital transformation from e-services and open data to a sovereign cloud backbone.",
    associated_partner_short_names: ["MSFT", "G42", "Samsung"],
    sort_order: 6,
  },
];

const MOCK_METRICS: Metric[] = [
  {
    id: "m-1",
    slug: "partnerships",
    label: "Active Partnerships",
    value: 28,
    unit: "+",
    caption: "Across 14 nations and 6 continents",
    sort_order: 1,
  },
  {
    id: "m-2",
    slug: "initiatives",
    label: "Strategic Initiatives",
    value: 6,
    unit: null,
    caption: "AI, Space, Health, Diplomacy & more",
    sort_order: 2,
  },
  {
    id: "m-3",
    slug: "nations",
    label: "Nations Engaged",
    value: 14,
    unit: null,
    caption: "From Silicon Valley to Seoul",
    sort_order: 3,
  },
  {
    id: "m-4",
    slug: "ranking",
    label: "EU Innovation Ranking",
    value: 2,
    unit: "nd",
    caption: "Strong Innovator — EU Innovation Scoreboard",
    sort_order: 4,
  },
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Sovereign AI & National Compute",
    region: "Europe",
    partner_short_names: ["G42", "NVIDIA"],
    status: "active",
    relevance:
      "Cyprus is establishing its own national AI compute cluster — a sovereign infrastructure layer protecting data sovereignty while enabling cutting-edge AI research and enterprise applications.",
    occurred_on: "2026-01-15",
    detail:
      "A landmark partnership to deploy a sovereign GPU cluster within Cyprus, managed under national governance frameworks, targeting research institutions, government ministries and enterprise.",
    link: null,
  },
  {
    id: "opp-2",
    title: "Space Technology & Earth Observation",
    region: "Europe",
    partner_short_names: ["ESA", "NASA"],
    status: "active",
    relevance:
      "Cyprus is partnering with ESA and NASA to develop Earth observation capabilities, supporting climate monitoring, maritime surveillance and agricultural analytics.",
    occurred_on: "2026-02-10",
    detail:
      "Joint research programmes in satellite data utilisation and downstream space applications, including a Cyprus-based ground segment facility.",
    link: null,
  },
  {
    id: "opp-3",
    title: "Health Innovation & Life Sciences Hub",
    region: "Europe",
    partner_short_names: ["MIT", "UCY"],
    status: "active",
    relevance:
      "Building a regional life sciences hub with world-class research institutions to advance biomedical innovation, clinical trials and healthcare digital transformation.",
    occurred_on: "2026-01-20",
    detail:
      "Collaborating with MIT's health tech division on translational research pipelines and startup commercialisation, with UCY as the national anchor institution.",
    link: null,
  },
  {
    id: "opp-4",
    title: "Deep Tech Startup Ecosystem",
    region: "Europe",
    partner_short_names: ["Stanford", "EIB"],
    status: "active",
    relevance:
      "Transforming Cyprus into a magnet for deep tech startups through co-investment frameworks, regulatory sandboxes and connections to Silicon Valley expertise.",
    occurred_on: "2026-03-05",
    detail:
      "A structured programme linking Cyprus startups to Stanford's entrepreneurship ecosystem and European Investment Bank venture instruments.",
    link: null,
  },
  {
    id: "opp-5",
    title: "Science Diplomacy & Regional Leadership",
    region: "MENA",
    partner_short_names: ["Samsung", "KAUST"],
    status: "active",
    relevance:
      "Positioning Cyprus as the bridge between Europe and the MENA region for science diplomacy, innovation policy and technology transfer.",
    occurred_on: "2026-02-28",
    detail:
      "Formal science diplomacy agreements enabling joint research programmes and talent exchange with leading MENA and Asian institutions.",
    link: null,
  },
  {
    id: "opp-6",
    title: "Digital Transformation & Sovereign Cloud",
    region: "Europe",
    partner_short_names: ["MSFT"],
    status: "active",
    relevance:
      "Leading Cyprus' whole-of-government digital transformation from e-services and open data to a sovereign cloud backbone protecting national digital assets.",
    occurred_on: "2026-03-15",
    detail:
      "A national programme to digitise public services, implement cloud-native infrastructure and establish digital governance standards aligned with EU requirements.",
    link: null,
  },
];

/* ── Server function ── */

export const getLandingData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    partners: Partner[];
    themes: Theme[];
    metrics: Metric[];
    opportunities: Opportunity[];
  }> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const [partnersR, themesR, metricsR, oppsR] = await Promise.all([
      supabase
        .from("partners" as never)
        .select("*")
        .order("sort_order"),
      supabase
        .from("themes" as never)
        .select("*")
        .order("sort_order"),
      supabase
        .from("metrics" as never)
        .select("*")
        .order("sort_order"),
      supabase
        .from("opportunities" as never)
        .select("*")
        .order("occurred_on", { ascending: false }),
    ]);
    if (partnersR.error) console.error("partners error:", partnersR.error);
    if (themesR.error) console.error("themes error:", themesR.error);
    if (metricsR.error) console.error("metrics error:", metricsR.error);
    if (oppsR.error) console.error("opportunities error:", oppsR.error);

    const partners = (partnersR.data ?? []) as Partner[];
    const themes = (themesR.data ?? []) as Theme[];
    const metrics = (metricsR.data ?? []) as Metric[];
    const opportunities = (oppsR.data ?? []) as Opportunity[];

    return {
      partners: partners.length > 0 ? partners : MOCK_PARTNERS,
      themes: themes.length > 0 ? themes : MOCK_THEMES,
      metrics: metrics.length > 0 ? metrics : MOCK_METRICS,
      opportunities: opportunities.length > 0 ? opportunities : MOCK_OPPORTUNITIES,
    };
  },
);
