"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPO, FadeIn, RevealLines, SectionLabel } from "@/components/ui";
import { useReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrollTrigger);

/* ───────── metrics ───────── */

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.2, ease: EXPO, onUpdate: (v) => setValue(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const METRICS = [
  { value: <CountUp to={1} suffix="+" />, unit: "YEARS", label: "PROFESSIONAL EXPERIENCE" },
  { value: <CountUp to={10} suffix="+" />, unit: "PROJECTS", label: "WEB & SOFTWARE SYSTEMS" },
  { value: "FULL", unit: "-STACK", label: "FRONTEND + BACKEND + DATABASE" },
];

function Metric({ m, i }: { m: (typeof METRICS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <div ref={ref} className="relative pt-6">
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 h-px w-full origin-left bg-line-strong"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 1.2, ease: EXPO, delay: i * 0.12 }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 h-px w-10 bg-electric"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
      />
      <p className="flex items-baseline gap-2 font-display">
        <span className="text-[44px] font-medium leading-none tracking-[-0.04em] md:text-[56px]">{m.value}</span>
        <span className="text-lg font-medium tracking-[-0.01em] text-fg-2 md:text-xl">{m.unit}</span>
      </p>
      <p className="label mt-3">{m.label}</p>
    </div>
  );
}

/* ───────── layered system visual ───────── */

function PlateUI() {
  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-fg/30" />
        <span className="size-1.5 rounded-full bg-fg/30" />
        <span className="size-1.5 rounded-full bg-fg/30" />
        <span className="ml-3 h-1.5 w-24 rounded-full bg-fg/10" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        <div className="col-span-2 rounded-md border border-line bg-white/[0.03] p-2">
          <svg viewBox="0 0 120 50" className="h-full w-full" preserveAspectRatio="none">
            <polyline points="0,40 18,34 34,38 52,22 70,26 88,12 104,16 120,6" fill="none" stroke="#22D3EE" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex-1 rounded-md border border-line bg-electric/15" />
          <div className="flex-1 rounded-md border border-line bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}

function PlateAPI() {
  const rows = [
    ["GET", "/api/patients", "200"],
    ["POST", "/api/orders", "201"],
    ["PUT", "/api/inventory", "200"],
    ["GET", "/api/reports", "200"],
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-4 font-mono text-[9px] tracking-[0.06em]">
      {rows.map(([m, p, s]) => (
        <div key={p} className="flex items-center gap-2 rounded border border-line bg-white/[0.02] px-2 py-1.5">
          <span className="w-8 text-cyan">{m}</span>
          <span className="flex-1 text-fg-2">{p}</span>
          <span className="text-signal">{s}</span>
        </div>
      ))}
    </div>
  );
}

function PlateDB() {
  return (
    <div className="grid h-full grid-cols-4 grid-rows-4 gap-1.5 p-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className={`rounded-sm border border-line ${i % 5 === 0 ? "bg-violet/25" : i % 3 === 0 ? "bg-electric/15" : "bg-white/[0.03]"}`}
        />
      ))}
    </div>
  );
}

const PLATES = [
  { key: "db", label: "DATABASE · MONGODB / MYSQL", tint: "rgba(139,92,246,0.10)", border: "rgba(139,92,246,0.35)", body: <PlateDB /> },
  { key: "api", label: "API · NODE + EXPRESS", tint: "rgba(34,211,238,0.07)", border: "rgba(34,211,238,0.3)", body: <PlateAPI /> },
  { key: "ui", label: "UI · REACT / NEXT.JS", tint: "rgba(61,123,255,0.10)", border: "rgba(61,123,255,0.4)", body: <PlateUI /> },
];

function LayerStack() {
  const wrap = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = stack.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { "--gap": "22px", "--rx": "58deg" },
        {
          "--gap": "96px",
          "--rx": "40deg",
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top 85%", end: "bottom 30%", scrub: 1 },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, [reduced]);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse" || !stack.current || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stack.current.style.setProperty("--tx", `${x * 12}deg`);
    stack.current.style.setProperty("--ty", `${-y * 10}deg`);
  };
  const onLeave = () => {
    stack.current?.style.setProperty("--tx", "0deg");
    stack.current?.style.setProperty("--ty", "0deg");
  };

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
      className="relative flex h-[440px] items-center justify-center [perspective:1400px] md:h-[560px]"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(61,123,255,0.16), rgba(139,92,246,0.05) 45%, transparent 70%)" }}
      />
      <div
        ref={stack}
        className="relative h-[190px] w-[270px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] md:h-[220px] md:w-[320px]"
        style={
          {
            "--gap": "22px",
            "--rx": "58deg",
            "--tx": "0deg",
            "--ty": "0deg",
            transform: "rotateX(calc(var(--rx) + var(--ty))) rotateZ(calc(-38deg + var(--tx)))",
          } as React.CSSProperties
        }
      >
        {PLATES.map((p, i) => (
          <div
            key={p.key}
            className="absolute inset-0 rounded-xl backdrop-blur-sm"
            style={{
              transform: `translateZ(calc(var(--gap) * ${i - 1}))`,
              background: `linear-gradient(135deg, ${p.tint}, rgba(10,12,18,0.72))`,
              border: `1px solid ${p.border}`,
              boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)",
            }}
          >
            {p.body}
            <span className="absolute -bottom-6 left-0 font-mono text-[10px] tracking-[0.14em] text-fg-3">{p.label}</span>
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="absolute bottom-2 right-0 flex flex-col items-end gap-1.5 font-mono text-[10px] tracking-[0.14em] text-fg-3 md:bottom-6">
        <span className="text-fg-2">03 LAYERS · ONE SYSTEM</span>
        <span>UI → API → DATA</span>
      </div>
    </div>
  );
}

/* ───────── section ───────── */

export default function About() {
  return (
    <section id="about" aria-label="About" className="relative overflow-hidden py-28 md:py-40">
      <div className="container-x grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <SectionLabel index="02">INTRODUCTION</SectionLabel>

          <RevealLines
            as="h2"
            className="mt-8 font-display text-[clamp(44px,8vw,112px)] font-semibold leading-[0.92] tracking-[-0.04em]"
            lines={[
              "I BUILD",
              <>
                <span className="text-aura">REAL</span> SOFTWARE
              </>,
              <span key="l3" className="text-fg-2">FOR REAL SYSTEMS.</span>,
            ]}
          />

          <FadeIn delay={0.2} className="mt-10 flex max-w-[560px] flex-col gap-6">
            <p className="text-[17px] leading-relaxed text-fg-2 md:text-xl md:leading-[1.55]">
              Full-Stack Developer with professional experience building scalable web applications, SaaS platforms, healthcare
              systems, business management systems and modern user experiences.
            </p>
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-electric/40 bg-electric/10 px-4 py-2 font-mono text-xs tracking-[0.14em] text-fg">
              <span className="size-1.5 rounded-full bg-electric shadow-[0_0_10px_#3d7bff]" aria-hidden="true" />
              1+ YEAR EXPERIENCE
            </span>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {METRICS.map((m, i) => (
              <Metric key={m.label} m={m} i={i} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <LayerStack />
        </div>
      </div>
    </section>
  );
}
