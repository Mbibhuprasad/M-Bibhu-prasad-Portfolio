"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile, type Tier } from "@/lib/data";
import { useIsDesktop, useIsMobile, useReducedMotion } from "@/lib/hooks";
import { ButtonLink, EXPO, TechBadge } from "@/components/ui";
import type { HeroLayout } from "./HeroScene";

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Chip = { name: string; tier: Tier; x: number; y: number; line?: [number, number, number, number] };

/* positions are % of a square box (side = hero height) centred on the core */
const DESKTOP_CHIPS: Chip[] = [
  { name: "React", tier: "secondary", x: 76.4, y: 24.4, line: [77.6, 26, 66.1, 37.1] },
  { name: "Next.js", tier: "primary", x: 80.3, y: 41.0, line: [81.5, 42.6, 71.4, 45.8] },
  { name: "Node.js", tier: "primary", x: 78.3, y: 62.5, line: [79.6, 64.1, 71, 60.7] },
  { name: "AWS", tier: "primary", x: 67.6, y: 78.1, line: [68.8, 79.7, 62.9, 71.1] },
  { name: "MongoDB", tier: "secondary", x: 42.2, y: 83.0, line: [43.5, 84.6, 45.5, 74.7] },
  { name: "MySQL", tier: "primary", x: 20.7, y: 76.2, line: [22, 77.7, 33.2, 67.7] },
  { name: "AI", tier: "ai", x: 35.4, y: 23.4, line: [36.6, 25, 40.2, 32.5] },
];

const COMPACT_CHIPS: Chip[] = [
  { name: "React", tier: "secondary", x: 66, y: 12 },
  { name: "Next.js", tier: "primary", x: 4, y: 28 },
  { name: "Node.js", tier: "primary", x: 68, y: 80 },
  { name: "AI", tier: "ai", x: 12, y: 74 },
];

export default function Hero() {
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const layout: HeroLayout = isDesktop ? "desktop" : isMobile ? "mobile" : "tablet";

  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const nameOuter = useRef<HTMLDivElement>(null);
  const nameParallax = useRef<HTMLDivElement>(null);
  const chipsOuter = useRef<HTMLDivElement>(null);
  const chipsParallax = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);

  // scroll-out: name opens up and fades, camera flies into the core
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (s) => {
          progress.current = s.progress;
        },
      });
      gsap
        .timeline({
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom bottom", scrub: 1 },
        })
        .to(nameOuter.current, { letterSpacing: "0.06em", opacity: 0, y: -70, ease: "none", duration: 0.7 }, 0)
        .to(intro.current, { opacity: 0, y: 40, ease: "none", duration: 0.5 }, 0)
        .to(hud.current, { opacity: 0, ease: "none", duration: 0.3 }, 0)
        .to(chipsOuter.current, { opacity: 0, scale: 1.35, ease: "none", duration: 0.65 }, 0)
        .to(fade.current, { opacity: 1, ease: "none", duration: 0.3 }, 0.7);
    }, section);
    return () => ctx.revert();
  }, []);

  // pointer: feeds the 3D scene and drives DOM parallax layers
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (reduced) return () => window.removeEventListener("pointermove", onMove);

    const cur = { x: 0, y: 0 };
    let raf = 0;
    const loop = () => {
      cur.x += (pointer.current.x - cur.x) * 0.06;
      cur.y += (pointer.current.y - cur.y) * 0.06;
      if (window.scrollY < window.innerHeight * 2) {
        const dx = (cur.x * window.innerWidth) / 2;
        const dy = (-cur.y * window.innerHeight) / 2;
        if (nameParallax.current) nameParallax.current.style.transform = `translate3d(${-dx * 0.02}px, ${-dy * 0.02}px, 0)`;
        if (chipsParallax.current) chipsParallax.current.style.transform = `translate3d(${dx * 0.08}px, ${dy * 0.08}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  const chips = isDesktop ? DESKTOP_CHIPS : COMPACT_CHIPS;

  return (
    <section ref={section} aria-label="Introduction" className="relative h-[200svh]">
      <div className="sticky top-0 h-svh min-h-[760px] overflow-hidden lg:min-h-[720px]">
        {/* ambient glow behind the core */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[65.3%] lg:top-[52.7%] lg:w-auto lg:h-[82%]"
          style={{ background: "radial-gradient(circle, rgba(61,123,255,0.20) 0%, rgba(139,92,246,0.08) 38%, rgba(5,6,10,0) 68%)" }}
        />

        {/* receding floor grid */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 424"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-0 left-0 h-[42%] w-full [mask-image:linear-gradient(to_bottom,transparent,black_60%)]"
        >
          <g stroke="rgba(61,123,255,0.14)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
            {[-620, -200, 180, 560, 940, 1320, 1700, 2080, 2500].map((x) => (
              <line key={x} x1={940} y1={0} x2={x} y2={424} vectorEffect="non-scaling-stroke" />
            ))}
            {[40, 92, 160, 250, 370].map((y) => (
              <line key={y} x1={0} y1={y} x2={1440} y2={y} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        </svg>

        {/* display name — sits behind the core */}
        <div className="container-x relative z-10 pt-24 lg:pt-[112px]">
          <motion.p
            className="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            [ 00 ]&nbsp; PORTFOLIO — 2026 <span className="hidden sm:inline">&nbsp;/&nbsp; SOFTWARE ENGINEERING</span>
          </motion.p>
          <div ref={nameOuter} className="mt-3 lg:-ml-2">
            <div ref={nameParallax} className="will-change-transform">
              <h1 className="font-display text-[clamp(76px,22vw,196px)] font-semibold leading-[0.84] tracking-[-0.045em] lg:text-[clamp(120px,13.6vw,196px)]">
                <span className="block overflow-hidden pb-[0.04em]">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.2, ease: EXPO, delay: 0.15 }}
                  >
                    BIBHU
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.04em]">
                  <motion.span
                    className="text-outline block"
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.2, ease: EXPO, delay: 0.25 }}
                  >
                    PRASAD
                  </motion.span>
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* 3D digital core */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: EXPO, delay: 0.3 }}
        >
          <HeroScene progress={progress} pointer={pointer} layout={layout} reduced={reduced} />
        </motion.div>

        {/* floating technology chips */}
        <div
          ref={chipsOuter}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[calc(42%-50vw)] z-30 aspect-square w-full lg:left-[65.3%] lg:top-0 lg:h-full lg:w-auto lg:-translate-x-1/2"
        >
          <div ref={chipsParallax} className="relative h-full w-full will-change-transform">
            {isDesktop && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                {chips.map((c) =>
                  c.line ? (
                    <line
                      key={c.name}
                      x1={c.line[0]}
                      y1={c.line[1]}
                      x2={c.line[2]}
                      y2={c.line[3]}
                      stroke="rgba(125,160,255,0.28)"
                      strokeWidth="1"
                      strokeDasharray="2 4"
                      vectorEffect="non-scaling-stroke"
                    />
                  ) : null
                )}
              </svg>
            )}
            {chips.map((c, i) => (
              <motion.div
                key={c.name}
                className="absolute"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EXPO, delay: 0.9 + i * 0.07 }}
              >
                <div style={{ animation: reduced ? undefined : `float-y ${4 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }}>
                  <TechBadge tier={c.tier} className={c.tier === "ai" ? "border-violet/45" : ""}>
                    {c.name}
                  </TechBadge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* role + intro */}
        <div
          ref={intro}
          className="container-x absolute inset-x-0 bottom-10 z-30 lg:bottom-auto lg:top-[52.7%]"
        >
          <motion.div
            className="flex max-w-[520px] flex-col gap-4 lg:gap-[22px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EXPO, delay: 0.55 }}
          >
            <span className="label hidden lg:block">— ROLE</span>
            <h2 className="font-display text-[36px] font-medium leading-none tracking-[-0.03em] lg:text-[52px]">
              <span className="block">FULL-STACK</span>
              <span className="text-aura block">DEVELOPER</span>
            </h2>
            <p className="max-w-[460px] text-[15px] leading-relaxed text-fg-2 lg:text-[17px]">
              Building scalable web applications, SaaS platforms, healthcare systems, business software and modern digital experiences.
            </p>
            <div className="mt-1 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <ButtonLink href="#work" className="w-full sm:w-auto">
                VIEW SELECTED WORK <span aria-hidden="true">→</span>
              </ButtonLink>
              <ButtonLink href={profile.resume} variant="secondary" download className="w-full sm:w-auto">
                DOWNLOAD RESUME <span aria-hidden="true">↓</span>
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* HUD: scene rail + readouts */}
        <div ref={hud} className="z-30">
          <div
            aria-hidden="true"
            className="absolute right-12 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2.5 font-mono text-[10px] tracking-[0.14em] text-fg-3 lg:flex"
          >
            <span className="text-fg">01</span>
            <span className="h-0.5 w-6 bg-electric" />
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="h-px w-3 bg-fg/25" />
            ))}
            <span>10</span>
          </div>

          <div className="container-x absolute inset-x-0 bottom-9 z-30 hidden items-end justify-between font-mono text-[11px] tracking-[0.14em] text-fg-3 lg:flex">
            <span>BHUBANESWAR, IN &nbsp;·&nbsp; 20.29° N / 85.82° E</span>
            <a href="#about" className="flex flex-col items-center gap-2.5 text-fg transition-opacity hover:opacity-80">
              <span className="relative h-9 w-px overflow-hidden bg-gradient-to-b from-transparent to-electric" aria-hidden="true" />
              SCROLL TO ENTER ↓
            </a>
            <span>SCENE 01 — ENTRY</span>
          </div>
        </div>

        {/* end-of-scene fade into the next world */}
        <div ref={fade} aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 bg-void opacity-0" />
      </div>
    </section>
  );
}
