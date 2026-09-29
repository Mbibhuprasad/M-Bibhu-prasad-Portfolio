"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { animate, motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPO, FadeIn, RevealLines, SectionLabel } from "@/components/ui";
import { useIsDesktop, useIsMobile, useReducedMotion } from "@/lib/hooks";
import { useTheme } from "@/lib/theme";

gsap.registerPlugin(ScrollTrigger);

const IntroScene = dynamic(() => import("@/components/IntroScene"), { ssr: false });

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

/* ───────── backdrop ───────── */

/** Dark-blue field with drifting light, a faint grid, circuit lines and one small orange accent. CSS only. */
function IntroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent, rgb(61 123 255 / 0.05) 45%, transparent)" }}
      />
      {/* drifting light */}
      <div
        className="intro-drift-a absolute -right-[10%] top-[8%] size-[70vw] max-w-[900px] rounded-full blur-3xl lg:size-[56vw]"
        style={{ background: "radial-gradient(circle, rgb(61 123 255 / 0.16), rgb(139 92 246 / 0.05) 45%, transparent 70%)" }}
      />
      <div
        className="intro-drift-b absolute bottom-[4%] right-[22%] size-[32vw] max-w-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(34 211 238 / 0.08), transparent 70%)" }}
      />
      <div
        className="intro-drift-b absolute right-[14%] top-[30%] size-[14vw] max-w-[200px] rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%)" }}
      />
      {/* faint grid, strongest on the right */}
      <div
        className="absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_60%_70%_at_75%_50%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(61 123 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(61 123 255 / 0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* abstract digital lines */}
      <svg
        className="absolute inset-y-0 right-0 h-full w-full opacity-80 lg:w-[62%] [mask-image:linear-gradient(to_right,transparent,black_35%)]"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="rgb(61 123 255 / 0.22)" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M0 150 H280 L340 210 H800" />
          <path d="M0 300 H180 L240 240 H520 L580 300 H800" />
          <path d="M0 450 H360 L420 390 H800" />
          <path d="M520 0 V120 L580 180 V600" />
        </g>
        <g strokeWidth="1.4" strokeDasharray="3 37" strokeLinecap="round" vectorEffect="non-scaling-stroke">
          <path className="intro-line" d="M0 150 H280 L340 210 H800" stroke="rgb(34 211 238 / 0.55)" />
          <path className="intro-line" d="M0 450 H360 L420 390 H800" stroke="rgb(61 123 255 / 0.6)" style={{ animationDuration: "4.5s" }} />
          <path className="intro-line" d="M520 0 V120 L580 180 V600" stroke="var(--color-accent)" strokeOpacity="0.55" style={{ animationDuration: "6s" }} />
        </g>
        <g fill="rgb(61 123 255 / 0.55)">
          <circle cx="340" cy="210" r="2.5" />
          <circle cx="240" cy="240" r="2.5" />
          <circle cx="580" cy="300" r="2.5" />
          <circle cx="420" cy="390" r="2.5" />
        </g>
        <circle cx="580" cy="180" r="3" fill="var(--color-accent)" fillOpacity="0.8" />
      </svg>
      {/* slow scanning light along the top rule */}
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <span className="intro-scan absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-electric/60 to-transparent" />
      </div>
    </div>
  );
}

/* ───────── section ───────── */

export default function About() {
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const theme = useTheme();
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);

  // scroll progress through the section feeds the 3D system core
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (s) => {
        progress.current = s.progress;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={section}
      id="about"
      aria-label="About"
      className="relative z-20 overflow-hidden bg-void py-20 shadow-[0_-40px_80px_-40px_rgb(0_0_0/0.8)] md:py-28 light:shadow-[0_-40px_80px_-40px_rgb(15_23_42/0.18)]"
    >
      <IntroBackdrop />
      <div className="container-x relative grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <SectionLabel index="02">INTRODUCTION</SectionLabel>

          <RevealLines
            as="h2"
            className="mt-8 font-display text-[clamp(40px,6.6vw,92px)] font-semibold leading-[0.92] tracking-[-0.04em]"
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

        {/* 3D system core — reacts to scroll */}
        <FadeIn delay={0.2} className="relative h-[300px] sm:h-[380px] lg:col-span-5 lg:h-[560px]">
          <IntroScene
            progress={progress}
            layout={isDesktop ? "desktop" : isMobile ? "mobile" : "tablet"}
            reduced={reduced}
            theme={theme}
          />
        </FadeIn>
      </div>
    </section>
  );
}
