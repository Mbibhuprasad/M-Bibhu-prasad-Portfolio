"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { technologies, type Tech, type Tier } from "@/lib/data";
import { EXPO, FadeIn, RevealLines, SectionLabel } from "@/components/ui";
import { useIsMobile, useReducedMotion } from "@/lib/hooks";

/** Links between primary tools and the tools around them. */
const RELATIONS: [string, string][] = [
  ["react", "js"],
  ["react", "ts"],
  ["react", "rn"],
  ["next", "ts"],
  ["next", "aws"],
  ["node", "rest"],
  ["node", "github"],
  ["express", "rest"],
  ["express", "jwt"],
  ["mongodb", "aws"],
  ["mysql", "aws"],
  ["node", "openai"],
  ["node", "gemini"],
  ["python", "rag"],
  ["python", "agents"],
  ["rag", "openai"],
  ["agents", "gemini"],
];

type Ring = { ids: string[]; radius: number; period: number; dir: 1 | -1; offset: number };

const byId = new Map(technologies.map((t) => [t.id, t]));
const ids = (tier: Tier) => technologies.filter((t) => t.tier === tier).map((t) => t.id);

const EDGES: [string, string][] = [
  ...ids("primary").map((id) => ["core", id] as [string, string]),
  ...RELATIONS.filter(([a, b]) => byId.has(a) && byId.has(b)),
];

const NEIGHBOURS = (() => {
  const m = new Map<string, Set<string>>();
  for (const [a, b] of EDGES) {
    if (!m.has(a)) m.set(a, new Set());
    if (!m.has(b)) m.set(b, new Set());
    m.get(a)!.add(b);
    m.get(b)!.add(a);
  }
  return m;
})();

function buildRings(size: number, mobile: boolean): Ring[] {
  if (mobile) {
    return [
      { ids: ids("primary"), radius: size * 0.25, period: 30, dir: 1, offset: -Math.PI / 2 },
      { ids: [...ids("secondary"), ...ids("ai")], radius: size * 0.435, period: 48, dir: -1, offset: -Math.PI / 2 + 0.2 },
    ];
  }
  const k = size / 900;
  return [
    { ids: ids("primary"), radius: 170 * k, period: 30, dir: 1, offset: -Math.PI / 2 },
    { ids: ids("secondary"), radius: 290 * k, period: 48, dir: 1, offset: -Math.PI / 2 + Math.PI / 8 },
    { ids: ids("ai"), radius: 390 * k, period: 64, dir: -1, offset: Math.PI / 4 },
  ];
}

function positions(rings: Ring[], angles: number[]) {
  const out: Record<string, { x: number; y: number }> = { core: { x: 0, y: 0 } };
  rings.forEach((ring, ri) => {
    const n = ring.ids.length;
    ring.ids.forEach((id, i) => {
      const a = ring.offset + (i / n) * Math.PI * 2 + (angles[ri] ?? 0);
      out[id] = { x: Math.cos(a) * ring.radius, y: Math.sin(a) * ring.radius };
    });
  });
  return out;
}

const nodeTransform = (p: { x: number; y: number }) =>
  `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) translate(-50%, -50%)`;

const tierLabel: Record<Tier, string> = { primary: "Primary", secondary: "Secondary", ai: "AI" };
const tierDot: Record<Tier, string> = {
  primary: "bg-electric shadow-[0_0_10px_#3d7bff]",
  secondary: "bg-cyan shadow-[0_0_10px_#22d3ee]",
  ai: "bg-violet shadow-[0_0_10px_#8b5cf6]",
};

export default function Galaxy() {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(900);
  const [selected, setSelected] = useState<Tech>(byId.get("react")!);
  const [hover, setHover] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const rings = useMemo(() => buildRings(size, mobile), [size, mobile]);
  const basePos = useMemo(() => positions(rings, rings.map(() => 0)), [rings]);

  // imperative animation state
  const angles = useRef<number[]>([0, 0, 0]);
  const speed = useRef(1);
  const target = useRef(1);
  const ringsRef = useRef(rings);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const edgeRefs = useRef<(SVGLineElement | null)[]>([]);

  const apply = useCallback(() => {
    const p = positions(ringsRef.current, angles.current);
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      if (el && p[id]) el.style.transform = nodeTransform(p[id]);
    }
    EDGES.forEach(([a, b], i) => {
      const el = edgeRefs.current[i];
      if (!el || !p[a] || !p[b]) return;
      el.setAttribute("x1", p[a].x.toFixed(2));
      el.setAttribute("y1", p[a].y.toFixed(2));
      el.setAttribute("x2", p[b].x.toFixed(2));
      el.setAttribute("y2", p[b].y.toFixed(2));
    });
  }, []);

  // measure stage
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    ringsRef.current = rings;
    apply();
  }, [rings, apply]);

  useEffect(() => {
    target.current = paused || reduced ? 0 : 1;
    if (reduced) speed.current = 0;
  }, [paused, reduced]);

  // orbit loop — only while on screen
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      speed.current += (target.current - speed.current) * Math.min(1, dt * 2.5);
      ringsRef.current.forEach((ring, ri) => {
        angles.current[ri] = (angles.current[ri] ?? 0) + ring.dir * speed.current * dt * ((Math.PI * 2) / ring.period);
      });
      apply();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [apply]);

  const focus = hover ?? selected.id;
  const near = NEIGHBOURS.get(focus) ?? new Set<string>();

  const select = (t: Tech) => {
    setSelected(t);
    setPaused(true);
  };

  return (
    <section id="stack" className="relative overflow-hidden py-28 md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(61,123,255,0.12)_0%,rgba(139,92,246,0.05)_40%,transparent_70%)]"
      />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6">
            <SectionLabel index="03">STACK</SectionLabel>
            <RevealLines
              lines={["TECHNOLOGY", "GALAXY"]}
              className="font-display text-[56px] font-medium leading-[0.92] tracking-[-0.04em] md:text-[96px]"
              lineClassName={(i) => (i === 1 ? "text-outline" : "")}
            />
          </div>
          <FadeIn className="max-w-sm">
            <p className="text-[15px] leading-relaxed text-fg-2 md:text-base">
              The tools I reach for most sit closest to the core. {mobile ? "Tap" : "Click"} any node to see where it&apos;s been used.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 font-mono text-[11px] tracking-[0.14em] text-fg-3">
              {(["primary", "secondary", "ai"] as Tier[]).map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className={`size-1.5 rounded-full ${tierDot[t]}`} /> {tierLabel[t].toUpperCase()}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 grid items-center gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          {/* stage */}
          <div ref={stageRef} className="relative mx-auto aspect-square w-full max-w-[440px] md:max-w-[900px]">
            <svg
              className="absolute inset-0 size-full overflow-visible"
              viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
              aria-hidden="true"
            >
              {rings.map((r, i) => (
                <circle
                  key={i}
                  r={r.radius}
                  fill="none"
                  stroke={i === 2 ? "rgba(139,92,246,0.22)" : "rgba(242,244,248,0.08)"}
                  strokeDasharray={i === 0 ? undefined : "2 6"}
                />
              ))}
              {EDGES.map(([a, b], i) => {
                const lit = a === focus || b === focus;
                const pa = basePos[a];
                const pb = basePos[b];
                if (!pa || !pb) return null;
                return (
                  <line
                    key={`${a}-${b}`}
                    ref={(el) => {
                      edgeRefs.current[i] = el;
                    }}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke={lit ? "url(#g-edge)" : "rgba(125,160,255,1)"}
                    strokeWidth={lit ? 1.4 : 1}
                    style={{ opacity: lit ? 0.9 : hover ? 0.05 : 0.15, transition: "opacity .4s" }}
                  />
                );
              })}
              <defs>
                <linearGradient id="g-edge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3d7bff" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>

            {/* core */}
            <div className="absolute left-1/2 top-1/2 grid size-[84px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.55),rgba(61,123,255,0.25)_55%,rgba(5,6,10,0.9)_100%)] shadow-[0_0_60px_rgba(61,123,255,0.35)] md:size-[128px]">
              <span className="absolute inset-[-10px] rounded-full border border-dashed border-white/10" aria-hidden="true" />
              <span className="font-display text-sm font-semibold tracking-[0.12em] md:text-lg">BIBHU</span>
            </div>

            {/* nodes */}
            <div className="absolute left-1/2 top-1/2 size-0">
              {rings.flatMap((r) => r.ids).map((id) => {
                const t = byId.get(id)!;
                const isSel = selected.id === id;
                const dim = hover !== null && hover !== id && !near.has(id);
                const primary = t.tier === "primary";
                return (
                  <button
                    key={id}
                    type="button"
                    ref={(el) => {
                      nodeRefs.current[id] = el;
                    }}
                    onClick={() => select(t)}
                    onPointerEnter={() => setHover(id)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(id)}
                    onBlur={() => setHover(null)}
                    aria-pressed={isSel}
                    aria-label={`${t.name}: ${t.category}`}
                    className="group absolute left-0 top-0 will-change-transform"
                    style={{ transform: nodeTransform(basePos[id] ?? { x: 0, y: 0 }), opacity: dim ? 0.3 : 1, transition: "opacity .4s" }}
                  >
                    <span
                      className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border font-mono backdrop-blur transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-120 group-focus-visible:scale-120 ${
                        primary ? "px-3 py-1.5 text-[11px] md:px-3.5 md:py-2 md:text-[13px]" : "px-2 py-1 text-[10px] md:px-3 md:py-1.5 md:text-xs"
                      } ${
                        isSel
                          ? "scale-110 border-fg/70 bg-fg/10 text-fg"
                          : t.tier === "ai"
                            ? "border-violet/40 bg-ink/80 text-[#d7dbe5]"
                            : "border-line bg-ink/80 text-[#d7dbe5]"
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${tierDot[t.tier]}`} aria-hidden="true" />
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* detail panel */}
          <div className="relative min-h-[360px] lg:min-h-[440px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={selected.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: EXPO }}
                className="glass relative overflow-hidden rounded-[20px] p-7 md:p-8"
                aria-live="polite"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-electric/15 blur-3xl" aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <span className="label">Selected node</span>
                  <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-fg-2">
                    <span className={`size-1.5 rounded-full ${tierDot[selected.tier]}`} />
                    {tierLabel[selected.tier].toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-[40px] font-medium leading-none tracking-[-0.03em] md:text-[48px]">
                  {selected.name.toUpperCase()}
                </h3>
                <p className="mt-3 text-fg-2">{selected.category}</p>

                <div className="mt-8 border-t border-line pt-6">
                  <span className="label">Used in</span>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {selected.usedIn.map((p, i) => (
                      <li key={p} className="flex items-baseline gap-3">
                        <span className="font-mono text-[11px] text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-[15px]">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-6">
                  <div>
                    <span className="label">Experience</span>
                    <p className="mt-2 font-display text-xl">{selected.experience}</p>
                  </div>
                  <div>
                    <span className="label">Tier</span>
                    <p className="mt-2 font-display text-xl">{tierLabel[selected.tier]}</p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>

            {paused && !reduced && (
              <button
                type="button"
                onClick={() => setPaused(false)}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 font-mono text-[11px] tracking-[0.14em] text-fg-2 transition-colors hover:text-fg"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                RESUME ORBIT
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
