"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data";
import { ButtonLink, FadeIn, Magnetic, RevealLines, SectionLabel } from "@/components/ui";

gsap.registerPlugin(ScrollTrigger);

const RINGS = 9;

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const tunnel = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        tunnel.current,
        { scale: 0.75, opacity: 0.4 },
        { scale: 1.35, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 1 } }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section ref={root} id="contact" className="relative flex min-h-screen items-center overflow-hidden py-32 md:py-40">
      {/* tunnel horizon */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <svg ref={tunnel} className="h-[140vmax] w-[140vmax] shrink-0 will-change-transform" viewBox="-500 -500 1000 1000" fill="none">
          <defs>
            <radialGradient id="tunnel-core" cx="0" cy="0" r="500" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#3d7bff" stopOpacity="0.28" />
              <stop offset="0.35" stopColor="#8b5cf6" stopOpacity="0.08" />
              <stop offset="1" stopColor="#05060a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="500" fill="url(#tunnel-core)" />
          {Array.from({ length: RINGS }).map((_, i) => {
            const t = (i + 1) / RINGS;
            const r = 30 + Math.pow(t, 2.2) * 470;
            return (
              <ellipse
                key={i}
                cx="0"
                cy={r * 0.08}
                rx={r}
                ry={r * 0.62}
                style={{ stroke: i % 3 === 0 ? "rgba(34,211,238,0.22)" : "rgb(var(--rgb-fg) / 0.08)" }}
                strokeWidth={1}
                strokeDasharray={i % 2 ? "2 6" : undefined}
              />
            );
          })}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 30}
                y1={Math.sin(a) * 18}
                x2={Math.cos(a) * 500}
                y2={Math.sin(a) * 310}
                stroke="rgba(61,123,255,0.07)"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-void)_75%)]" />
      </div>

      <div className="container-x relative">
        <SectionLabel index="09">CONTACT</SectionLabel>

        <RevealLines
          className="mt-10 font-display text-[64px] font-semibold leading-[0.88] tracking-[-0.045em] sm:text-[96px] md:text-[128px] lg:text-[168px]"
          lines={["LET'S BUILD", <span key="s" className="text-outline">SOMETHING</span>, <span key="g" className="text-aura">GREAT.</span>]}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-fg-2 md:text-xl">
              Have a project, product or idea? Let&apos;s turn it into a real software system.
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="lg:col-span-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Magnetic>
                <ButtonLink href={`mailto:${profile.email}?subject=Project%20enquiry`} className="w-full sm:w-auto">
                  START A PROJECT <span aria-hidden="true">→</span>
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href={profile.github} variant="secondary" external className="w-full sm:w-auto">
                  VIEW GITHUB <span aria-hidden="true">↗</span>
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href={profile.linkedin} variant="secondary" external className="w-full sm:w-auto">
                  LINKEDIN <span aria-hidden="true">↗</span>
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href={profile.resume} variant="secondary" download className="w-full sm:w-auto">
                  DOWNLOAD RESUME <span aria-hidden="true">↓</span>
                </ButtonLink>
              </Magnetic>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-20 flex flex-col gap-8 border-t border-line pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="label mb-4">Email</div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all font-display text-2xl font-medium tracking-[-0.02em] transition-colors hover:text-cyan sm:text-3xl md:text-[40px]"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="glass inline-flex h-11 items-center gap-2 rounded-full px-4 font-mono text-[11px] tracking-[0.14em] text-fg-2 transition-colors hover:text-fg"
                  aria-live="polite"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {copied ? (
                      <path d="m5 12 5 5 9-10" />
                    ) : (
                      <>
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                      </>
                    )}
                  </svg>
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
            </div>
            <div>
              <div className="label mb-4">Location</div>
              <div className="text-lg text-fg">Bhubaneswar, India</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
