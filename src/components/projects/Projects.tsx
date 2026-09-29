"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects, type Project } from "@/lib/data";
import { EXPO, RevealLines, SectionLabel, TechBadge } from "@/components/ui";
import { useReducedMotion } from "@/lib/hooks";
import ProjectEnvironment from "./ProjectEnvironment";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

/** Desktop + motion allowed: the section pins and vertical scroll drives the track sideways. */
const PINNED_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

function Card({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const active = inView || reduced;
  const words = project.title.split(" ");
  let charIndex = 0;

  return (
    <article
      ref={ref}
      className="project-card relative flex w-[86vw] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-line bg-ink sm:w-[62vw] md:w-[46vw] lg:w-[clamp(400px,38vw,580px)] lg:motion-safe:h-[min(74svh,700px)]"
    >
      <div
        className="pointer-events-none absolute -left-32 -top-32 size-[380px] rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${project.accent}33, transparent 70%)` }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col px-5 pt-5 sm:px-6 sm:pt-6 lg:px-7 lg:pt-7">
        <div className="flex items-center justify-between gap-4">
          <span className="block overflow-hidden font-display text-[56px] font-semibold leading-[0.85] tracking-[-0.05em] text-outline lg:text-[72px]">
            <motion.span className="block" animate={{ y: active ? "0%" : "100%" }} transition={{ duration: 0.8, ease: EXPO }}>
              {project.number}
            </motion.span>
          </span>
          <span className="rounded-full border border-line px-3 py-1.5 text-right font-mono text-[10px] tracking-[0.16em] text-fg-2">
            {project.category.toUpperCase()}
          </span>
        </div>

        <h3 className="mt-4 font-display text-[26px] font-medium leading-[0.98] tracking-[-0.03em] lg:text-[32px]" aria-label={project.title}>
          {words.map((w, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap" aria-hidden="true">
              {w.split("").map((ch) => {
                const i = charIndex++;
                return (
                  <motion.span
                    key={i}
                    className="inline-block"
                    animate={{ x: active ? 0 : 40, opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: EXPO, delay: active ? 0.1 + i * 0.015 : 0 }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          ))}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-fg-2 lg:text-[15px]">{project.summary}</p>

        {project.stack.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((s, i) => (
              <motion.span
                key={s}
                animate={{ y: active ? 0 : 12, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EXPO, delay: active ? 0.35 + i * 0.04 : 0 }}
              >
                <TechBadge tier={/AI/.test(s) ? "ai" : i < 3 ? "primary" : "secondary"}>{s}</TechBadge>
              </motion.span>
            ))}
            {project.stack.length > 5 && (
              <span className="inline-flex items-center px-1.5 font-mono text-xs text-fg-3">+{project.stack.length - 5}</span>
            )}
          </div>
        )}
      </div>

      {/* environment */}
      <motion.div
        className="relative mx-5 mt-5 h-[210px] overflow-hidden rounded-2xl border border-line sm:mx-6 sm:h-[240px] lg:mx-7 lg:h-[260px] lg:motion-safe:h-auto lg:motion-safe:min-h-[150px] lg:motion-safe:flex-1"
        animate={{ scale: active ? 1 : 1.06, opacity: active ? 1 : 0.35 }}
        transition={{ duration: 1.1, ease: EXPO }}
      >
        <ProjectEnvironment project={project} className="h-full w-full" />
      </motion.div>

      <div className="relative px-5 pb-5 pt-5 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7">
        <Link
          href={`/work/${project.slug}`}
          data-cursor="link"
          className="group inline-flex h-11 w-fit items-center gap-3 rounded-full bg-fg px-5 font-mono text-xs font-medium tracking-[0.14em] text-void transition-colors hover:bg-contrast"
        >
          VIEW PROJECT
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

function Heading({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <SectionLabel index="05">SELECTED WORK</SectionLabel>
      <RevealLines
        lines={["SYSTEMS", "IN PRODUCTION"]}
        className={`font-display font-medium leading-[0.92] tracking-[-0.04em] ${
          compact ? "text-[clamp(52px,5vw,80px)]" : "text-[56px] md:text-[80px] xl:text-[96px]"
        }`}
        lineClassName={(i) => (i === 1 ? "text-outline" : "")}
      />
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const total = projects.length;

  const setIndex = (i: number) => {
    if (i === activeRef.current) return;
    activeRef.current = i;
    setActive(i);
  };

  useEffect(() => {
    const el = root.current;
    const trackEl = track.current;
    if (!el || !trackEl) return;
    const mm = gsap.matchMedia(el);

    // pinned: vertical scroll → horizontal track, then the page scrolls on
    mm.add(PINNED_QUERY, () => {
      const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);
      const tween = gsap.to(trackEl, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
          onUpdate: (s) => setIndex(Math.round(s.progress * (total - 1))),
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
      return () => {
        trigger.current = null;
      };
    });

    // swipe (mobile, tablet, reduced motion): native horizontal touch scroll inside the track
    mm.add(`not all and ${PINNED_QUERY}`, () => {
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const max = trackEl.scrollWidth - trackEl.clientWidth;
          setIndex(max > 0 ? Math.round((trackEl.scrollLeft / max) * (total - 1)) : 0);
        });
      };
      onScroll();
      trackEl.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        trackEl.removeEventListener("scroll", onScroll);
      };
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [total]);

  const goTo = (i: number, instant = false) => {
    const trackEl = track.current;
    if (!trackEl) return;
    const st = trigger.current;
    if (st) {
      const y = st.start + (i / (total - 1)) * (st.end - st.start);
      if (window.__lenis) window.__lenis.scrollTo(y, instant ? { immediate: true } : { duration: 1.2 });
      else window.scrollTo({ top: y, behavior: instant ? "auto" : "smooth" });
      return;
    }
    const card = trackEl.querySelectorAll<HTMLElement>(".project-card")[i];
    if (card) trackEl.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(trackEl).paddingLeft), behavior: "smooth" });
  };

  // keyboard focus inside the pinned track: bring that card into view instead of letting the browser scroll the clipped container
  const onFocus = (e: React.FocusEvent) => {
    if (!trigger.current) return;
    const cards = Array.from(track.current?.querySelectorAll(".project-card") ?? []);
    const i = cards.findIndex((c) => c.contains(e.target as Node));
    requestAnimationFrame(() => {
      if (pin.current) pin.current.scrollLeft = 0;
    });
    if (i >= 0) goTo(i, true);
  };

  return (
    <section ref={root} id="work" aria-label="Selected work" className="relative">
      <div ref={pin} className="relative overflow-hidden py-20 md:py-28 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:py-0 lg:motion-safe:pt-16">
        {/* heading above the swipe track */}
        <div className="container-x lg:motion-safe:hidden">
          <Heading />
        </div>

        {/* track */}
        <div
          ref={track}
          onFocusCapture={onFocus}
          className="relative mt-10 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 [scrollbar-width:none] md:mt-14 md:gap-5 md:px-10 [&::-webkit-scrollbar]:hidden lg:motion-safe:mt-0 lg:motion-safe:w-max lg:motion-safe:snap-none lg:motion-safe:items-center lg:motion-safe:gap-6 lg:motion-safe:overflow-visible lg:motion-safe:px-0 lg:motion-safe:pb-0 lg:motion-safe:will-change-transform"
        >
          {/* intro panel — pinned mode only */}
          <div className="box-content hidden w-[min(34vw,560px)] shrink-0 flex-col justify-center gap-10 pl-10 xl:pl-[max(64px,calc((100vw-1440px)/2+64px))] lg:motion-safe:flex">
            <Heading compact />
            <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-fg-3">
              SCROLL TO EXPLORE <span aria-hidden="true">→</span>
            </p>
          </div>

          {projects.map((p) => (
            <Card key={p.slug} project={p} />
          ))}

          <div className="hidden w-[6vw] shrink-0 lg:motion-safe:block" aria-hidden="true" />
        </div>

        {/* progress */}
        <div className="container-x mt-8 flex items-center justify-between gap-6 md:mt-10 lg:motion-safe:mt-6">
          <span className="shrink-0 font-mono text-sm tracking-[0.14em] text-fg-2" aria-live="polite">
            <span className="text-fg">{pad(active + 1)}</span> / {pad(total)}
          </span>
          <div className="flex flex-1 gap-2 md:max-w-xl" role="tablist" aria-label="Projects">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`${p.number} ${p.title}`}
                onClick={() => goTo(i)}
                className="group flex flex-1 flex-col py-3"
              >
                <span className="relative h-px w-full overflow-hidden bg-line-strong">
                  <motion.span
                    className="absolute inset-y-0 left-0 w-full origin-left bg-fg"
                    animate={{ scaleX: i <= active ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: EXPO }}
                  />
                </span>
              </button>
            ))}
          </div>
          <span className="hidden shrink-0 font-mono text-[11px] tracking-[0.2em] text-fg-3 md:inline">
            <span className="lg:motion-safe:hidden">← SWIPE →</span>
            <span className="hidden lg:motion-safe:inline">SCROLL ↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}
