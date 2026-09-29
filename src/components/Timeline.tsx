"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "@/lib/data";
import { FadeIn, RevealLines, SectionLabel } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

type Entry = (typeof timeline)[number];

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <div className="rounded-2xl border border-line bg-ink/80 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.14em] text-fg-3">
        <span>
          {entry.period.toUpperCase()} · {entry.type.toUpperCase()}
        </span>
        {entry.present && (
          <span className="flex items-center gap-2 text-signal">
            <span className="pulse-dot size-1.5 rounded-full bg-signal" /> NOW
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-[28px] font-medium uppercase leading-[1.05] tracking-[-0.02em]">{entry.role}</h3>
      <p className="mt-2 text-fg-2">{entry.org}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-fg-2">
        {entry.highlights.map((h) => (
          <li key={h} className="flex gap-2.5">
            <span className="mt-[9px] h-px w-2.5 shrink-0 bg-accent/70" aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>
      <ul className="mt-5 flex flex-wrap gap-2">
        {entry.tags.map((t) => (
          <li key={t} className="rounded-md border border-line px-2 py-1 font-mono text-[11px] tracking-[0.06em] text-fg-2">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Node({ present }: { present: boolean }) {
  return (
    <span className="tl-node absolute left-0 top-[58%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
      <span className="tl-ring absolute inset-0 rounded-full border border-electric opacity-0" />
      <span
        className={`relative grid size-4 place-items-center rounded-full border ${
          present ? "pulse-dot border-signal bg-signal/20" : "border-electric bg-void"
        }`}
      >
        <span className={`size-1.5 rounded-full ${present ? "bg-signal" : "bg-electric shadow-[0_0_10px_#3d7bff]"}`} />
      </span>
    </span>
  );
}

function YearMarker({ year }: { year: string }) {
  return (
    <div className="relative h-full w-[46vw] max-w-[640px] shrink-0">
      <div
        className="tl-year absolute left-0 top-[20%] font-display text-[clamp(160px,18vw,280px)] font-semibold leading-none tracking-[-0.05em] text-outline"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      >
        {year}
      </div>
      <span className="absolute left-0 top-[58%] h-10 w-px -translate-y-1/2 bg-line-strong" aria-hidden="true" />
      <span className="label absolute left-3 top-[calc(58%+20px)] text-[10px]">YEAR {year}</span>
    </div>
  );
}

function DesktopEntry({ entry }: { entry: Entry }) {
  return (
    <div className="relative h-full w-[34vw] min-w-[420px] max-w-[520px] shrink-0">
      <div className="absolute bottom-[calc(42%+40px)] left-0 w-[400px] -translate-x-6">
        <EntryCard entry={entry} />
      </div>
      <span className="absolute bottom-[42%] left-0 h-10 w-px bg-gradient-to-b from-transparent to-electric/60" aria-hidden="true" />
      <Node present={entry.present} />
    </div>
  );
}

export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const pinEl = pin.current!;
      const trackEl = track.current!;
      const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

      const trackTween = gsap.to(trackEl, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pinEl,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(fill.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: pinEl, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
      });

      gsap.to(floor.current, {
        backgroundPositionX: () => `-${dist() * 0.6}px`,
        ease: "none",
        scrollTrigger: { trigger: pinEl, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
      });

      gsap.utils.toArray<HTMLElement>(".tl-year").forEach((year) => {
        gsap.fromTo(
          year,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: { containerAnimation: trackTween, trigger: year, start: "left 85%", end: "left 35%", scrub: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".tl-node").forEach((node) => {
        const ring = node.querySelector(".tl-ring");
        gsap.fromTo(
          ring,
          { scale: 1, opacity: 0.9 },
          {
            scale: 3.2,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            immediateRender: false,
            scrollTrigger: { containerAnimation: trackTween, trigger: node, start: "left 55%", toggleActions: "play none none reset" },
          }
        );
      });
    });

    // reduced motion on desktop: reveal years statically
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
      gsap.set(".tl-year", { clipPath: "inset(0 0% 0 0)" });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, []);

  const byYear = timeline.reduce<Record<string, Entry[]>>((acc, e) => {
    (acc[e.year] ||= []).push(e);
    return acc;
  }, {});

  return (
    <section ref={root} id="experience" className="relative">
      {/* ───────── Desktop: pinned horizontal camera track ───────── */}
      <div ref={pin} className="relative hidden h-screen overflow-hidden lg:block">
        {/* perspective floor */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] [perspective:600px]" aria-hidden="true">
          <div
            ref={floor}
            className="absolute inset-x-[-50%] bottom-0 h-[200%] origin-bottom [mask-image:linear-gradient(to_top,black_10%,transparent_80%)]"
            style={{
              transform: "rotateX(72deg)",
              backgroundImage:
                "linear-gradient(rgba(61,123,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(61,123,255,0.18) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="container-x relative z-10 pt-32">
          <SectionLabel index="06">EXPERIENCE</SectionLabel>
        </div>

        {/* rail + progress */}
        <div className="absolute inset-x-16 top-[58%] z-0 h-px bg-line-strong" aria-hidden="true">
          <div ref={fill} className="h-full origin-left scale-x-0 bg-gradient-to-r from-electric via-violet to-cyan" />
        </div>

        {/* camera marker */}
        <div className="pointer-events-none absolute left-1/2 top-[58%] z-20 -translate-x-1/2" aria-hidden="true">
          <span className="absolute left-0 top-0 h-24 w-px -translate-y-full bg-gradient-to-t from-cyan/70 to-transparent" />
          <span className="absolute left-2 top-[-96px] whitespace-nowrap font-mono text-[10px] tracking-[0.16em] text-cyan">CAMERA</span>
        </div>

        {/* horizontal track */}
        <div ref={track} className="absolute inset-y-0 left-0 z-10 flex will-change-transform">
          <div className="h-full w-[18vw] shrink-0" />
          <div className="relative h-full w-[40vw] shrink-0">
            <RevealLines
              className="absolute left-0 top-[26%] font-display text-[clamp(64px,7vw,112px)] font-medium leading-[0.92] tracking-[-0.04em]"
              lines={["THE", "JOURNEY", <span key="s" className="text-outline">SO FAR</span>]}
            />
          </div>
          {Object.entries(byYear).map(([year, entries]) => (
            <Fragment key={year}>
              <YearMarker year={year} />
              {entries.map((e) => (
                <DesktopEntry key={e.role} entry={e} />
              ))}
            </Fragment>
          ))}
          <div className="h-full w-[40vw] shrink-0" />
        </div>
      </div>

      {/* ───────── Mobile / tablet: vertical timeline ───────── */}
      <div className="container-x py-32 md:py-40 lg:hidden">
        <SectionLabel index="06">EXPERIENCE</SectionLabel>
        <RevealLines
          className="mt-8 font-display text-[56px] font-medium leading-[0.95] tracking-[-0.035em] md:text-[80px]"
          lines={["THE JOURNEY", <span key="s" className="text-outline">SO FAR</span>]}
        />

        <div className="relative mt-16">
          <span className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-electric via-violet to-transparent" aria-hidden="true" />
          {Object.entries(byYear).map(([year, entries]) => (
            <div key={year} className="relative pb-12">
              <div className="sticky top-20 z-10 mb-6 pl-8">
                <span className="glass inline-flex h-9 items-center rounded-full px-4 font-display text-lg font-semibold tracking-[-0.02em]">
                  {year}
                </span>
              </div>
              <ul className="space-y-6">
                {entries.map((e, i) => (
                  <li key={e.role} className="relative pl-8">
                    <span
                      className={`absolute left-0 top-7 grid size-4 place-items-center rounded-full border ${
                        e.present ? "pulse-dot border-signal bg-signal/20" : "border-electric bg-void"
                      }`}
                      aria-hidden="true"
                    >
                      <span className={`size-1.5 rounded-full ${e.present ? "bg-signal" : "bg-electric"}`} />
                    </span>
                    <FadeIn delay={i * 0.08}>
                      <EntryCard entry={e} />
                    </FadeIn>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
