"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { projects, type Project } from "@/lib/data";
import { EXPO, RevealLines, SectionLabel, TechBadge } from "@/components/ui";
import ProjectEnvironment from "./ProjectEnvironment";

const pad = (n: number) => String(n).padStart(2, "0");

function Slide({ project, active }: { project: Project; active: boolean }) {
  const words = project.title.split(" ");
  let charIndex = 0;
  return (
    <article className="relative grid h-full overflow-hidden rounded-[28px] border border-line bg-ink lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div
        className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${project.accent}33, transparent 70%)` }}
        aria-hidden="true"
      />

      {/* environment (top on mobile, right on desktop) */}
      <motion.div
        className="relative order-1 h-[300px] overflow-hidden border-b border-line sm:h-[380px] lg:order-2 lg:h-auto lg:border-b-0 lg:border-l"
        animate={{ scale: active ? 1 : 1.08, opacity: active ? 1 : 0.35 }}
        transition={{ duration: 1.1, ease: EXPO }}
      >
        <ProjectEnvironment project={project} className="absolute inset-0" />
      </motion.div>

      {/* content */}
      <div className="relative order-2 flex flex-col p-6 sm:p-8 lg:order-1 lg:p-12">
        <div className="flex items-center justify-between">
          <span className="block overflow-hidden font-display text-[88px] font-semibold leading-[0.85] tracking-[-0.05em] text-outline lg:text-[140px]">
            <motion.span
              className="block"
              animate={{ y: active ? "0%" : "100%" }}
              transition={{ duration: 0.8, ease: EXPO }}
            >
              {project.number}
            </motion.span>
          </span>
          <span className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-fg-2">
            {project.category.toUpperCase()}
          </span>
        </div>

        <h3 className="mt-6 font-display text-[32px] font-medium leading-[0.98] tracking-[-0.03em] sm:text-[40px] lg:mt-10 lg:text-[52px]" aria-label={project.title}>
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

        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-fg-2 lg:text-base">{project.summary}</p>

        <ul className="mt-6 hidden flex-wrap gap-x-5 gap-y-2 sm:flex">
          {project.features.map((f) => (
            <li key={f} className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-fg-2">
              <span className="size-1 rounded-full" style={{ background: project.accent }} aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2 lg:mt-auto lg:pt-8">
          {project.stack.map((s, i) => (
            <motion.span
              key={s}
              animate={{ y: active ? 0 : 12, opacity: active ? 1 : 0 }}
              transition={{ duration: 0.6, ease: EXPO, delay: active ? 0.35 + i * 0.04 : 0 }}
            >
              <TechBadge tier={/AI/.test(s) ? "ai" : i < 3 ? "primary" : "secondary"}>{s}</TechBadge>
            </motion.span>
          ))}
        </div>

        <Link
          href={`/work/${project.slug}`}
          data-cursor="link"
          className="group mt-8 inline-flex h-13 w-fit items-center gap-3 rounded-full bg-fg px-6 font-mono text-xs font-medium tracking-[0.14em] text-void transition-colors hover:bg-white"
        >
          VIEW CASE STUDY
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  // "DRAG" disc cursor (desktop, fine pointer only)
  const [cursor, setCursor] = useState<"hidden" | "drag" | "link">("hidden");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 350, damping: 35, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 350, damping: 35, mass: 0.6 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx.set(e.clientX);
    my.set(e.clientY);
    const overLink = (e.target as HTMLElement).closest("a,button");
    setCursor(overLink ? "link" : "drag");
  };

  const total = projects.length;

  return (
    <section id="work" className="relative overflow-hidden py-28 md:py-36" style={{ minHeight: "100svh" }}>
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6">
            <SectionLabel index="04">SELECTED WORK</SectionLabel>
            <RevealLines
              lines={["SYSTEMS", "IN PRODUCTION"]}
              className="font-display text-[56px] font-medium leading-[0.92] tracking-[-0.04em] md:text-[96px]"
              lineClassName={(i) => (i === 1 ? "text-outline" : "")}
            />
          </div>

          <div className="flex items-center gap-6">
            <span className="font-mono text-sm tracking-[0.14em] text-fg-2" aria-live="polite">
              <span className="text-fg">{pad(active + 1)}</span> / {pad(total)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={active === 0}
                className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors hover:bg-white/5 disabled:opacity-30"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next project"
                onClick={() => swiperRef.current?.slideNext()}
                disabled={active === total - 1}
                className="grid size-12 place-items-center rounded-full border border-line-strong transition-colors hover:bg-white/5 disabled:opacity-30"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* track: aligned to the container on the left, bleeding off the right edge */}
      <div
        className="relative mt-12 pl-5 md:mt-16 md:pl-10 xl:pl-[max(64px,calc((100vw-1440px)/2+64px))]"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setCursor("hidden")}
      >
        <Swiper
          modules={[Keyboard, Mousewheel, A11y]}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => setActive(s.activeIndex)}
          slidesPerView={1.08}
          spaceBetween={12}
          breakpoints={{ 768: { slidesPerView: 1.1, spaceBetween: 20 }, 1024: { slidesPerView: 1.15, spaceBetween: 24 } }}
          speed={900}
          grabCursor
          keyboard={{ enabled: true }}
          mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
          a11y={{ prevSlideMessage: "Previous project", nextSlideMessage: "Next project" }}
          className="pr-5! md:pr-10!"
        >
          {projects.map((p, i) => (
            <SwiperSlide key={p.slug} className="h-auto! lg:h-[min(78svh,760px)]!">
              <Slide project={p} active={i === active} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* progress + hint */}
      <div className="container-x mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2 md:max-w-xl" role="tablist" aria-label="Projects">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${p.number} ${p.title}`}
              onClick={() => swiperRef.current?.slideTo(i)}
              className="group flex flex-1 flex-col gap-2 py-2 text-left"
            >
              <span className="relative h-px w-full overflow-hidden bg-line-strong">
                <motion.span
                  className="absolute inset-y-0 left-0 w-full origin-left bg-fg"
                  animate={{ scaleX: i <= active ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: EXPO }}
                />
              </span>
              <span className={`font-mono text-[10px] tracking-[0.14em] transition-colors ${i === active ? "text-fg" : "text-fg-3 group-hover:text-fg-2"}`}>
                {p.number}
              </span>
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] tracking-[0.2em] text-fg-3">← DRAG / SWIPE →</span>
      </div>

      {/* DRAG disc */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          className="-ml-11 -mt-11 grid size-22 place-items-center rounded-full border border-white/20 bg-white/10 font-mono text-[10px] tracking-[0.18em] text-fg backdrop-blur-md"
          animate={{ scale: cursor === "drag" ? 1 : cursor === "link" ? 0.35 : 0, opacity: cursor === "hidden" ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EXPO }}
        >
          <span style={{ opacity: cursor === "drag" ? 1 : 0 }}>DRAG</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
