import { useRef, useEffect, useState, useCallback } from "react";

/* ─── Organisation data ─── */
interface OrgNode {
  id: string;
  name: string;
  abbr: string;          // short label rendered inside the node
  country: string;
  category: string;
  initiatives: string[];
  relevance: string;
  color: string;         // hsl accent for node halo
}

const CATEGORY_COLORS: Record<string, string> = {
  "Space Agency":       "hsl(30, 85%, 55%)",
  University:           "hsl(210, 70%, 55%)",
  Policy:               "hsl(260, 60%, 58%)",
  "Corporate Lab":      "hsl(340, 65%, 55%)",
  Company:              "hsl(165, 60%, 42%)",
  Venture:              "hsl(45, 80%, 50%)",
  "Innovation Hub":     "hsl(190, 70%, 48%)",
  Accelerator:          "hsl(15, 75%, 55%)",
  Government:           "hsl(220, 55%, 52%)",
  Agency:               "hsl(280, 55%, 52%)",
  "Research Institute": "hsl(140, 55%, 42%)",
  Foundation:           "hsl(55, 70%, 48%)",
  "Investment Agency":  "hsl(80, 55%, 45%)",
  Host:                 "hsl(38, 90%, 55%)",
};

function colorFor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "hsl(0, 0%, 55%)";
}

const ORG_NODES: OrgNode[] = [
  { id: "nasa",       abbr: "NASA",       name: "NASA",                                 country: "USA",         category: "Space Agency",       initiatives: ["Artemis Accords", "Deep Space Gateway"],               relevance: "Strategic space partner",                     color: colorFor("Space Agency") },
  { id: "mit",        abbr: "MIT",        name: "MIT",                                  country: "USA",         category: "University",         initiatives: ["AI Research Exchange", "Joint Fellowships"],           relevance: "Research collaboration in AI & quantum",     color: colorFor("University") },
  { id: "stanford",   abbr: "Stanford",   name: "Stanford University",                  country: "USA",         category: "University",         initiatives: ["Innovation Hub Link", "Faculty Exchange"],             relevance: "Research collaboration & tech transfer",     color: colorFor("University") },
  { id: "harvard",    abbr: "Harvard",    name: "Harvard University",                   country: "USA",         category: "University",         initiatives: ["Policy Research", "Governance Studies"],               relevance: "Governance & policy research",               color: colorFor("University") },
  { id: "columbia",   abbr: "Columbia",   name: "Columbia University",                  country: "USA",         category: "University",         initiatives: ["Data Science Alliance"],                               relevance: "Research collaboration",                     color: colorFor("University") },
  { id: "nwestern",   abbr: "NWU",        name: "Northwestern University",              country: "USA",         category: "University",         initiatives: ["Materials Science", "Nanotech Partnership"],           relevance: "Research collaboration",                     color: colorFor("University") },
  { id: "esa",        abbr: "ESA",        name: "European Space Agency",                country: "Europe",      category: "Space Agency",       initiatives: ["Copernicus", "Space Safety Programme"],                relevance: "Strategic space partner",                     color: colorFor("Space Agency") },
  { id: "ec",         abbr: "EU",         name: "European Commission",                  country: "EU",          category: "Policy",             initiatives: ["Horizon Europe", "Digital Europe Programme"],          relevance: "Funding & policy partner",                   color: colorFor("Policy") },
  { id: "samsung",    abbr: "Samsung",    name: "Samsung Research",                     country: "South Korea", category: "Corporate Lab",      initiatives: ["6G Research", "AI Chip Design"],                       relevance: "Technology R&D partner",                     color: colorFor("Corporate Lab") },
  { id: "lg",         abbr: "LG AI",      name: "LG AI Research",                       country: "South Korea", category: "Corporate Lab",      initiatives: ["Responsible AI", "Edge Computing"],                    relevance: "AI research partner",                        color: colorFor("Corporate Lab") },
  { id: "g42",        abbr: "G42",        name: "G42",                                  country: "UAE",         category: "Company",            initiatives: ["Sovereign AI", "Cloud Infrastructure"],                relevance: "Strategic AI partner",                       color: colorFor("Company") },
  { id: "m42",        abbr: "M42",        name: "M42",                                  country: "UAE",         category: "Company",            initiatives: ["Health AI", "Digital Health Corridor"],                 relevance: "Health tech strategic partner",              color: colorFor("Company") },
  { id: "khazna",     abbr: "Khazna",     name: "Khazna",                               country: "UAE",         category: "Venture",            initiatives: ["Data Centre Hub", "Digital Infrastructure"],            relevance: "Investment & infrastructure partner",        color: colorFor("Venture") },
  { id: "hub71",      abbr: "Hub71",      name: "Hub71",                                country: "UAE",         category: "Innovation Hub",     initiatives: ["Startup Exchange", "Soft Landing Programme"],           relevance: "Ecosystem & startup partner",                color: colorFor("Innovation Hub") },
  { id: "plugplay",   abbr: "P&P",        name: "Plug and Play",                        country: "USA",         category: "Accelerator",        initiatives: ["Batch Programme", "Corporate Innovation"],              relevance: "Startup gateway & accelerator",              color: colorFor("Accelerator") },
  { id: "iitb",       abbr: "IIT-B",      name: "IIT Bombay",                           country: "India",       category: "University",         initiatives: ["Deep Tech Research", "Student Exchange"],               relevance: "Research partner in deep tech",              color: colorFor("University") },
  { id: "isro",       abbr: "ISRO",       name: "ISRO",                                 country: "India",       category: "Space Agency",       initiatives: ["Satellite Cooperation", "Space Data Exchange"],         relevance: "Strategic space partner",                     color: colorFor("Space Agency") },
  { id: "reliance",   abbr: "Jio",        name: "Reliance Jio",                         country: "India",       category: "Company",            initiatives: ["5G Corridor", "Digital Infrastructure"],                relevance: "Connectivity & digital partner",             color: colorFor("Company") },
  { id: "israel_ia",  abbr: "IIA",        name: "Israel Innovation Authority",           country: "Israel",      category: "Government",         initiatives: ["Bilateral R&D Fund", "Joint Innovation Calls"],         relevance: "Innovation funding partner",                 color: colorFor("Government") },
  { id: "sony",       abbr: "Sony",       name: "Sony Research",                        country: "Japan",       category: "Corporate Lab",      initiatives: ["Immersive Tech", "Sensor R&D"],                        relevance: "Tech R&D partner",                           color: colorFor("Corporate Lab") },
  { id: "jst",        abbr: "JST",        name: "Japan Science & Technology Agency",     country: "Japan",       category: "Agency",             initiatives: ["CREST Programme", "Joint Research"],                    relevance: "Science funding partner",                    color: colorFor("Agency") },
  { id: "riken",      abbr: "RIKEN",      name: "RIKEN",                                country: "Japan",       category: "Research Institute", initiatives: ["Quantum Computing", "Supercomputing"],                  relevance: "Scientific research partner",                color: colorFor("Research Institute") },
  { id: "nedo",       abbr: "NEDO",       name: "NEDO",                                 country: "Japan",       category: "Agency",             initiatives: ["Energy Innovation", "Green Hydrogen"],                  relevance: "Innovation & energy partner",                color: colorFor("Agency") },
  { id: "melbourne",  abbr: "UoM",        name: "University of Melbourne",              country: "Australia",   category: "University",         initiatives: ["Biomedical Research", "AI Ethics"],                     relevance: "Research collaboration",                     color: colorFor("University") },
  { id: "tenstor",    abbr: "TT",         name: "Tenstorrent",                          country: "Canada",      category: "Company",            initiatives: ["RISC-V Compute", "AI Hardware"],                        relevance: "Hardware & compute partner",                 color: colorFor("Company") },
  { id: "rifc",       abbr: "RIF",        name: "Research & Innovation Foundation Cyprus", country: "Cyprus",   category: "Foundation",         initiatives: ["RESTART Programmes", "INNOVATE Cyprus"],                relevance: "National R&I catalyst",                      color: colorFor("Foundation") },
  { id: "investcy",   abbr: "IC",         name: "Invest Cyprus",                        country: "Cyprus",      category: "Investment Agency",  initiatives: ["FDI Attraction", "Tech Company Relocation"],            relevance: "Economic & investment partner",              color: colorFor("Investment Agency") },
];

/* ─── Particle on a connection line ─── */
interface Particle { progress: number; speed: number; }

/* ─── Laid-out node with screen position ─── */
interface LayoutNode extends OrgNode {
  x: number;
  y: number;
  radius: number;
  ring: number;       // 0 = center, 1 = inner, 2 = outer
  angle: number;
  hoverScale: number; // animate on hover
}

/* ─── Canvas-rendered animated network ─── */
export default function GlobalInnovationMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<LayoutNode[]>([]);
  const particlesRef = useRef<Map<string, Particle[]>>(new Map());
  const mouseRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: OrgNode } | null>(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });

  /* ── Layout nodes in concentric rings ── */
  const layoutNodes = useCallback((w: number, h: number): LayoutNode[] => {
    const cx = w / 2;
    const cy = h / 2;
    const minDim = Math.min(w, h);

    // Cyprus center node
    const cyprusNode: LayoutNode = {
      id: "cyprus", name: "CYPRUS", abbr: "CY", country: "Cyprus",
      category: "Host", initiatives: ["Research & Innovation Foundation Cyprus", "Invest Cyprus"],
      relevance: "Core hub", color: colorFor("Host"),
      x: cx, y: cy, radius: minDim * 0.055, ring: 0, angle: 0, hoverScale: 1,
    };

    // Split organisations into 2 rings
    const half = Math.ceil(ORG_NODES.length / 2);
    const innerOrgs = ORG_NODES.slice(0, half);
    const outerOrgs = ORG_NODES.slice(half);

    const innerR = minDim * 0.24;
    const outerR = minDim * 0.42;
    const nodeSize = minDim * 0.032;

    const innerNodes: LayoutNode[] = innerOrgs.map((org, i) => {
      const angle = (i / innerOrgs.length) * Math.PI * 2 - Math.PI / 2;
      return {
        ...org,
        x: cx + Math.cos(angle) * innerR,
        y: cy + Math.sin(angle) * innerR,
        radius: nodeSize,
        ring: 1,
        angle,
        hoverScale: 1,
      };
    });

    const outerNodes: LayoutNode[] = outerOrgs.map((org, i) => {
      const angle = (i / outerOrgs.length) * Math.PI * 2 - Math.PI / 2 + 0.15;
      return {
        ...org,
        x: cx + Math.cos(angle) * outerR,
        y: cy + Math.sin(angle) * outerR,
        radius: nodeSize * 0.85,
        ring: 2,
        angle,
        hoverScale: 1,
      };
    });

    return [cyprusNode, ...innerNodes, ...outerNodes];
  }, []);

  /* ── Initialise particles ── */
  const initParticles = useCallback((nodes: LayoutNode[]) => {
    const pMap = new Map<string, Particle[]>();
    for (let i = 1; i < nodes.length; i++) {
      const count = 2 + Math.floor(Math.random() * 2);
      const arr: Particle[] = [];
      for (let j = 0; j < count; j++) {
        arr.push({ progress: Math.random(), speed: 0.001 + Math.random() * 0.002 });
      }
      pMap.set(nodes[i].id, arr);
    }
    return pMap;
  }, []);

  /* ── Resize observer ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      const h = Math.min(width * 0.65, 650);
      setDims({ w: width, h });
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  /* ── Re-layout when dims change ── */
  useEffect(() => {
    const nodes = layoutNodes(dims.w, dims.h);
    nodesRef.current = nodes;
    if (particlesRef.current.size === 0) {
      particlesRef.current = initParticles(nodes);
    }
  }, [dims, layoutNodes, initParticles]);

  /* ── Main animation loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let time = 0;

    function draw() {
      if (!running || !ctx) return;
      time += 0.016;
      const { w, h } = dims;
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      if (nodes.length === 0) { animRef.current = requestAnimationFrame(draw); return; }
      const center = nodes[0];

      /* ── Draw orbit rings ── */
      const minDim = Math.min(w, h);
      [minDim * 0.24, minDim * 0.42].forEach((r, ri) => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = ri === 0 ? "rgba(180,155,100,0.12)" : "rgba(180,155,100,0.07)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      /* ── Draw connection lines & particles ── */
      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i];
        const dx = node.x - center.x;
        const dy = node.y - center.y;

        // Connection line — gradient
        const grad = ctx.createLinearGradient(center.x, center.y, node.x, node.y);
        grad.addColorStop(0, "rgba(180,155,100,0.25)");
        grad.addColorStop(0.5, node.color + "44");
        grad.addColorStop(1, node.color + "66");
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = node.hoverScale > 1.05 ? 2 : 0.8;
        ctx.stroke();

        // Flowing particles
        const parts = particlesRef.current.get(node.id);
        if (parts) {
          for (const p of parts) {
            p.progress = (p.progress + p.speed) % 1;
            const px = center.x + dx * p.progress;
            const py = center.y + dy * p.progress;
            const pr = 1.5 + Math.sin(p.progress * Math.PI) * 1.5;
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.fillStyle = node.color + "bb";
            ctx.fill();
          }
        }
      }

      /* ── Draw outer nodes ── */
      for (let i = nodes.length - 1; i >= 1; i--) {
        const n = nodes[i];
        const r = n.radius * n.hoverScale;
        const pulse = 1 + Math.sin(time * 2 + n.angle * 3) * 0.08;

        // Outer glow
        const glow = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, r * 2.5 * pulse);
        glow.addColorStop(0, n.color + "30");
        glow.addColorStop(1, n.color + "00");
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // White filled circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.hoverScale > 1.05 ? "#fff" : "rgba(255,255,255,0.92)";
        ctx.fill();

        // Colored border ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = n.color;
        ctx.lineWidth = n.hoverScale > 1.05 ? 2.5 : 1.5;
        ctx.stroke();

        // Label
        const fontSize = Math.max(8, r * 0.65);
        ctx.font = `600 ${fontSize}px "Space Grotesk", "Geist", sans-serif`;
        ctx.fillStyle = "rgba(30,30,30,0.85)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.abbr, n.x, n.y);
      }

      /* ── Draw center Cyprus node ── */
      {
        const r = center.radius;
        const pulse = 1 + Math.sin(time * 1.5) * 0.05;

        // Grand glow
        const glow = ctx.createRadialGradient(center.x, center.y, r * 0.3, center.x, center.y, r * 3.5 * pulse);
        glow.addColorStop(0, "rgba(200,165,80,0.35)");
        glow.addColorStop(0.5, "rgba(200,165,80,0.12)");
        glow.addColorStop(1, "rgba(200,165,80,0)");
        ctx.beginPath();
        ctx.arc(center.x, center.y, r * 3.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Gradient fill
        const cg = ctx.createRadialGradient(center.x - r * 0.3, center.y - r * 0.3, 0, center.x, center.y, r);
        cg.addColorStop(0, "hsl(38, 80%, 65%)");
        cg.addColorStop(1, "hsl(30, 75%, 48%)");
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();

        // Subtle ring
        ctx.beginPath();
        ctx.arc(center.x, center.y, r + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Labels
        const fs1 = r * 0.32;
        ctx.font = `500 ${fs1}px "Space Grotesk", "Geist", sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Republic of", center.x, center.y - r * 0.2);

        const fs2 = r * 0.55;
        ctx.font = `700 ${fs2}px "Space Grotesk", "Geist", sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.fillText("CYPRUS", center.x, center.y + r * 0.18);
      }

      // Hover detection — smooth scale animation
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      let hoveredNode: LayoutNode | null = null;
      for (let i = 1; i < nodes.length; i++) {
        const n = nodes[i];
        const dist = Math.hypot(n.x - mx, n.y - my);
        const target = dist < n.radius * 1.8 ? 1.25 : 1;
        n.hoverScale += (target - n.hoverScale) * 0.15;
        if (dist < n.radius * 1.8) hoveredNode = n;
      }
      if (hoveredNode) {
        canvas!.style.cursor = "pointer";
      } else {
        canvas!.style.cursor = "default";
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [dims]);

  /* ── Mouse event handlers ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y };

    const nodes = nodesRef.current;
    let found: LayoutNode | null = null;
    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      if (Math.hypot(n.x - x, n.y - y) < n.radius * 1.8) { found = n; break; }
    }
    if (found) {
      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, node: found });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -999, y: -999 };
    setTooltip(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nodes = nodesRef.current;
    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      if (Math.hypot(n.x - x, n.y - y) < n.radius * 1.8) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(n.name)}`, "_blank");
        break;
      }
    }
  }, []);

  return (
    <section id="global-innovation-map" className="relative z-10 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--csrit-gold)" }}>
              Global Ecosystem
            </p>
            <h2 className="text-display text-4xl md:text-6xl mt-3 leading-[0.98]">
              Cyprus at the <span className="italic aurora-text">centre</span> of innovation.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Click any node to explore the organisation. Hover to reveal country, category, and strategic relevance to Cyprus.
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative rounded-[2.5rem] glass shadow-float overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(255,252,245,0.85), rgba(245,250,255,0.85))" }}
        >
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <canvas
            ref={canvasRef}
            style={{ width: dims.w, height: dims.h, display: "block" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          />
          {/* Tooltip overlay */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-30 rounded-xl shadow-lg backdrop-blur-md"
              style={{
                left: Math.min(tooltip.x + 16, dims.w - 260),
                top: Math.max(tooltip.y - 10, 8),
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(200,180,140,0.3)",
                maxWidth: 250,
                padding: "12px 14px",
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: tooltip.node.color }}
                />
                <span className="font-semibold text-sm" style={{ color: "var(--csrit-gold)" }}>
                  {tooltip.node.name}
                </span>
              </div>
              <div className="text-xs space-y-0.5" style={{ color: "rgba(30,30,30,0.75)" }}>
                <p><strong>Country:</strong> {tooltip.node.country}</p>
                <p><strong>Category:</strong> {tooltip.node.category}</p>
                {tooltip.node.initiatives.length > 0 && (
                  <p><strong>Initiatives:</strong> {tooltip.node.initiatives.join(", ")}</p>
                )}
                <p><strong>Relevance:</strong> {tooltip.node.relevance}</p>
              </div>
            </div>
          )}

          {/* Category legend */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
            {Object.entries(CATEGORY_COLORS).filter(([k]) => k !== "Host").map(([cat, col]) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(200,180,140,0.2)",
                  color: "rgba(30,30,30,0.7)",
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col }} />
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
